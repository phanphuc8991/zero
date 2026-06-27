"use client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Play,
  Lock,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
const points = [
  "Interpret porosity, permeability & saturation data",
  "Perform PVT analysis on reservoir fluids",
  "Analyze pressure transient test results",
  "Build and calibrate reservoir simulation models",
  "Design artificial lift systems for production enhancement",
  "Apply IPR & VLP curves for well performance analysis",
  "Understand EOR methods and screening criteria",
  "Evaluate field development scenarios economically",
];

const AccordionItem = ({
  lesson,
  navigateToLesson,
}: {
  lesson: any;
  navigateToLesson: any;
}) => {
  const { status, title, id } = lesson;
  const renderLessonStatus = (status: string) => {
    switch (status) {
      case "done":
        return (
          <CircleCheck className="w-3.75 h-3.75 text-emerald-500 fill-emerald-50" />
        );

      case "isCurrent":
        return (
          <div className="w-3.5 h-3.5 rounded-full bg-orange-500 flex items-center justify-center">
            <Play className="w-1.75 h-1.75 text-white" />
          </div>
        );

      case "isLocked":
        return <Lock className="w-3.25 h-3.25 text-slate-300" />;

      default:
        return (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
        );
    }
  };
  return (
    <button
      onClick={() => {
        navigateToLesson(id);
      }}
      className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors border-l-2 ${status === "isCurrent" ? "bg-orange-50 border-orange-500" : "border-transparent hover:bg-slate-50"}`}
    >
      <div className="shrink-0 mt-0.5">{renderLessonStatus(status)}</div>

      <div className="flex-1 min-w-0">
        <p
          className={`font-normal text-[0.78rem] leading-snug truncate ${
            status === "isCurrent"
              ? "text-orange-600"
              : status === "isLocked"
                ? "text-slate-300"
                : "text-slate-700"
          }`}
        >
          {title}
        </p>
      </div>
    </button>
  );
};

function ChapterAccordion({
  chapter,
  navigateToLesson,
}: {
  chapter: any;
  navigateToLesson: any;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-2 px-4 py-3 bg-slate-50/60 hover:bg-slate-100/80 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-slate-700 pr-2 leading-snug text-[0.78rem] font-bold">
            {chapter.title}
          </p>
          <p className="text-slate-400 mt-0.5 text-[0.7rem]">
            {chapter.completedLessonsForChapter}/
            {chapter.totalLessonsForChapter} lessons
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
          {chapter.lessons.map((lesson: any) => (
            <AccordionItem
              key={lesson.id}
              lesson={lesson}
              navigateToLesson={navigateToLesson}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const LearningPoint = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2">
    <CircleCheck className="text-emerald-500 shrink-0 mt-0.5 w-3.5 h-3.5" />
    <span className="text-slate-600 text-[0.82rem]">{text}</span>
  </div>
);

function CourseContent({
  totalLessonsForCourse,
  completedLessonsForCourse,
  courseProgress,
}: {
  totalLessonsForCourse: number;
  completedLessonsForCourse: number;
  courseProgress: number;
}) {
  console.log("courseProgress", courseProgress);
  return (
    <div className="px-4 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
      <h3 className="text-slate-800 mb-1 text-[0.95rem] font-bold ">
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
        className="bg-slate-200 [&>div]:bg-orange-500 w-full h-1.5"
      />
    </div>
  );
}

const useCourseProgress = (course: any) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lessonIdFromUrl = parseInt(searchParams.get("id") || "");

  const {
    chapterStats,
    totalLessonsForCourse,
    completedLessonsForCourse,
    courseProgress,
    currentLesson,
  } = useMemo(() => {
    const completedSet = new Set(course.completedLessonIds);
    let totalLessonsCount = 0;
    let canUnlockNext = true;
    let currentLesson: any = null;
    const chapterStats = course.chapters.map((chapter: any) => {
      const lessonsWithStatus = chapter.lessons.map((lesson: any) => {
        const isDone = completedSet.has(lesson.id);
        const isCurrent = lesson.id === Number(lessonIdFromUrl);
        let status;
        if (isDone) {
          status = "done";
        } else if (canUnlockNext) {
          status = isCurrent ? "isCurrent" : "isNext";
          if (status === "isCurrent") {
            currentLesson = lesson;
          }
          canUnlockNext = false;
        } else {
          status = "isLocked";
        }
        return { ...lesson, status };
      });
      const totalLessonsForChapter = lessonsWithStatus.length;
      const completedLessonsForChapter = lessonsWithStatus.filter(
        (l: any) => l.status === "done",
      ).length;
      totalLessonsCount += totalLessonsForChapter;
      return {
        ...chapter,
        lessons: lessonsWithStatus,
        completedLessonsForChapter,
        totalLessonsForChapter,
      };
    });
    return {
      chapterStats,
      totalLessonsForCourse: totalLessonsCount,
      completedLessonsForCourse: course.completedLessonIds.length,
      courseProgress:
        totalLessonsCount > 0
          ? Math.round(
              (course.completedLessonIds.length / totalLessonsCount) * 100,
            )
          : 0,
      currentLesson,
    };
  }, [course, lessonIdFromUrl]);

  const navigateToLesson = (lessonId: number) =>
    router.push(`${pathname}?id=${lessonId}`, { scroll: false });

  return {
    chapterStats,
    totalLessonsForCourse,
    completedLessonsForCourse,
    courseProgress,
    currentLesson,
    navigateToLesson,
  };
};

function VideoPlayer({
  lesson,
  onTimeUpdate,
}: {
  lesson: any;
  onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}) {
  return (
    <div className="relative aspect-video h-full w-full overflow-hidden">
      {lesson?.videoUrl ? (
        <video
          key={lesson.id}
          src={lesson.videoUrl}
          onTimeUpdate={onTimeUpdate}
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

export function DetailCourse({ course }: { course: any }) {
  const {
    chapterStats,
    totalLessonsForCourse,
    completedLessonsForCourse,
    courseProgress,
    currentLesson,
    navigateToLesson,
  } = useCourseProgress(course);
  return (
    <div>
      <h1 className="text-black mb-10 text-[1.65rem] font-bold leading-tight">
        Advanced Petroleum Engineering
      </h1>
      <div className="grid grid-cols-3 gap-5">
        <div className="grid col-span-2 gap-5">
          <Card className="p-0 overflow-hidden">
            <VideoPlayer lesson={currentLesson} onTimeUpdate={() => {}} />
          </Card>
          <Card className="p-6">
            <h2 className="text-slate-800 mb-4 font-bold text-[1.1rem]">
              Course Description
            </h2>

            <div className="text-slate-600 space-y-3 text-[0.9rem] leading-snug">
              <p>
                This comprehensive course provides oil and gas professionals
                with a deep understanding of petroleum reservoir engineering
                principles and production optimization strategies. Whether
                you're new to the discipline or looking to sharpen advanced
                skills, this course bridges theoretical foundations with
                real-world field applications.
              </p>
              <p>
                You'll start by exploring reservoir rock and fluid properties,
                then progressively advance through well logging interpretation,
                pressure transient analysis, and numerical simulation
                fundamentals. By the end of the course, you'll be equipped to
                analyze production data, design optimal completion strategies,
                and implement data-driven optimization workflows using
                industry-standard tools.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-slate-700 mb-3 font-semibold text-[0.88rem]">
                What you'll learn:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {points.map((point, index) => (
                  <LearningPoint key={index} text={point} />
                ))}
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-1">
          <Card className="p-0 overflow-hidden gap-0">
            <CourseContent
              totalLessonsForCourse={totalLessonsForCourse}
              completedLessonsForCourse={completedLessonsForCourse}
              courseProgress={courseProgress}
            />
            <div className="overflow-y-auto">
              {chapterStats.map((chapter: any) => (
                <ChapterAccordion
                  chapter={chapter}
                  navigateToLesson={navigateToLesson}
                  key={chapter.id}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
