import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
const SUCCESS_MESSAGES: Record<string, string> = {
  verified: "Email verified! Please sign in.",
};

export function SuccessMessage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  if (!success) return null;

  return (
    <Suspense fallback={null}>
      <p className="text-green-500 text-sm mb-4">{SUCCESS_MESSAGES[success]}</p>
    </Suspense>
  );
}
