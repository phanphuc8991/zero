"use client";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { ComponentProps } from "react";
interface NavButtonProps extends ComponentProps<"button"> {
  to: string;
  children: React.ReactNode;
  className?: string;
}
export function NavButton({
  to,
  children,
  className = "",
  ...props
}: NavButtonProps) {
  const router = useRouter();
  return (
    <Button className={className} {...props} onClick={() => router.push(to)}>
      {children}
    </Button>
  );
}
