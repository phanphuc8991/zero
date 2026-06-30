"use client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { markLessonCompleted } from "@/features/user/course/server-action";
import {
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Play,
  Lock,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const LearningPoint = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2">
    <CircleCheck className="text-emerald-500 shrink-0 mt-0.5 w-3.5 h-3.5" />
    <span className="text-slate-600 text-[0.82rem]">{text}</span>
  </div>
);

function Description({
  description,
  skillsGained,
}: {
  description: string;
  skillsGained: any;
}) {
  return (
    <div>
      <h2 className="text-slate-800 mb-4 font-bold text-[1.1rem]">
        Course Description
      </h2>

      <div className="text-slate-600 space-y-3 text-[0.9rem] leading-snug">
        {description}
      </div>

      <div className="pt-2">
        <p className="text-slate-700 mb-3 font-semibold text-[0.88rem]">
          What you'll learn:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {skillsGained.map((point: any, index: string) => (
            <LearningPoint key={index} text={point} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoPlayer({
  lesson,
  onComplete,
}: {
  lesson: any;
  onComplete: () => void;
}) {
  const isMarkedRef = useRef(false);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const progress = video.currentTime / video.duration;

    if (progress >= 0.9 && !isMarkedRef.current) {
      isMarkedRef.current = true;
      onComplete();
    }
  };

  return (
    <div className="relative aspect-video h-full w-full overflow-hidden">
      {lesson?.videoUrl ? (
        <video
          key={lesson?.id}
          src={lesson?.videoUrl}
          onTimeUpdate={handleTimeUpdate}
          className="h-full w-full object-cover"
          controls
          preload="metadata"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-slate-400">Select a lesson to start</p>
        </div>
      )}
    </div>
  );
}

const LessonList = ({
  lesson,
  navigateToLesson,
  isActive,
}: {
  lesson: any;
  navigateToLesson: any;
  isActive: boolean;
}) => {
  const { status, title, id } = lesson;
  const renderLessonStatus = (status: string) => {
    if (isActive) {
      return (
        <div className="w-3.5 h-3.5 rounded-full bg-orange-500 flex items-center justify-center">
          <Play className="w-1.75 h-1.75 text-white" />
        </div>
      );
    }
    switch (status) {
      case "done":
        return (
          <CircleCheck className="w-4 h-4 text-emerald-500 fill-emerald-50" />
        );
      case "locked":
        return <Lock className="w-3.5 h-3.5 text-slate-300" />;
      case "available":
      default:
        return (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
        );
    }
  };
  return (
    <button
      disabled={status === "locked"}
      onClick={() => navigateToLesson(id)}
      className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors border-l-2 
        ${isActive ? "bg-orange-50 border-orange-500" : "border-transparent hover:bg-slate-50"}
        ${status === "locked" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="shrink-0 mt-0.5">{renderLessonStatus(status)}</div>
      <div className="flex-1 min-w-0">
        <p
          className={`font-normal text-[0.78rem] truncate ${
            isActive ? "text-orange-600 font-medium" : "text-slate-700"
          }`}
        >
          {title}
        </p>
      </div>
    </button>
  );
};

function ChapterList({
  chapter,
  navigateToLesson,
  activeLessonId,
  index,
}: {
  chapter: any;
  navigateToLesson: any;
  activeLessonId: number | null;
  index: string;
}) {
  const { completedLessons, totalLessons, lessons } = chapter;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-2 px-4 py-3 bg-slate-50/60 hover:bg-slate-100/80 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-slate-700 pr-2 leading-snug text-[0.78rem] font-bold">
            Module{index + 1}: {chapter.title}
          </p>
          <p className="text-slate-400 mt-0.5 text-[0.7rem]">
            {completedLessons}/{totalLessons} lessons
          </p>
        </div>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        )}
      </button>

      {isOpen && (
        <div>
          {lessons.map((lesson: any) => (
            <LessonList
              key={lesson.id}
              lesson={lesson}
              navigateToLesson={navigateToLesson}
              isActive={lesson.id === activeLessonId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseSideBarHeader({
  totalLessonsForCourse,
  completedLessonsForCourse,
  courseProgress,
}: {
  totalLessonsForCourse: number;
  completedLessonsForCourse: number;
  courseProgress: number;
}) {
  return (
    <div className="px-4 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
      <h3 className="text-slate-800 mb-1 text-[0.95rem] font-bold">
        Course Content
      </h3>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span>
          {completedLessonsForCourse} / {totalLessonsForCourse} lessons
          completed
        </span>
        <span className="text-orange-500 font-medium">{courseProgress}%</span>
      </div>
      <Progress
        value={courseProgress}
        aria-label={`Course progress: ${courseProgress}%`}
        className="bg-slate-200 [&>div]:bg-orange-500 w-full h-1.5"
      />
    </div>
  );
}

export function DetailCourse({ course }: { course: any }) {
  console.log("course", course);
  const {
    completedLessons,
    totalLessons,
    progress,
    chapters,
    skillsGained,
    description,
  } = course;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const lessonIdFromUrl = parseInt(searchParams.get("id") || "");

  const navigateToLesson = (lessonId: number) =>
    router.push(`${pathname}?id=${lessonId}`, { scroll: false });
  const activeLesson = useMemo(() => {
    if (lessonIdFromUrl) {
      const foundLesson = course.chapters
        .flatMap((ch: any) => ch.lessons)
        .find((l: any) => l.id === lessonIdFromUrl);
      return foundLesson || course.firstLesson;
    }
    return course.firstLesson;
  }, [lessonIdFromUrl, course]);

  const handleLessonComplete = async (lessonId: number) => {
    await markLessonCompleted(lessonId);
  };

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    const allLessons = course.chapters.flatMap((ch: any) => ch.lessons);
    const targetLesson = allLessons.find(
      (l: any) => l.id === parseInt(idFromUrl || ""),
    );
    const isInvalid =
      !idFromUrl || !targetLesson || targetLesson.status === "locked";

    if (isInvalid && course.firstLesson?.id) {
      router.replace(`${pathname}?id=${course.firstLesson.id}`, {
        scroll: false,
      });
    }
  }, [searchParams, pathname, router, course]);
  return (
    <div>
      <h1 className="text-black mb-10 text-[1.65rem] font-bold leading-tight">
        {course.title}
      </h1>
      <div className="grid grid-cols-3 gap-5">
        <div className="grid col-span-2 gap-5">
          <Card className="p-0 overflow-hidden">
            <VideoPlayer
              lesson={activeLesson}
              onComplete={() => handleLessonComplete(activeLesson.id)}
            />
          </Card>
          <Card className="p-6">
            <Description
              description={description}
              skillsGained={skillsGained}
            />
          </Card>
        </div>
        <div className="col-span-1">
          <Card className="p-0 overflow-hidden gap-0">
            <CourseSideBarHeader
              totalLessonsForCourse={totalLessons}
              completedLessonsForCourse={completedLessons}
              courseProgress={progress}
            />
            <div className="overflow-y-auto">
              {chapters.map((chapter: any, index: string) => (
                <ChapterList
                  index={index}
                  chapter={chapter}
                  navigateToLesson={navigateToLesson}
                  key={chapter.id}
                  activeLessonId={lessonIdFromUrl}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
