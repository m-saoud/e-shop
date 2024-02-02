import React from "react";

export interface MenuItems {
  href: string;
  icon: React.JSX.Element;
  label: string;
}

export interface NewUserReq {
  name: string;
  password: string;
  email: string;
}
export interface SignCredentials {
  password: string;
  email: string;
  id?: number;
}
export interface EmailVeriReq {
  userId: string;
  token: string;
}
export interface forgetPasswordReq {
  email: string;
}
export interface SessionUserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  verified: boolean;
}
export interface NewProductInfo {
  title: string;
  description: string;
  bulletPoints: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
  thumbnail?: File;
  images: File[]
}
