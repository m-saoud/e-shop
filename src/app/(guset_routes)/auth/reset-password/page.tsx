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
const fetchValidationToken = async (token: string, userId: string) => {
  await startDb();
  const resToken = await PasswordResetTokenModel.findOne({ user: userId });
  if (!resToken) return null;
  const matched = await resToken.compareToken(token);
  if (!matched) return null;
  return true;
};
export default async function ResetPassword({ searchParams }: Props) {
  console.log(searchParams);
  const { userId, token } = searchParams;
  if (!userId || !token) {
    return null;
  }
  const isValed = await fetchValidationToken(userId, token);
  if (!isValed) return null;
  return <UpdatePassword token={token} userId={userId} />;
}
