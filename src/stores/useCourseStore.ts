import { create } from "zustand";
import { Category, Instructor } from "@/features/courses/contants";

interface CourseStore {
  // --- State ---
  categories: Category[];
  instructors: Instructor[];
  isCategoriesLoading: boolean;
  isInstructorsLoading: boolean;

  // --- Actions ---
  fetchCategories: () => Promise<void>;
  fetchInstructors: () => Promise<void>;

  resetCategories: () => void;
  resetInstructors: () => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  // --- Initial State ---
  categories: [],
  instructors: [],
  isCategoriesLoading: false,
  isInstructorsLoading: false,

  // --- Fetch Categories ---
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

  // --- Fetch Instructors ---
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
