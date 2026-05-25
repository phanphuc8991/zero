"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
const ERROR_MESSAGES: Record<string, string> = {
  EmailAlreadyExists:
    "This email is already registered with a password. Please sign in with your credentials.",
};

export function GoogleAuthError({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  useEffect(() => {
    if (error && (email || password)) {
      router.replace("/sign-in");
    }
  }, [email, password]);
  if (!error) return null;
  return (
    <div className="text-center w-full dark:bg-red-900/30 dark:border-red-900 dark:text-red-200 bg-red-100 border border-red-300 text-red-800 rounded-xl p-2">
      <span>{ERROR_MESSAGES[error]}</span>
    </div>
  );
}
