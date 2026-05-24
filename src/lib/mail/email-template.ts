type EmailType = "verification" | "reset-password";

export function getAuthEmailHtml(
  verifyUrl: string,
  type: EmailType = "verification",
  brandColor = "#4f46e5",
) {
  const content = {
    verification: {
      title: "Verify your email address",
      desc: "Hello! Please click the button below to verify your account. This link will expire in 24 hours.",
      btnText: "Verify Email",
    },
    "reset-password": {
      title: "Reset your password",
      desc: "We received a request to reset your password. Click the button below to set up a new one. This link will expire in 24 hours.",
      btnText: "Reset Password",
    },
  }[type];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b; }
        .wrapper { width: 100%; padding: 40px 0; background-color: #f4f4f5; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; padding: 40px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .logo { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 32px; color: ${brandColor}; }
        .title { font-size: 20px; font-weight: 600; line-height: 1.4; margin: 0 0 12px 0; }
        .desc { font-size: 15px; line-height: 1.6; color: #71717a; margin: 0 0 32px 0; }
        .btn { display: inline-block; background-color: ${brandColor}; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-size: 15px; font-weight: 500; border-radius: 8px; }
        .footer { text-align: center; font-size: 12px; color: #a1a1aa; margin-top: 32px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <center class="wrapper">
        <table role="presentation" class="card" width="100%">
          <tr>
            <td>
              <div class="logo">ACME</div>
              <h1 class="title">${content.title}</h1>
              <p class="desc">${content.desc}</p>
              <a href="${verifyUrl}" class="btn" target="_blank">${content.btnText}</a>
            </td>
          </tr>
        </table>
        <div class="footer">
          This is an automated email. If you did not request this, please ignore it.<br>
          &copy; ${new Date().getFullYear()} Acme Inc.
        </div>
      </center>
    </body>
    </html>
  `;
}
