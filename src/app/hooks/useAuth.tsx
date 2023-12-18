import React from "react";

interface Auth {
  loading: boolean;
  loggedIn: boolean;
  isAdmin: boolean;
}
export default function UseAuth(): Auth {
  return {
    loading: false,
    loggedIn: false,
    isAdmin:false
  };
}
