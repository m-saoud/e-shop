import ProductForm from "@/app/components/ProductForm";
import React from "react";

export default function Create() {
  return <div><ProductForm onSubmit={function (values: any): void {
    throw new Error("Function not implemented.");
  } }/></div>;
}