import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { NewUserReq } from "@/app/types";
import { NextResponse } from "next/server";
import { EmailVerificationToken } from "@/app/models/emailVerificationToken";
import crypto from "crypto";
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserReq;

  await startDb();

  const newUser = await UserModel.create({ ...body });

  const token = crypto.randomBytes(36).toString("hex");

  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const veriUrl = `${process.env.NEW_USER_EMAI_VERIFCTON}new_user_verify?token=${token}&userId=${newUser._id}`;
  sendEmail({
    profile: { name: newUser.name, email: newUser.email },
    subject: "verification",
    linkUrl: veriUrl,
  });
  return NextResponse.json({
    message: " You successfully to create new account Please check your Email!",
  });
};
