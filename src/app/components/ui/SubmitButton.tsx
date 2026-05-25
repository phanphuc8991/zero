"use client";

interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
  loadingLabel?: string;
}

export function SubmitButton({
  isLoading,
  label,
  loadingLabel = "Processing...",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="cursor-pointer h-auto shadow-[0_6px_0_0_rgba(0,0,0,1)] hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] group flex items-center justify-center gap-2 bg-secondary hover:bg-transparent dark:hover:bg-creamwhite py-3 px-5 rounded-full border border-black w-full transition-all duration-300 ease-in-out"
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
