import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { NewUserReq } from "@/app/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserReq;
  console.log(body)
  await startDb();
  const newUser = await UserModel.create({ ...body });
  return NextResponse.json(newUser);
};
