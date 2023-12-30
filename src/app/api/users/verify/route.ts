import EmailVerificationtoken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModel";
import { EmailVeriReq } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId, token } = (await req.json()) as EmailVeriReq;

    // confirm userId AND TOKEN
    if (!isValidObjectId(userId) && !token) {
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
          error: "Invalid Token !",
        },
        { status: 401 }
      );
    }

    //if we found token now to compare it
    const isMtched = await verifyToken.tokenToCompare(token);
    if (!isMtched) {
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
