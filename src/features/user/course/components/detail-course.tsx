"use client";

import React, { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Play, Lock } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { markLessonCompleted } from "@/features/user/course/server-action";

// 1. Component con: Tối ưu với React.memo
const LessonItem = React.memo(
  ({ lesson, isActive, isCompleted, onLessonClick, index }: any) => {
    return (
      <div
        onClick={() => onLessonClick(lesson)}
        className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-colors ${
          isActive ? "bg-rose-50" : "hover:bg-slate-50"
        }`}
      >
        <div className="flex flex-col items-start gap-1">
          <span
            className={`text-[15px] ${isActive ? "font-semibold text-rose-900" : "text-slate-700"}`}
          >
            {index} {lesson.title}
          </span>
          <div className="text-slate-400 flex items-center text-sm">
            <div className="mr-2">
              {isActive ? (
                <svg
                  viewBox="0 0 512 512"
                  className="w-4 h-4 text-rose-600 animate-spin-slow"
                  fill="currentColor"
                >
                  <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zm-56-16c0-32.4 16.3-66.6 42.8-93.2S207.6 104 240 104c13.3 0 24-10.7 24-24s-10.7-24-24-24c-47.9 0-93.7 23.5-127.1 56.9S56 192.1 56 240c0 13.3 10.7 24 24 24s24-10.7 24-24z"></path>
                </svg>
              ) : (
                <div className="w-4 h-4 rounded-full bg-neutral-500 flex items-center justify-center">
                  <Play className="w-2 h-2 text-slate-100 fill-slate-100" />
                </div>
              )}
            </div>
            <div>13:00</div>
          </div>
        </div>
        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
          {isCompleted ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Lock className="w-3 h-3 text-slate-400" />
          )}
        </div>
      </div>
    );
  },
);

LessonItem.displayName = "LessonItem";

export default function DetailCourse({ course }: { course: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [completedLessons, setCompletedLessons] = useState<
    Record<string, boolean>
  >({});

  const lessonIdFromUrl = searchParams.get("id");
  const [activeId, setActiveId] = useState<number | null>(
    course?.chapters?.[0]?.id || null,
  );

  const {
    processedChapters,
    currentLesson,
    totalLessons,
    completedCount,
    progressPercent,
  } = useMemo(() => {
    const chapters = course?.chapters || [];
    let current = null;
    let total = 0;
    let completed = 0;

    const processed = chapters.map((ch: any) => ({
      ...ch,
      lessons: ch.lessons?.map((l: any) => {
        const isDbCompleted = course?.userProgress?.some(
          (p: any) => p.lessonId === l.id && p.isCompleted,
        );
        const isLocallyCompleted = !!completedLessons[l.id];
        const isCompleted = isDbCompleted || isLocallyCompleted;

        if (isCompleted) completed++;
        total++;
        if (String(l.id) === String(lessonIdFromUrl)) current = l;
        return { ...l, isCompleted };
      }),
    }));

    if (!current && chapters.length > 0) current = chapters[0].lessons[0];

    return {
      processedChapters: processed,
      currentLesson: current,
      totalLessons: total,
      completedCount: completed,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [course, lessonIdFromUrl, completedLessons]);

  const toggleAccordion = (id: number) =>
    setActiveId(activeId === id ? null : id);
  const handleLessonClick = (lesson: any) =>
    router.push(`${pathname}?id=${lesson.id}`, { scroll: false });

  const handleVideoProgress = (e: any) => {
    const video = e.target;
    if (
      video.currentTime / video.duration >= 0.9 &&
      !currentLesson?.isCompleted
    ) {
      setCompletedLessons((prev) => ({ ...prev, [currentLesson.id]: true }));
      startTransition(async () => {
        const result = await markLessonCompleted(currentLesson.id);
        if (!result.success) {
          setCompletedLessons((prev) => ({
            ...prev,
            [currentLesson.id]: false,
          }));
        }
      });
    }
  };

  return (
    <div className="">
      <h1 className="mb-5 text-xl font-bold tracking-tight lg:text-2xl">
        {course?.title}
      </h1>
      <div className="grid gap-4 grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <video
              key={currentLesson?.id}
              src={currentLesson?.videoUrl || ""}
              onTimeUpdate={handleVideoProgress}
              className="h-full w-full object-cover"
              controls
              preload="metadata"
            />
          </div>
          <Card className="shadow-none px-6 py-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              About Course
            </h2>
            <p className="text-[15px] text-slate-600 leading-relaxed">
              {course?.description}
            </p>
          </Card>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Progress</span>
                <Badge variant="outline">{progressPercent}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/20 h-2 w-full rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none overflow-hidden py-0">
            <div className="p-5 border-b border-slate-200 flex justify-between font-bold text-xl">
              Course content{" "}
              <span>
                {completedCount}/{totalLessons}
              </span>
            </div>
            {processedChapters.map((chapter: any, i: number) => (
              <div key={chapter.id} className="border-b border-slate-100">
                <div
                  onClick={() => toggleAccordion(chapter.id)}
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50"
                >
                  <h3 className="font-bold text-base">
                    {i + 1}. {chapter.title}
                  </h3>
                </div>
                {activeId === chapter.id && (
                  <div className="pb-2">
                    {chapter.lessons.map((lesson: any, j: number) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        isActive={String(lesson.id) === String(lessonIdFromUrl)}
                        isCompleted={lesson.isCompleted}
                        onLessonClick={handleLessonClick}
                        index={`${i + 1}.${j + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
