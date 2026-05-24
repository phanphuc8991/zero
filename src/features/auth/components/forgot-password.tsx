"use client";

import { forgotPasswordAction } from "@/features/auth/actions";
import {
  AUTH_MESSAGES,
  AuthMessageType,
  emailSchema,
  ForgotPasswordForm,
} from "@/features/auth/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { ChevronLeft, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
export function ForgotPassword() {
  const [serverError, setServerError] = useState("");
  const { execute, result, isExecuting } = useAction(forgotPasswordAction, {
    onSuccess: () => {},
    onError: ({ error }) => {
      setServerError(error?.serverError as string);
      console.log("error", error);
    },
  });

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    mode: "onBlur",
    resolver: zodResolver(emailSchema),
  });

  useEffect(() => {
    if (serverError) {
      setServerError("");
    }
  }, [watch("email"), result?.data?.message]);

  return (
    <section>
      <div className="container">
        <div className="pt-32 sm:pt-44 pb-16 sm:pb-28 flex justify-center items-center">
          <div className="shadow-2xl rounded-2xl bg-creamwhite dark:bg-primary  max-w-lg sm:min-h-162 min-h-178.5 justify-center flex flex-col flex-1 items-center">
            <div className="w-full px-6 py-12 sm:px-12 md:px-16 flex flex-col items-center">
              <div className="flex flex-col gap-2 items-center mb-10">
                <div className="mb-2 flex justify-center items-center">
                  <span className="bg-middlegreen rounded-full p-3">
                    {" "}
                    <ArrowUp size={18} color="#33c375" />
                  </span>
                </div>
                <h4>Forgot password?</h4>
                <p className="text-center text-sm">
                  Enter your email address below and we'll send you a link to
                  reset your password.
                </p>
              </div>

              <form
                className="w-full flex flex-col gap-5"
                onSubmit={handleSubmit((data) => execute(data))}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between">
                    <label
                      htmlFor="email"
                      className="text-[15px] font-medium leading-8.75 text-primary"
                    >
                      Email
                    </label>
                    {errors.email && (
                      <p className="text-[13px] text-red-500 opacity-80">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <input
                    {...register("email")}
                    className={`w-full rounded-full border border-primary/20 outline-none px-5 py-3 text-primary dark:text-creamwhite dark:border-stroke focus:border-primary/60 dark:focus:border-creamwhite/60 ${errors.email && "border-red-500 focus:border-red-500"}`}
                    type="text"
                    name="email"
                    id="email"
                    placeholder="you@example.com"
                    autoComplete="off"
                  />
                </div>
                {result?.data?.message && (
                  <p className="text-center text-secondary">
                    {AUTH_MESSAGES[result?.data?.message as AuthMessageType]}
                  </p>
                )}

                {serverError && (
                  <div className="text-center w-full dark:bg-red-900/30 dark:border-red-900 dark:text-red-200 bg-red-100 border border-red-300 text-red-800 rounded-xl p-2">
                    <span>
                      {AUTH_MESSAGES[serverError as AuthMessageType] ||
                        serverError}
                    </span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isExecuting}
                  className="hover:cursor-pointer h-auto shadow-[0_6px_0_0_rgba(0,0,0,1)] hover:hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] group flex items-center justify-center gap-2 bg-secondary hover:bg-transparent dark:hover:bg-creamwhite py-3 px-5 rounded-full border border-black w-full transition-all duration-300 ease-in-out"
                >
                  {isExecuting ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <Link href="/sign-in" className="flex items-center gap-1 mt-6">
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
