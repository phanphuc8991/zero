export function getVerificationHtml(verifyUrl: string, brandColor = "#4f46e5") {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, sans-serif; color: #18181b; }
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
              <h1 class="title">Xác thực email của bạn</h1>
              <p class="desc">Chào bạn, vui lòng nhấn vào nút bên dưới để xác thực tài khoản. Đường liên kết này sẽ hết hạn sau 24 giờ.</p>
              <a href="${verifyUrl}" class="btn" target="_blank">Xác thực ngay</a>
            </td>
          </tr>
        </table>
        <div class="footer">
          Nội dung này được gửi tự động. Nếu không phải bạn, vui lòng bỏ qua.<br>
          &copy; ${new Date().getFullYear()} Acme Inc.
        </div>
      </center>
    </body>
    </html>
  `;
}
