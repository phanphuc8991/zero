import Link from "next/link";
export function BackToTop() {
  return (
    <div className="fixed bottom-8 right-8 z-999">
      <Link
        id="back-to-top"
        href="#top"
        className="flex justify-center opacity-0 items-center h-10 w-10 cursor-pointer rounded-md bg-primary text-secondary shadow-md"
      >
        <span className="mt-1.5 h-3 w-3 rotate-45 border-l border-t border-secondary"></span>
      </Link>
    </div>
  );
}
