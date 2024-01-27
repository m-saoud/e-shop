import PasswordResetTokenModel from "@/app/models/passwordRestTokenModel";
import UserModel from "@/app/models/userModel";
import { forgetPasswordReq } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import startDb from "@/app/lib/db";

export const POST = async (req: Request, _res: Response) => {
  try {
    const { email } = (await req.json()) as forgetPasswordReq;
    if (!email) {
      return NextResponse.json({ error: "email not found" }, { status: 404 });
    }
    await startDb();
    const user: any = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    //if there is user ..generate token and send link  to gaiven email
    await PasswordResetTokenModel.findOneAndDelete({ user: user._id });
    const token = crypto.randomBytes(36).toString("hex");
    await PasswordResetTokenModel.create({
      user: user._id,
      token,
    });

    //send link  to gaiven email
    const restPsswordLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

    sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "forget-password",
      linkUrl: restPsswordLink,
    });
    return NextResponse.json({ message: "please check your email" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
};
function sendEmail(_arg0: {
  profile: { name: any; email: any };
  subject: string;
  linkUrl: string;
}) {
  throw new Error("Function not implemented.");
}
