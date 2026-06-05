import { create } from "zustand";
import { Category, Instructor } from "@/features/courses/contants";

interface CourseStore {
  // --- State ---
  categories: Category[];
  instructors: Instructor[];
  isCategoriesLoading: boolean;
  isInstructorsLoading: boolean;
  editingLessonId: number | null;
  editingChapterId: number | null;
  isAddingLessonChapterId: number | null;
  isAddingChapter: boolean;

  isSystemLocked: () => boolean;

  openEditLesson: (lessonId: number) => void;
  openEditChapter: (chapterId: number) => void;
  openAddLesson: (chapterId: number) => void;
  openAddChapter: () => void;
  closeAllInputs: () => void;

  fetchCategories: () => Promise<void>;
  fetchInstructors: () => Promise<void>;
  resetCategories: () => void;
  resetInstructors: () => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  categories: [],
  instructors: [],
  isCategoriesLoading: false,
  isInstructorsLoading: false,

  editingLessonId: null,
  editingChapterId: null,
  isAddingLessonChapterId: null,
  isAddingChapter: false,

  openEditLesson: (lessonId) => set({ editingLessonId: lessonId }),
  openEditChapter: (chapterId) => set({ editingChapterId: chapterId }),
  openAddLesson: (chapterId) => set({ isAddingLessonChapterId: chapterId }),
  openAddChapter: () => set({ isAddingChapter: true }),

  closeAllInputs: () =>
    set({
      editingLessonId: null,
      editingChapterId: null,
      isAddingLessonChapterId: null,
      isAddingChapter: false,
    }),

  isSystemLocked: () => {
    const state = get();
    return (
      state.editingLessonId !== null ||
      state.editingChapterId !== null ||
      state.isAddingLessonChapterId !== null ||
      state.isAddingChapter
    );
  },

  fetchCategories: async () => {
    if (get().categories.length > 0) return;
    set({ isCategoriesLoading: true });
    try {
      const res = await fetch("/api/category/get-categories", {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data?.categories) {
        set({ categories: data.categories });
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
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
