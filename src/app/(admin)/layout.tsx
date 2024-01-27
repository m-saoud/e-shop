import React from "react";
import { auth } from "../../../auth";
import { redirect, useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSideBar";

import { toast } from "react-toastify";
interface Props {
  children: React.ReactNode;
}
export default async function AdminLayout({ children }: Props) {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
    if (!isAdmin) {
// proplem         
  }
  return (
    <div>
      <div>
        <AdminSidebar>{children}</AdminSidebar>
      </div>
    </div>
  );
}

