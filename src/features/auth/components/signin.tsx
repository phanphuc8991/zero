"use client";
import Link from "next/link";
import Image from "next/image";
import DarkLogo from "@/assets/images/logo/dark-logo.svg";
import LightLogo from "@/assets/images/logo/light-logo.svg";
import GoogleIcon from "@/assets/images/icon/google-icon.svg";
import { signInAction } from "@/features/auth/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {
  AUTH_MESSAGES,
  AuthMessageType,
  type SignInForm,
  signInSchema,
} from "@/features/auth/constants";
import { useAction } from "next-safe-action/hooks";
import { useState, Suspense } from "react";
import { GoogleAuthError } from "@/app/components/ui/GoogleAuthError";
import { InputField } from "@/app/components/ui/InputField";
import { PasswordField } from "@/app/components/ui/PasswordField";
import { SubmitButton } from "@/app/components/ui/SubmitButton";

export function SignIn() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const { update } = useSession();
  const { execute, isExecuting } = useAction(signInAction, {
    onSuccess: () => {
      router.push("/");
      setTimeout(async () => {
        await update();
      }, 200);
    },
    onError: ({ error }) => {
      setServerError(error?.serverError as string);
    },
  });

  const {
    watch,
    register,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<SignInForm>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(signInSchema),
  });

  const renderServerError = () => {
    if (!serverError) return null;
    const message =
      AUTH_MESSAGES[serverError as AuthMessageType] || serverError;
    const handleResend = () => {
      localStorage.setItem("pending_verify_email", getValues("email"));
      router.push("verify-email/resend");
    };
    return (
      <div className="text-center w-full dark:bg-red-900/30 dark:border-red-900 dark:text-red-200 bg-red-100 border border-red-300 text-red-800 rounded-xl p-2">
        <span>{message}</span>
        {serverError === "ACCOUNT_INACTIVE" && (
          <button
            className="pl-2 cursor-pointer underline"
            onClick={handleResend}
          >
            Resend link.
          </button>
        )}
      </div>
    );
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
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="flex w-full items-center justify-center gap-2.5 p-3 border border-primary/20 dark:border-creamwhite/20 text-primary dark:text-creamwhite cursor-pointer duration-250 ease-in hover:bg-secondary/20 rounded-full"
              >
                <span>Continue with</span>
                <Image
                  alt="google-icon"
                  src={GoogleIcon}
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
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit((data) => execute(data))}
            >
              <div>
                <InputField
                  register={register}
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  error={errors.email}
                  onChange={() => {
                    if (errors.email) clearErrors("email");
                    if (serverError) setServerError("");
                  }}
                />
              </div>
              <div>
                <PasswordField
                  register={register}
                  name="password"
                  label="Password"
                  error={errors.password}
                  onChange={() => {
                    if (errors.password) clearErrors("password");
                    if (serverError) setServerError("");
                  }}
                />
              </div>
              {renderServerError()}

              <Suspense fallback={null}>
                <GoogleAuthError
                  email={watch("email")}
                  password={watch("password")}
                />
              </Suspense>
              <div className="mb-9 mt-5">
                <SubmitButton isLoading={isExecuting} label="Sign in" />
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
