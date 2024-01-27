import React from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { Navbar } from "../components/navbar";
interface Props {
  children: React.ReactNode;
}
export default async function HomeLayout({ children }: Props) {
  return (
    <div>
      <div className="mx-w-screen-xl mx-auto xl:p-0 p-4">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
