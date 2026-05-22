"use client";
import Link from "next/link";
import Image from "next/image";
import DarkLogo from "@/assets/images/logo/dark-logo.svg";
import LightLogo from "@/assets/images/logo/light-logo.svg";
import GoogleIcon from "@/assets/images/icon/google-icon.svg";
import GitHubIcon from "@/assets/images/icon/github-icon.svg";
import {
  signInAction,
  resendVerificationAction,
} from "@/features/auth/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  AUTH_ERRORS,
  AuthErrorType,
  type SignInForm,
  signInSchema,
} from "@/features/auth/constants";
import { useAction } from "next-safe-action/hooks";
import { SuccessMessage } from "@/app/components/ui/SigninSuccessMessage";

export function SignIn() {
  const router = useRouter();
  const { update } = useSession();
  const { execute, result, isExecuting } = useAction(signInAction, {
    onSuccess: () => {
      router.push("/");
      setTimeout(async () => {
        await update();
      }, 200);
    },
  });

  const {
    execute: executeResend,
    result: resendResult,
    isExecuting: isResendExecuting,
  } = useAction(resendVerificationAction);
  console.log("resendResult", resendResult);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignInForm>({
    mode: "onBlur",
    resolver: zodResolver(signInSchema),
  });
  const handleResend = () => {
    const email = getValues("email");
    if (!email) return;
    executeResend(email);
  };
  return (
    <section>
      <div className="container">
        <div className="pt-32 sm:pt-44 pb-16 sm:pb-28 flex justify-center items-center">
          <div className="max-w-lg shadow-2xl rounded-2xl bg-creamwhite dark:bg-primary px-6 py-12 sm:px-12 md:px-16 flex-1">
            <div className="mb-10 flex justify-center">
              <Link href="/">
                <Image
                  alt="logo"
                  src={LightLogo}
                  width={190}
                  height={34}
                  className="dark:hidden h-auto w-auto"
                  loading="eager"
                />
                <Image
                  alt="logo"
                  src={DarkLogo}
                  width={190}
                  height={34}
                  className="hidden dark:block h-auto w-auto"
                  loading="eager"
                />
              </Link>
            </div>
            <div className="flex flex-col gap-4 md:flex-row items-center">
              <button className="flex w-full items-center justify-center gap-2.5 p-3 border border-primary/20 dark:border-creamwhite/20 text-primary dark:text-creamwhite cursor-pointer duration-250 ease-in hover:bg-secondary/20 rounded-full">
                <span>Sign In</span>
                <Image
                  alt="google-icon"
                  src={GoogleIcon}
                  width={22}
                  height={22}
                  className="w-5.5 h-5.5"
                />
              </button>
              <button className="flex w-full items-center justify-center gap-2.5 p-3 border border-primary/20 dark:border-creamwhite/20 text-primary dark:text-creamwhite cursor-pointer duration-250 ease-in hover:bg-secondary/20 rounded-full">
                <span>Sign In</span>
                <Image
                  alt="google-icon"
                  src={GitHubIcon}
                  width={22}
                  height={22}
                  className="w-5.5 h-5.5"
                />
              </button>
            </div>
            <div className="relative my-8 text-center">
              <span className="z-1 absolute left-0 top-1/2 w-full block h-px bg-primary/20 dark:bg-creamwhite/20"></span>
              <span className="relative text-sm text-primary/40 dark:text-creamwhite/40 inline-block px-3 bg-creamwhite dark:bg-primary z-10">
                OR
              </span>
            </div>
            <SuccessMessage />
            <form className="" onSubmit={handleSubmit((data) => execute(data))}>
              <div className="mb-5">
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
                <div>
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
              </div>

              <div className="mb-4">
                <div className="flex items-baseline justify-between">
                  <label
                    htmlFor="password"
                    className="text-[15px] font-medium leading-8.75 text-primary"
                  >
                    Password
                  </label>
                  {errors.password && (
                    <p className="text-[13px] text-red-500 opacity-80">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    {...register("password")}
                    className={`w-full rounded-full border border-primary/20 outline-none px-5 py-3 text-primary dark:text-creamwhite dark:border-stroke focus:border-primary/60 dark:focus:border-creamwhite/60 ${errors.password && "border-red-500 focus:border-red-500"}`}
                    type="text"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                </div>
              </div>

              {!isResendExecuting && result?.serverError && (
                <div className="text-center w-full dark:bg-red-900/30 dark:border-red-900 dark:text-red-200 bg-red-100 border border-red-300 text-red-800 rounded-xl p-2 mb-4">
                  <span>
                    {AUTH_ERRORS[result.serverError as AuthErrorType] ||
                      result.serverError}
                  </span>
                  <span
                    className="pl-2 cursor-pointer underline"
                    onClick={handleResend}
                  >
                    Resend link.
                  </span>
                </div>
              )}

              {isResendExecuting && (
                <span className="animate-pulse">
                  Sending verification link...
                </span>
              )}

              {!isResendExecuting && resendResult?.serverError ? (
                <div className="text-center w-full dark:bg-red-900/30 dark:border-red-900 dark:text-red-200 bg-red-100 border border-red-300 text-red-800 rounded-xl p-2 mb-4">
                  <span>
                    {AUTH_ERRORS[resendResult.serverError as AuthErrorType]}
                  </span>
                </div>
              ) : (
                <></>
              )}

              <div className="mb-9">
                <button
                  type="submit"
                  disabled={isExecuting}
                  className="h-auto shadow-[0_6px_0_0_rgba(0,0,0,1)] hover:hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] group flex items-center justify-center gap-2 bg-secondary hover:bg-transparent dark:hover:bg-creamwhite py-3 px-5 rounded-full border border-black w-full transition-all duration-300 ease-in-out"
                >
                  {isExecuting ? "Processing..." : "Sign in"}
                </button>
              </div>
            </form>

            <div className="flex flex-col justify-center items-center gap-0.5">
              <Link
                href="/forgot-password"
                className="block text-primary dark:text-creamwhite hover:text-secondary"
              >
                Forget Password?
              </Link>
              <p className="text-primary dark:text-creamwhite">
                <span className="pr-1">Not a member yet?</span>
                <Link
                  className="text-primary dark:text-creamwhite hover:text-secondary"
                  href="sign-up"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
