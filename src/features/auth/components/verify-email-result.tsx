import { CircleX, ChevronLeft, CircleCheck } from "lucide-react";
import Link from "next/link";

const STATUS_MESSAGES: Record<string, string> = {
  missing: "Verification link is missing.",
  invalid: "Verification link is invalid.",
  expired: "Your verification link has expired.",
  server: "Something went wrong. Please try again.",
  verified: "Email verified! Please sign in.",
};

export async function VerifyEmailResult({
  status,
}: {
  status: string | undefined;
}) {
  const isVerified = status === "verified";
  const messageKey = status ?? "invalid";

  const renderSuccessState = () => (
    <div className="flex flex-col items-center gap-4">
      <CircleCheck size={40} className="text-secondary" />

      <p className="text-secondary font-medium text-center">
        {STATUS_MESSAGES[messageKey]}
      </p>

      <Link
        href="/sign-in"
        className="flex items-center gap-1 text-primary dark:text-creamwhite hover:text-secondary transition-colors"
      >
        <ChevronLeft size={18} />
        <span className="font-medium">Back to Sign In</span>
      </Link>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center gap-5">
      <CircleX size={40} className="text-red-500" />

      <div className="text-center w-full dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-200 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 max-w-sm">
        <p className="text-sm font-medium">{STATUS_MESSAGES[messageKey]}</p>
      </div>

      <Link
        href="/sign-up"
        className="flex items-center gap-1 text-primary dark:text-creamwhite hover:text-red-500 transition-colors"
      >
        <ChevronLeft size={18} />
        <span className="font-medium">Back to Sign Up</span>
      </Link>
    </div>
  );

  return (
    <section>
      <div className="container">
        <div className="pt-32 sm:pt-44 pb-16 sm:pb-28 flex justify-center items-center">
          <div className="shadow-2xl rounded-2xl bg-creamwhite dark:bg-primary px-6 py-12 sm:px-12 md:px-16 max-w-lg sm:min-h-162 min-h-178.5 justify-center flex flex-1 items-center">
            <div className="">
              {isVerified ? renderSuccessState() : renderErrorState()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
