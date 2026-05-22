import { resendVerificationAction } from "@/features/auth/actions";
import { CircleX, ChevronLeft, CircleCheck } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useEffect } from "react";

const STATUS_MESSAGES: Record<string, string> = {
  missing: "Verification link is missing.",
  invalid: "Verification link is invalid.",
  expired: "Your verification link has expired.",
  server: "Something went wrong. Please try again.",
  verified: "Email verified! Please sign in.",
};

export async function VerifyEmailResult({
  email,
}: {
  email: string | undefined;
}) {
  const {
    execute: executeResend,
    result: resendResult,
    isExecuting: isResendExecuting,
  } = useAction(resendVerificationAction);

  useEffect(() => {
    const email = "";
    executeResend(email);
  }, []);
  return (
    <section>
      <div className="container">
        <div className="pt-32 sm:pt-44 pb-16 sm:pb-28 flex justify-center items-center">
          <div className="shadow-2xl rounded-2xl bg-creamwhite dark:bg-primary px-6 py-12 sm:px-12 md:px-16 max-w-lg sm:min-h-162 min-h-178.5 justify-center flex flex-1 items-center">
            <div className="">
              {status === "verified" ? (
                <div className="flex flex-col items-center gap-4">
                  <CircleCheck size={40} color="#33c375" />
                  <p className="text-secondary">{STATUS_MESSAGES[status]}</p>
                  <Link href="/sign-in" className="flex items-center gap-1">
                    <ChevronLeft size={18} />{" "}
                    <span className="font-medium">Back to Sign In</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 justify-between">
                  <CircleX size={40} color="red" />
                  <p className="text-red-600 text-center">
                    {STATUS_MESSAGES[status ?? "invalid"]}
                  </p>
                  <Link href="/sign-up" className="flex items-center gap-1">
                    <ChevronLeft size={18} />{" "}
                    <span className="font-medium">Back to Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
