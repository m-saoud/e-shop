import React from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
interface Props {
  children: React.ReactNode;
}
export default async function PrivateLayout({ children }: Props) {
  const session = await auth();
  if (!session) return redirect("/auth/signin");

  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
