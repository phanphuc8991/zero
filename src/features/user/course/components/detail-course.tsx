"use client";

import React, { useMemo, useState, useTransition } from "react";
import { Check, Lock, Play, ChevronDown, Clock } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { markLessonCompleted } from "@/features/user/course/server-action";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Lesson {
  id: number;
  title: string;
  videoUrl?: string;
  duration: number; // seconds
}

interface Chapter {
  id: number;
  courseId: number;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface DetailCourseDto {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  description: string;
  duration: number; // seconds
  level: string;
  skillsGained: string[];
  targetAudience: string[];
  features: string[];
  chapters: Chapter[];
  completedLessonIds: number[];
}

interface ProcessedLesson extends Lesson {
  isCompleted: boolean;
}

interface ProcessedChapter extends Omit<Chapter, "lessons"> {
  lessons: ProcessedLesson[];
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

function useCourseProgress(course: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>(
    {},
  );
  const [openChapterIds, setOpenChapterIds] = useState<Set<number>>(
    new Set(course?.chapters?.[0]?.id ? [course.chapters[0].id] : []),
  );

  const lessonIdFromUrl = searchParams.get("id");

  const {
    processedChapters,
    currentLesson,
    totalLessons,
    completedCount,
    progressPercent,
  } = useMemo(() => {
    const chapters = course?.chapters ?? [];
    const completedSet = new Set(course?.completedLessonIds ?? []);
    let current: ProcessedLesson | null = null;
    let total = 0;
    let completed = 0;

    const processed: ProcessedChapter[] = chapters.map((ch) => ({
      ...ch,
      lessons: ch.lessons.map((lesson) => {
        const isCompleted =
          completedSet.has(lesson.id) || !!localCompleted[lesson.id];

        if (isCompleted) completed++;
        total++;
        if (String(lesson.id) === String(lessonIdFromUrl)) {
          current = { ...lesson, isCompleted };
        }

        return { ...lesson, isCompleted };
      }),
    }));

    if (!current && chapters.length > 0) {
      const first = chapters[0]?.lessons?.[0];
      if (first)
        current = { ...first, isCompleted: completedSet.has(first.id) };
    }

    return {
      processedChapters: processed,
      currentLesson: current as ProcessedLesson | null,
      totalLessons: total,
      completedCount: completed,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [course, lessonIdFromUrl, localCompleted]);

  const toggleChapter = (id: number) =>
    setOpenChapterIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const navigateToLesson = (lessonId: number) =>
    router.push(`${pathname}?id=${lessonId}`, { scroll: false });

  const handleVideoProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!currentLesson || currentLesson.isCompleted) return;
    if (video.currentTime / video.duration >= 0.9) {
      setLocalCompleted((prev) => ({ ...prev, [currentLesson.id]: true }));
      startTransition(async () => {
        const result = await markLessonCompleted(currentLesson.id);
        if (!result.success) {
          setLocalCompleted((prev) => ({ ...prev, [currentLesson.id]: false }));
        }
      });
    }
  };

  return {
    lessonIdFromUrl,
    openChapterIds,
    processedChapters,
    currentLesson,
    totalLessons,
    completedCount,
    progressPercent,
    isPending,
    toggleChapter,
    navigateToLesson,
    handleVideoProgress,
  };
}

// ─── VideoPlayer ─────────────────────────────────────────────────────────────

function VideoPlayer({
  lesson,
  onTimeUpdate,
}: {
  lesson: ProcessedLesson | null;
  onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 shadow-lg">
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

// ─── CourseAbout ─────────────────────────────────────────────────────────────

function CourseAbout({
  description,
  level,
  duration,
  skillsGained,
  targetAudience,
}: {
  description: string;
  level: string;
  duration: number;
  skillsGained: string[];
  targetAudience: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-6 py-6 space-y-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        About this course
      </p>

      {/* Meta pills */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDuration(duration)}
        </span>
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          {level}
        </span>
      </div>

      {description ? (
        <p className="text-[15px] leading-relaxed text-slate-600">
          {description}
        </p>
      ) : null}

      {skillsGained.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Skills you'll gain
          </p>
          <div className="flex flex-wrap gap-2">
            {skillsGained.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {targetAudience.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Who this is for
          </p>
          <ul className="space-y-1">
            {targetAudience.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-[14px] text-slate-600"
              >
                <Check
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── CourseProgress ───────────────────────────────────────────────────────────

function CourseProgress({
  completedCount,
  totalLessons,
  progressPercent,
}: {
  completedCount: number;
  totalLessons: number;
  progressPercent: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          Your progress
        </span>
        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600">
          {completedCount}/{totalLessons} lessons
        </span>
      </div>
      <div className="mb-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-rose-500 transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-right text-xs text-slate-400">
        {progressPercent}% complete
      </p>
    </div>
  );
}

// ─── LessonItem ───────────────────────────────────────────────────────────────

const LessonItem = React.memo(function LessonItem({
  lesson,
  isActive,
  index,
  onLessonClick,
}: {
  lesson: ProcessedLesson;
  isActive: boolean;
  index: string;
  onLessonClick: (lessonId: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onLessonClick(lesson.id)}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
        isActive ? "bg-rose-50" : "hover:bg-slate-50"
      }`}
    >
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
          lesson.isCompleted
            ? "border-emerald-200 bg-emerald-50"
            : isActive
              ? "border-rose-200 bg-rose-100"
              : "border-slate-200 bg-slate-100"
        }`}
      >
        {lesson.isCompleted ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : isActive ? (
          <svg
            viewBox="0 0 512 512"
            className="h-3.5 w-3.5 animate-spin text-rose-500"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zm-56-16c0-32.4 16.3-66.6 42.8-93.2S207.6 104 240 104c13.3 0 24-10.7 24-24s-10.7-24-24-24c-47.9 0-93.7 23.5-127.1 56.9S56 192.1 56 240c0 13.3 10.7 24 24 24s24-10.7 24-24z" />
          </svg>
        ) : (
          <Lock className="h-3 w-3 text-slate-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[13px] leading-snug ${
            isActive
              ? "font-semibold text-rose-900"
              : "font-medium text-slate-700"
          }`}
        >
          {index}. {lesson.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          {formatDuration(lesson.duration)}
        </p>
      </div>

      {!lesson.isCompleted && (
        <Play
          className={`h-3.5 w-3.5 flex-shrink-0 fill-current transition-opacity ${
            isActive ? "text-rose-400 opacity-100" : "text-slate-300 opacity-0"
          }`}
          aria-hidden="true"
        />
      )}
    </button>
  );
});

// ─── ChapterAccordion ─────────────────────────────────────────────────────────

function ChapterAccordion({
  chapters,
  openChapterIds,
  activeLessonId,
  onToggleChapter,
  onLessonClick,
}: {
  chapters: ProcessedChapter[];
  openChapterIds: Set<number>;
  activeLessonId: string | null;
  onToggleChapter: (id: number) => void;
  onLessonClick: (lessonId: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      {chapters.map((chapter, i) => {
        const isOpen = openChapterIds.has(chapter.id);
        const completedInChapter = chapter.lessons.filter(
          (l) => l.isCompleted,
        ).length;

        return (
          <div
            key={chapter.id}
            className="border-b border-slate-100 last:border-none"
          >
            <button
              type="button"
              onClick={() => onToggleChapter(chapter.id)}
              className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-slate-50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {i + 1}. {chapter.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {completedInChapter}/{chapter.lessons.length} lessons
                  completed
                </p>
              </div>
              <ChevronDown
                className={`ml-3 h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div className="border-t border-slate-100">
                {chapter.lessons.map((lesson, j) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    isActive={String(lesson.id) === String(activeLessonId)}
                    index={`${i + 1}.${j + 1}`}
                    onLessonClick={onLessonClick}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── DetailCourse (main) ──────────────────────────────────────────────────────

export default function DetailCourse({ course }: { course: DetailCourseDto }) {
  const {
    lessonIdFromUrl,
    openChapterIds,
    processedChapters,
    currentLesson,
    totalLessons,
    completedCount,
    progressPercent,
    toggleChapter,
    navigateToLesson,
    handleVideoProgress,
  } = useCourseProgress(course);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 lg:px-8">
      <h1 className="mb-6 text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
        {course?.title}
      </h1>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          <VideoPlayer
            lesson={currentLesson}
            onTimeUpdate={handleVideoProgress}
          />

          {currentLesson && (
            <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Now playing
              </p>
              <h2 className="mt-1 text-base font-bold text-slate-900">
                {currentLesson.title}
              </h2>
            </div>
          )}

          <CourseAbout
            description={course?.description}
            level={course?.level}
            duration={course?.duration}
            skillsGained={course?.skillsGained ?? []}
            targetAudience={course?.targetAudience ?? []}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <CourseProgress
            completedCount={completedCount}
            totalLessons={totalLessons}
            progressPercent={progressPercent}
          />

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">
                Course content
              </h3>
              <span className="text-xs text-slate-400">
                {completedCount}/{totalLessons} lessons
              </span>
            </div>

            <ChapterAccordion
              chapters={processedChapters}
              openChapterIds={openChapterIds}
              activeLessonId={lessonIdFromUrl}
              onToggleChapter={toggleChapter}
              onLessonClick={navigateToLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
