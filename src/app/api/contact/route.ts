// app/api/contact/route.ts

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, house, message } = await req.json();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // ✅ Sertifika hatasını aşmak için
    },
  });
  
 

  const mailOptions = {
    from: `"Zindan Günlükleri Form" <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVER_EMAIL, // alıcı mail
    subject: `📩 Yeni İletişim Formu - ${name}`,
    html: `
      <h2>Yeni mesaj geldi!</h2>
      <p><strong>İsim:</strong> ${name}</p>
      <p><strong>E-posta:</strong> ${email}</p>
      <p><strong>Hangi Büyücü Evi:</strong> ${house}</p>
      <p><strong>Mesaj:</strong><br/>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "Mail gönderildi." });
} catch (error: any) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Mail gönderilemedi.", error: error.message },
      { status: 500 }
    );
  }
}  