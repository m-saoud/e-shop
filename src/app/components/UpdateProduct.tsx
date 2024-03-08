"use client";
import React from "react";
import ProductForm, { InitialValue } from "./ProductForm";
import { NewProductInfo, Productrseponse } from "../types";
interface Props {
  product: Productrseponse;
}
export default function UpdateProduct({ product }: Props) {
  const initialValue: InitialValue = {
    ...product,
    thumbnail: product.thumbnail.url,
    images: product.images?.map(({ url }) => url),
    mrp: product.price.base,
    salePrice: product.price.discounted,
    bulletPoints: product.bulletPoints || [],
  };

  // const handleOnSubmit = (values) => {

  // };
  return (
    <div>
      <ProductForm initialValue={initialValue} onSubmit={function (values: NewProductInfo): void {
        throw new Error("Function not implemented.");
      } }  />
    </div>
  );
}
