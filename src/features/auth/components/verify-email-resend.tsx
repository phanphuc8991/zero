"use client";
import { resendVerificationAction } from "@/features/auth/actions";
import { AUTH_MESSAGES, AuthMessageType } from "@/features/auth/constants";
import { CircleX, ChevronLeft, CircleCheck } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function VerifyEmailResult() {
  const [serverError, setServerError] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const refStoredEmail = useRef(
    typeof window !== "undefined"
      ? localStorage.getItem("pending_verify_email") || ""
      : "",
  );
  const { execute, result } = useAction(resendVerificationAction, {
    onSuccess: () => {
      setLoading(false);
    },
    onError: ({ error }) => {
      setLoading(false);
      const errorMessage =
        error?.validationErrors?.email?._errors?.[0] || error?.serverError;
      setServerError(errorMessage as string);
    },
  });

  useEffect(() => {
    setEmail(refStoredEmail.current);
    execute({ email: refStoredEmail.current });
    localStorage.removeItem("pending_verify_email");
  }, []);

  const renderErrorState = () => {
    if (!serverError) return null;

    return (
      <div className="flex flex-col items-center gap-5">
        <CircleX size={40} className="text-red-500" />
        <div className="text-center w-full dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-200 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 max-w-sm">
          <p className="text-sm font-medium">
            {AUTH_MESSAGES[serverError as AuthMessageType] || serverError}
          </p>
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
  };

  const renderSuccessState = () => {
    if (serverError) return null;

    const isGenericMessage =
      result?.data?.message === "VERIFICATION_SENT_GENERIC";

    return (
      <div className="flex flex-col items-center gap-4">
        <CircleCheck size={40} className="text-secondary" />

        {isGenericMessage ? (
          <p className="text-center text-secondary font-medium">
            {result?.data?.message ? AUTH_MESSAGES[result.data.message] : ""}
          </p>
        ) : (
          <div className="text-secondary font-medium text-center flex flex-col gap-1">
            <p>
              A new verification link has been sent to:{" "}
              <span className="text-primary/70 dark:text-creamwhite font-bold underline">
                {email}
              </span>
              .
            </p>
            <p>Please check your inbox and spam folder.</p>
          </div>
        )}

        <Link
          href="/sign-in"
          className="flex items-center gap-1 text-primary dark:text-creamwhite hover:text-secondary transition-colors mt-2"
        >
          <ChevronLeft size={18} />
          <span className="font-medium">Back to Sign In</span>
        </Link>
      </div>
    );
  };
  return (
    <section>
      <div className="container">
        <div className="pt-32 sm:pt-44 pb-16 sm:pb-28 flex justify-center items-center">
          <div className="shadow-2xl rounded-2xl bg-creamwhite dark:bg-primary px-6 py-12 sm:px-12 md:px-16 max-w-lg sm:min-h-162 min-h-178.5 justify-center flex flex-1 items-center">
            {loading ? (
              <div className="animate-pulse text-primary/50 dark:text-creamwhite/50">
                Processing...
              </div>
            ) : (
              <div className="w-full">
                {renderErrorState()}
                {renderSuccessState()}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
