import nodemailer from 'nodemailer'
import { db } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)
  const config = useRuntimeConfig()
  const slug = config.public.NUXT_DOMAIN
  const now = Date.now()
  const after24h = now + 24 * 60 * 60 * 1000

  const response_user = await db.users.findFirst({
    where: {
      email
    }
  })

  const transporter = nodemailer.createTransport({
    host: config.private.NUXT_SMTP_HOST,
    port: Number(config.private.NUXT_SMTP_PORT),
    secure: false,
    auth: {
      user: config.private.NUXT_SMTP_USER,
      pass: config.private.NUXT_SMTP_PASS,
    },
  });
  const mailOptions = {
    from: `"Morning Fruit 🍊support@fruitsupport.com"`,
    to: email,
    subject: "Đặt lại mật khẩu - Morning Fruit",
    html: `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <title>Đặt lại mật khẩu - Morning Fruit</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .header {
            background: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
          }
          .content {
            padding: 25px;
          }
          .content p {
            line-height: 1.6;
            font-size: 15px;
          }
          .button {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            background-color: #FF9800;
            text-decoration: none;
            border-radius: 8px;
          }
          .footer {
            background: #f1f1f1;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #777;
          }
          .sub {
            font-size: 13px;
            color: #555;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>Morning Fruit 🍊</h1>
          </div>

          <!-- Content -->
          <div class="content">
            <h2>Xin chào ${response_user?.name},</h2>
            <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản Morning Fruit.  
            Vui lòng nhấn vào nút bên dưới để tiến hành đặt lại.  
            <strong>Liên kết này chỉ có hiệu lực trong vòng 24 giờ.</strong></p>

            <p style="text-align: center;">
              <a href="${slug}/login/${response_user?.id}" class="button">Đặt lại mật khẩu</a>
            </p>

            <p class="sub">Nếu nút không hoạt động, hãy liên hệ với quản trị viên của hệ thống</p>
          </div>

          <!-- Footer -->
          <div class="footer">
            🍎 Cảm ơn bạn đã tin tưởng Morning Fruit!  
            <br/>Đội ngũ Morning Fruit
          </div>
        </div>
      </body>
      </html>`,
  };
  try {
    if (!response_user) {
      return false
    } else {
      await db.users.update({
        where:{
          email
        },
        data:{
          expiredDate: new Date(after24h)
        }
      })
      await transporter.sendMail(mailOptions);
      return true
    }
  } catch (error) {
    console.log(error)
    return error
  }


})
