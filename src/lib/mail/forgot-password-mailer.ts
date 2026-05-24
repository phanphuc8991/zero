import { Resend } from "resend";
import { getAuthEmailHtml } from "./email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendForgotPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: getAuthEmailHtml(resetUrl),
    });

    if (error) return Response.json({ error }, { status: 500 });
    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
