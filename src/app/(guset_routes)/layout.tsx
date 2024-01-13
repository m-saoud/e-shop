import React from "react";
import { auth } from "../../../auth";
 import { redirect } from "next/navigation";
interface Props {
  children: React.ReactNode;
}
export default async function GusetLayout({ children }: Props) {
  const session = await auth();
  console.log(session)
   if (session) return redirect('/') 

  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
