import PasswordResetTokenModel from "@/app/models/passwordRestTokenModel";
import UserModel from "@/app/models/userModel";
import { forgetPasswordReq } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import startDb from "@/app/lib/db";

export const POST = async (req: Request, res: Response) => {
  try {
    const { email } = (await req.json()) as forgetPasswordReq;
    if (!email) {
      return NextResponse.json({ error: "email not found" }, { status: 404 });
    }
    await startDb();
    const user: any = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error:"user not found" }, { status: 404 });
    }
    //if there is user ..generate token and send link  to gaiven email
    await PasswordResetTokenModel.findOneAndDelete({ user: user._id });
    const token = crypto.randomBytes(36).toString("hex");
    await PasswordResetTokenModel.create({
      user: user._id,
      token,
    });

    //send link  to gaiven email
    const restPsswordLink = `http://localhost:3000/user/reset-password?token=${token}&userId=${user._id}`;
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "6494749aa1a716",
        pass: "df939d5783d494",
      },
    });
    await transport.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: user?.email, // list of receivers
      subject: "Hello ✔", // Subject line
      html: `<b>click in <a href="${restPsswordLink}">this link</a> to reset your password </b>`, // html body
    });
    return NextResponse.json({ message: "please check your email" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
};
