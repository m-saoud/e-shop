import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { SignCredentials } from "@/app/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, password } = (await req.json()) as SignCredentials;
  if (!email || !password)
    return NextResponse.json({
      error: "Invaled request ,Email & password missing",
    });

  await startDb();
  const user = await UserModel.findOne({ email });
  if (!user)
    return NextResponse.json({
      error: "Email or password mismatch",
    });

  const passwordMtch = await user.comparePssword(password);
  if (!passwordMtch)
    return NextResponse.json({
      error: "Email or password mismatch",
    });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      avatar: user.avatar?.url,
      role: user.role,
    },
  });
};
