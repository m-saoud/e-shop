import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { NewUserReq } from "@/app/types";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { EmailVerificationToken } from "@/app/models/emailVerificationToken";
import crypto from "crypto";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserReq;

  await startDb();
  const newUser = await UserModel.create({ ...body });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6494749aa1a716",
      pass: "df939d5783d494",
    },
  });

  const token = crypto.randomBytes(36).toString("hex");

  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const veriUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;
  await transport.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: newUser.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Thank you ..please click in?<a href = "${veriUrl}" >this link</a></b>`, // html body
  });
  return NextResponse.json({ message: "Please check your Email!" });
};
