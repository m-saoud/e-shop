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
  id?:number
}
export interface EmailVeriReq {
  userId: string;
  token: string;
}
export interface forgetPasswordReq {
  email: string;

}
