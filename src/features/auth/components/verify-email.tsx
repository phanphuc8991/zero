import Link from "next/link";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  missing: "Verification link is missing.",
  invalid: "Verification link is invalid.",
  expired:
    "Your verification link has expired. Please sign up again to receive a new one.",
  server: "Something went wrong. Please try again.",
};

export default async function VerifyEmail({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-warm-ivory dark:bg-primary">
      <div className="flex flex-col items-center text-center max-w-md px-6">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c0392b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <p className="text-sm font-medium text-red-600 uppercase tracking-wide mb-2">
          Verification Failed
        </p>

        <h1 className="text-3xl font-bold text-primary dark:text-creamwhite mb-4 leading-tight">
          Link has expired
        </h1>

        <p className="text-primary/60 dark:text-creamwhite/60 text-base leading-relaxed mb-8">
          {ERROR_MESSAGES[error ?? "invalid"]}
        </p>

        <Link
          href="/signup"
          className="flex items-center justify-center bg-primary dark:bg-creamwhite text-creamwhite dark:text-primary px-8 py-3.5 rounded-full text-sm font-semibold shadow-[0_4px_0_0_rgba(0,0,0,0.8)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.8)] transition-all"
        >
          Back to Sign Up
        </Link>
      </div>
    </div>
  );
}
