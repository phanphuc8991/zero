import { VerifyEmailResult } from "@/features/auth/components/verify-email-result";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { status } = await searchParams;

  return <VerifyEmailResult status={status} />;
}
