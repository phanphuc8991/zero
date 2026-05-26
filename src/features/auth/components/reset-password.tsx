"use client";
import { resetPasswordAction } from "@/features/auth/actions";
import {
  AUTH_MESSAGES,
  AuthMessageType,
  ResetPasswordForm,
  resetPasswordSchema,
} from "@/features/auth/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ChevronLeft, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { PasswordField } from "@/app/components/ui/PasswordField";
import { SubmitButton } from "@/app/components/ui/SubmitButton";

export function ResetPassword({ token }: { token: string | undefined }) {
  const [serverError, setServerError] = useState("");
  const { execute, result, isExecuting } = useAction(resetPasswordAction, {
    onError: ({ error }) => {
      const errorMessage =
        error?.validationErrors?.token?._errors?.[0] || error?.serverError;
      setServerError(errorMessage as string);
    },
  });

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    mode: "onBlur",
    resolver: zodResolver(resetPasswordSchema),
  });

  const renderResultMessage = () => {
    if (!result?.data?.message) return null;

    return (
      <p className="text-center text-secondary">
        {AUTH_MESSAGES[result.data.message]}
      </p>
    );
  };

  const renderServerError = () => {
    if (!serverError) return null;

    return (
      <div className="text-center w-full dark:bg-red-900/30 dark:border-red-900 dark:text-red-200 bg-red-100 border border-red-300 text-red-800 rounded-xl p-2">
        <span>
          {AUTH_MESSAGES[serverError as AuthMessageType] || serverError}
        </span>
      </div>
    );
  };

  return (
    <section>
      <div className="container">
        <div className="pt-32 sm:pt-44 pb-16 sm:pb-28 flex justify-center items-center">
          <div className="shadow-2xl rounded-2xl bg-creamwhite dark:bg-primary  max-w-lg sm:min-h-162 min-h-178.5 justify-center flex flex-col flex-1 items-center">
            <div className="w-full px-6 py-12 sm:px-12 md:px-16 flex flex-col items-center">
              <div className="flex flex-col gap-2 items-center mb-8">
                <div className="mb-2 flex justify-center items-center">
                  <span className="bg-middlegreen rounded-full p-3">
                    {" "}
                    <LockKeyhole size={18} color="#33c375" />
                  </span>
                </div>
                <h4>Reset password</h4>
                <p className="text-center text-sm">
                  Enter your new password below.
                </p>
              </div>

              <form
                className="w-full flex flex-col gap-3"
                onSubmit={handleSubmit((data) =>
                  execute({ ...data, token: token as string }),
                )}
              >
                <div>
                  {" "}
                  <PasswordField
                    register={register}
                    label="New Password"
                    name="newPassword"
                    error={errors.newPassword}
                    onChange={() => {
                      if (errors.newPassword) clearErrors("newPassword");
                      if (serverError) setServerError("");
                    }}
                  />
                </div>

                <div>
                  <PasswordField
                    register={register}
                    label="Confirm Password"
                    name="confirmPassword"
                    error={errors.confirmPassword}
                    onChange={() => {
                      if (errors.confirmPassword)
                        clearErrors("confirmPassword");
                      if (serverError) setServerError("");
                    }}
                  />
                </div>

                {renderResultMessage()}
                {renderServerError()}

                <div className="mb-9 mt-5">
                  <SubmitButton
                    disabled={isExecuting || !!result?.data?.message}
                    isLoading={isExecuting}
                    label="Reset password"
                  />
                </div>
              </form>

              <Link href="/sign-in" className="flex items-center gap-1">
                <ChevronLeft size={18} />{" "}
                <span className="font-medium">Back to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
