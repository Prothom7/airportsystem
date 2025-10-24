import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message } = await request.json();

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
      port: Number(process.env.MAILTRAP_PORT) || 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "881adce8eef45a",
        pass: process.env.MAILTRAP_PASS || "c668c78e490a94",
      },
    });

    const info = await transport.sendMail({
      from: "prothomghosh41@gmail.com",
      to: process.env.EMAIL_TO || "your-email@example.com",
      subject: subject,
      html: `
        <p>${message}</p>
        <br/>
        <p>From: ${email}</p>
      `,
      replyTo: email,
    });

    console.log("Contact mail sent:", info);

    return NextResponse.json({
      message: "Email sent successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Contact mail error:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
