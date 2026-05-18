"use client";

import { SignIn } from "@/features/auth/components/signin";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignIn />;
    </Suspense>
  );
}
