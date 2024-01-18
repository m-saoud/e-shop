import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { SignCredentials } from "@/app/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, password } = (await req.json()) as SignCredentials;
  //check if no email or password 
  if (!email || !password)
    return NextResponse.json({
      error: "Invaled request ,Email & password missing",
    });
  //start db 
  await startDb();

  //find the user 
  const user = await UserModel.findOne({ email });
  
  //if no user 
  if (!user)
    return NextResponse.json({
      error: "Email or password mismatch",
    });  
  
//copared the pssword if found user 
  const passwordMtch = await user.comparePssword(password);
  if (!passwordMtch)
    return NextResponse.json({
      error: "Email or password mismatch",
    });
  
  //return user info
  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      avatar: user.avatar?.url,
      role: user.role,
    },
  });
};
 

