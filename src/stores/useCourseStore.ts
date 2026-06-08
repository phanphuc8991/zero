import { create } from "zustand";
import { Category, Instructor } from "@/features/courses/contants";

interface CourseStore {
  // --- State ---
  categories: Category[];
  instructors: Instructor[];
  isCategoriesLoading: boolean;
  isInstructorsLoading: boolean;

  editingChapterId: number | null;
  isAddingChapter: boolean;
  openEditChapter: (chapterId: number) => void;

  isLessonDrawerOpen: boolean;
  lessonDrawerMode: "CREATE" | "EDIT" | null;
  activeChapterId: number | null;
  activeChapterIndex: number | null;
  editingLessonData: any | null;
  isSystemLocked: () => boolean;

  openAddLessonDrawer: (chapterId: number, chapterIndex: number) => void;
  openEditLessonDrawer: (lesson: any) => void;
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
  isLessonDrawerOpen: false,
  lessonDrawerMode: null,
  activeChapterId: null,
  activeChapterIndex: null,
  editingLessonData: null,

  //chapter
  editingChapterId: null,
  isAddingChapter: false,

  // chapter action
  openEditChapter: (chapterId) => set({ editingChapterId: chapterId }),
  openAddChapter: () => set({ isAddingChapter: true }),

  // lesson action
  openAddLessonDrawer: (chapterId, chapterIndex) =>
    set({
      isLessonDrawerOpen: true,
      lessonDrawerMode: "CREATE",
      activeChapterId: chapterId,
      activeChapterIndex: chapterIndex,
      editingLessonData: null,
    }),

  openEditLessonDrawer: (lesson) =>
    set({
      isLessonDrawerOpen: true,
      lessonDrawerMode: "EDIT",
      editingLessonData: lesson,
      activeChapterId: null,
      activeChapterIndex: null,
    }),

  closeLessonDrawer: () =>
    set({
      isLessonDrawerOpen: false,
      lessonDrawerMode: null,
      activeChapterId: null,
      activeChapterIndex: null,
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
