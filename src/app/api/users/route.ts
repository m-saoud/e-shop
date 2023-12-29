import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { NewUserReq } from "@/app/types";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserReq;
  console.log(body)
  await startDb();
  const newUser = await UserModel.create({ ...body });
  console.log( await newUser.comparePssword("12345678"))
  console.log( await newUser.comparePssword("xxxcccvbnmh"))
  return NextResponse.json(newUser);
};

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6494749aa1a716",
    pass: "df939d5783d494"
  }
});
 await transport.sendMail(
  {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?<a href = 'http://localhost:3000/' >this link</a></b>", // html body
  });



