"use client";
import ProductForm from "@/app/components/ProductForm";
import { NewProductInfo } from "@/app/types";
import React from "react";

export default function Create() {
  const handleCreateProduct = (values:NewProductInfo)=> {
    
  }
  return (
    <div>
      <ProductForm
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}
