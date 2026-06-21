import { create } from "zustand";
import { Category, Instructor } from "@/features/courses/contants";
import { getCategories } from "@/features/courses/server-action";
import { LessonFormType, LessonType } from "@/features/courses/contants-1";

interface CourseStore {
  // --- State ---
  categories: Category[];
  instructors: Instructor[];
  isCategoriesLoading: boolean;
  isInstructorsLoading: boolean;

  editingChapterId: number | null;
  isAddingChapter: boolean;
  openEditChapter: (chapterId: number) => void;

  lessonDrawerMode: "CREATE" | "EDIT" | null;
  activeChapterId: number | null;
  editingLessonData: LessonType | null;
  activeChapterKey: string | null;

  isSystemLocked: () => boolean;

  openAddLessonDrawer: (chapterId: number, chapterKey: string) => void;
  openEditLessonDrawer: (
    chapterId: number,
    chapterKey: string,
    lesson: LessonType,
  ) => void;
  closeLessonDrawer: () => void;

  openAddChapter: () => void;
  closeAllInputs: () => void;

  fetchCategories: () => Promise<void>;
  fetchInstructors: () => Promise<void>;
  resetCategories: () => void;
  resetInstructors: () => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  // course
  categories: [],
  instructors: [],
  isCategoriesLoading: false,
  isInstructorsLoading: false,

  // lesson
  lessonDrawerMode: null,
  activeChapterId: null,
  editingLessonData: null,
  activeChapterKey: null,

  //chapter
  editingChapterId: null,
  isAddingChapter: false,

  // chapter action
  openEditChapter: (chapterId) => set({ editingChapterId: chapterId }),
  openAddChapter: () => set({ isAddingChapter: true }),

  // lesson action
  openAddLessonDrawer: (chapterId, chapterKey) =>
    set({
      lessonDrawerMode: "CREATE",
      activeChapterId: chapterId,
      activeChapterKey: chapterKey,
    }),

  openEditLessonDrawer: (chapterId, chapterKey, lesson) =>
    set({
      lessonDrawerMode: "EDIT",
      editingLessonData: lesson,
      activeChapterId: chapterId,
      activeChapterKey: chapterKey,
    }),

  closeLessonDrawer: () =>
    set({
      lessonDrawerMode: null,
      activeChapterId: null,
      editingLessonData: null,
    }),

  closeAllInputs: () =>
    set({
      editingChapterId: null,
      isAddingChapter: false,
    }),

  // check disabled when action active
  isSystemLocked: () => {
    const state = get();
    return state.editingChapterId !== null || state.isAddingChapter;
  },

  // course action
  fetchCategories: async () => {
    if (get().categories.length > 0) return;
    set({ isCategoriesLoading: true });
    try {
      const categories = await getCategories();
      if (categories) {
        set({ categories });
      }
    } catch (error) {
      console.error("Failed to fetch categories via Server Action:", error);
    } finally {
      set({ isCategoriesLoading: false });
    }
  },

  fetchInstructors: async () => {
    if (get().instructors.length > 0) return;
    set({ isInstructorsLoading: true });
    try {
      const res = await fetch("/api/instructor/get-instructors", {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data?.instructors) {
        set({ instructors: data.instructors });
      }
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
    } finally {
      set({ isInstructorsLoading: false });
    }
  },

  resetCategories: () => set({ categories: [] }),
  resetInstructors: () => set({ instructors: [] }),
}));
