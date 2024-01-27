import EmailVerificationToken from "@/app/models/emailVerificationToken";
import EmailVerificationtoken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModel";
import { EmailVeriReq } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import crypto from "crypto";
import startDb from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  try {
    const { userId, token } = (await req.json()) as EmailVeriReq;

    // confirm userId AND TOKEN
    if (!isValidObjectId(userId) || !token) {
      return NextResponse.json(
        {
          error: "Invalid Request ! User Id and Token is required!",
        },
        { status: 401 }
      );
    }
    //confirm verify token

    const verifyToken = await EmailVerificationtoken.findOne({ user: userId });

    if (!verifyToken) {
      return NextResponse.json(
        {
          error: "Invalid Token!",
        },
        { status: 401 }
      );
    }

    //if we found token now to compare it
    const isMatched = await verifyToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json(
        {
          error: "Invalid Token !, token doesn't match",
        },
        { status: 401 }
      );
    }
    //IF FOUND UpDate the user id and verified to true
    await UserModel.findByIdAndUpdate(userId, { verified: true });
    // no need after that to token delete it from d.base
    await EmailVerificationtoken.findByIdAndDelete(verifyToken._id);
    //return meesage  confirm the emial
    return NextResponse.json({ message: "Your Email is Verified" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "We couldn't verify your email, something went wrong!",
      },
      { status: 500 }
    );
  }
};
export const GET = async (req: Request) => {
  try {
    const userId = req.url.split("?userId=")[1];
    console.log("user ====>", req.url.split("?userId="[1]));

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "invalied requsest user id missing" },
        { status: 401 }
      );
    }
    //startdb
    await startDb();

    // Fetch user document using the userId and check if the user is found
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "invalied requsest user not found !" },
        { status: 401 }
      );
    }
    //confirm  the user verfied or not
    if (user.verified) {
      return NextResponse.json(
        { error: "The user already verified !" },
        { status: 401 }
      );
    }
    //generate the token
    const token = crypto.randomBytes(36).toString("hex");
    await EmailVerificationToken.findByIdAndDelete({ user: userId });
    await EmailVerificationToken.create({
      user: userId,
      token,
    });
    //make magic link
    const veriUrl = `${process.env.VERFIY_EAMIL_URL}verify?token=${token}&userId=${userId}`;
    console.log(veriUrl);

    sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "verification",
      linkUrl: veriUrl,
    });

    //return meesage  confirm the emial
    return NextResponse.json({ message: "Please check your email" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "We couldn't verify your email, something went wrong!",
      },
      { status: 500 }
    );
  }
};
