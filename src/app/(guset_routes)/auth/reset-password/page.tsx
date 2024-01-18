import UpdatePassword from "@/app/components/UpdatePassword";
import startDb from "@/app/lib/db";
import PasswordResetTokenModel from "@/app/models/passwordRestTokenModel";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}
const FetchTokenValidation = async (token: string, userId: string) => {
  await startDb();
  const resetToken = await PasswordResetTokenModel.findOne({ user: userId });
  if (!resetToken) return null;
  const matched = await resetToken.compareToken(token);
  if (!matched) return redirect("/404");

  return true;
};
console.log(FetchTokenValidation)

export default async function ResetPassword({ searchParams }: Props) {
  const { token, userId } = searchParams;
  if (!token || !userId) {
    return redirect("/404");
  }
  const isValid = await FetchTokenValidation(token, userId);
  if (!isValid) return null;

  return <>page</>;
}
// UpdatePassword token={token} userId={userId}