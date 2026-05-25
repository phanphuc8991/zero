"use client";
import Link from "next/link";
import Image from "next/image";
import DarkLogo from "@/assets/images/logo/dark-logo.svg";
import LightLogo from "@/assets/images/logo/light-logo.svg";
import GoogleIcon from "@/assets/images/icon/google-icon.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signupAction } from "@/features/auth/actions";
import {
  AUTH_MESSAGES,
  AuthMessageType,
  type RegisterForm,
  registerSchema,
} from "@/features/auth/constants";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2 } from "lucide-react";
import DarkCloseIcon from "@/assets/images/icon/close-dark-icon.svg";
import LightCloseIcon from "@/assets/images/icon/close-light-icon.svg";
import { PillButton } from "@/app/components/ui/PillButton";
import { useAction } from "next-safe-action/hooks";
import { InputField } from "@/app/components/ui/InputField";
import { PasswordField } from "@/app/components/ui/PasswordField";
import { SubmitButton } from "@/app/components/ui/SubmitButton";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  const { execute, result, isExecuting } = useAction(signupAction, {
    onSuccess: () => {
      setIsModalOpen(true);
      setRegisteredEmail(getValues("email"));
    },
    onError: ({ error }) => {
      setServerError(error?.serverError as string);
    },
  });

  const renderServerError = () => {
    if (!serverError) return null;
    return (
      <div className="text-center w-full dark:bg-red-900/30 dark:border-red-900 dark:text-red-200 bg-red-100 border border-red-300 text-red-800 rounded-xl p-2">
        {AUTH_MESSAGES[serverError as AuthMessageType] || serverError}
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
              <div className="">
                <InputField
                  register={register}
                  name="name"
                  label="Name"
                  placeholder="Your name"
                  error={errors.name}
                  onChange={() => {
                    if (errors.email) clearErrors("email");
                    if (serverError) setServerError("");
                  }}
                />
              </div>

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
              <div className="mb-9 mt-5">
                <SubmitButton isLoading={isExecuting} label="Sign up" />
              </div>
            </form>
            <div className="flex flex-col justify-center items-center gap-2">
              <p className="flex flex-wrap justify-center max-w-xs">
                <span>By creating an account, you agree with our</span>
                <Link
                  href="/privacy-policy"
                  className="block text-primary dark:text-creamwhite hover:text-secondary"
                >
                  Privacy
                </Link>
                <span className="mx-1">&</span>
                <Link
                  href="/privacy-policy"
                  className="block text-primary dark:text-creamwhite hover:text-secondary"
                >
                  Policy.
                </Link>
              </p>
              <p className="text-primary dark:text-creamwhite">
                <span className="pr-1">Already have an account?</span>
                <Link
                  className="text-primary dark:text-creamwhite hover:text-secondary"
                  href="sign-in"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" />
          <Dialog.Content
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
            className="fixed left-1/2 top-1/2 bg-warm-ivory dark:bg-primary p-6 rounded-2xl max-w-lg  -translate-x-1/2 -translate-y-1/2 focus:outline-none z-60 w-[calc(100%-2rem)]"
          >
            <div className="flex flex-col justify-center gap-6 pt-5 pb-10">
              <Dialog.Title className="flex justify-center">
                <div className="p-4 rounded-full bg-secondary items-center justify-centerinline-block">
                  <CheckCircle2
                    size={36}
                    className="text-black/80"
                    strokeWidth={2}
                  />
                </div>
              </Dialog.Title>
              <div>
                <Dialog.Description className="font-bold mb-2 text-center">
                  <span>
                    {result?.data?.message
                      ? AUTH_MESSAGES[result.data.message]
                      : ""}
                  </span>
                </Dialog.Description>
                <Dialog.Description className="font-medium text-center">
                  We sent a link to {registeredEmail}
                </Dialog.Description>
              </div>

              <div className="flex justify-center">
                <div className="w-[70%]">
                  <PillButton
                    label="Open Gmail"
                    href="https://mail.google.com"
                    target="_blank"
                  />
                </div>
              </div>
            </div>
            <Dialog.Close asChild className="cursor-pointer">
              <div className="absolute right-2.5 top-2.5">
                <Image
                  src={LightCloseIcon}
                  alt="icon"
                  width={22}
                  height={22}
                  className="w-5.5 h-5.5 dark:hidden"
                />
                <Image
                  src={DarkCloseIcon}
                  alt="icon"
                  width={22}
                  height={22}
                  className="w-5.5 h-5.5 hidden dark:block"
                />
              </div>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
