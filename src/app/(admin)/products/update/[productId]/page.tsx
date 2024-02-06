import UpdateProduct from "@/app/components/UpdateProduct";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/prodctModel";
import { Productrseponse } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: {
    productId: string;
  };
}

const fetchProductInfo = async (productId: string): Promise<string> => {
  if (!isValidObjectId(productId)) {
    redirect("/404");
  }
  await startDb();
  const product = await ProductModel.findById(productId);
  if (!product) {
    redirect("/404");
  }

  const finalProduct: Productrseponse = {
    id: product._id.toString(),
    title: product.title,
    thumbnail: product.thumbnail,
    description: product.description,
    price: product.price,
    images: product.images,
    category: product.category,
    quantity: product.quantity,
  };
  return JSON.stringify(finalProduct);
};

export default async function updateProduct(props: Props) {
  const { productId } = props.params;
  const product = await fetchProductInfo(productId);
  console.log(product);

  return (
    <div>
      <UpdateProduct product={JSON.parse(product)} />
    </div>
  );
}
