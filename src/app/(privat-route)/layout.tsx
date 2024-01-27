import React from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import EmailVerficationBanner from "../components/EmailVerficationBanner";
import { Navbar } from "../components/navbar";
interface Props {
  children: React.ReactNode;
}
export default async function PrivateLayout({ children }: Props) {
  const session = await auth();
  if (!session) return redirect("/auth/signin");
    return (
    <div>
      <div className="max-w-screen-xl mx-auto p-4 xl:p-0">
        <EmailVerficationBanner />
          {children}
          <Navbar />

      </div>
    </div>
  );
}
