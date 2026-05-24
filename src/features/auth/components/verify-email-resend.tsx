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
      const clientErrors = error?.validationErrors?._errors;
      if (clientErrors && clientErrors.length > 0) {
        const firstClientError = clientErrors[0];
        setServerError(firstClientError);
      } else {
        setServerError(error?.serverError as string);
      }
    },
  });

  useEffect(() => {
    setEmail(refStoredEmail.current);
    execute({ email: refStoredEmail.current });
    localStorage.removeItem("pending_verify_email");
  }, []);
  return (
    <section>
      <div className="container">
        <div className="pt-32 sm:pt-44 pb-16 sm:pb-28 flex justify-center items-center">
          <div className="shadow-2xl rounded-2xl bg-creamwhite dark:bg-primary px-6 py-12 sm:px-12 md:px-16 max-w-lg sm:min-h-162 min-h-178.5 justify-center flex flex-1 items-center">
            {loading ? (
              <div></div>
            ) : (
              <div className="">
                {serverError ? (
                  <div className="flex flex-col items-center gap-4 justify-between">
                    <CircleX size={40} color="red" />
                    <p className="text-red-600 text-center">
                      {AUTH_MESSAGES[serverError as AuthMessageType]}
                    </p>
                    <Link href="/sign-up" className="flex items-center gap-1">
                      <ChevronLeft size={18} />{" "}
                      <span className="font-medium">Back to Sign Up</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <CircleCheck size={40} color="#33c375" />
                    {result?.data?.message === "VERIFICATION_SENT_GENERIC" ? (
                      <p className="text-center text-secondary">
                        {
                          AUTH_MESSAGES[
                            result?.data?.message as AuthMessageType
                          ]
                        }
                      </p>
                    ) : (
                      <div>
                        <p className="text-center">
                          A new verification link has been sent to{" "}
                          <span className="text-gray-900 font-bold">
                            {email}
                          </span>
                          .
                        </p>
                        <p className="text-center">
                          Please check your inbox and spam folder.
                        </p>
                      </div>
                    )}

                    <Link href="/sign-in" className="flex items-center gap-1">
                      <ChevronLeft size={18} />{" "}
                      <span className="font-medium">Back to Sign In</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
