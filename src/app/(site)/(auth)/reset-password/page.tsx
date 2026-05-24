import { ResetPassword } from "@/features/auth/components/reset-password";
type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { token } = await searchParams;
  return <ResetPassword token={token} />;
}
