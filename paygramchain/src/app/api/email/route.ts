// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';

// type Data = {
//   name: string;
// };
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, reciever, subject, message } = body;

    const transporter = nodemailer.createTransport({
      host: 'stmp.gmail.com',
      port: 587,
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: reciever,
      subject: subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
        /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}