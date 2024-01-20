import startDb from "@/app/lib/db";
import PasswordResetTokenModel from "@/app/models/passwordRestTokenModel";
import UserModel from "@/app/models/userModel";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req: Request) => {
  try {
    const { password, token, userId } = await req.json();
    if (!token || !password || !isValidObjectId(userId))
      return NextResponse.json({ errore: "invalied request" }, { status: 401 });
    await startDb();
    const resetToken = await PasswordResetTokenModel.findOne({ user: userId });
    if (!resetToken)
      return NextResponse.json(
        { errore: "invalied request,token not found " },
        { status: 401 }
      );

    const matched = await resetToken.compareToken(token);
    if (!matched)
      return NextResponse.json(
        { errore: "invalied request,token doesn't match!" },
        { status: 401 }
      );

    const user = await UserModel.findById(userId);
    if (!user)
      return NextResponse.json(
        { errore: "invalied request,user not found " },
        { status: 404 }
      );
    const isMtched = await user.comparePssword(password);
    if (isMtched)
      return NextResponse.json(
        { errore: "the password should be different !" },
        { status: 401 }
      );
    user.password = password;
    await user.save();
    await PasswordResetTokenModel.findByIdAndDelete(resetToken._id);
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
      html: `<b> Password has been changed </b>`, // html body
    });
    return NextResponse.json({ message: "Password has been changed! " });
  } catch (error) {
    return NextResponse.json(
      {
        error: "We couldn't update password, something went wrong!",
      },
      { status: 500 }
    );
  }
};
