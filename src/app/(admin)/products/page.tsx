// Assuming the correct path and file name for your model
import ProductModel from "@/app/models/prodctModel";
import startDb from "@/app/lib/db";
import ProductTable, { Product } from "@/app/components/ProductTable";
import React from "react";

const fetchingProducts = async (
  pageNo: number,
  perPage: number
): Promise<Product[]> => {
  const skipCount = (pageNo - 1) * perPage;
  await startDb();

  // Ensure that ProductModel is callable and recognized as a function
  const products = await ProductModel.find()
    .sort("-createdAt")
    .skip(skipCount)
    .limit(perPage);

  return products.map((product: any) => {
    const thumbnailUrl = product.thumbnail?.url || ""; // Add a check here

    return {
      id: product._id.toString(),
      title: product.title,
      thumbnail: thumbnailUrl,
      description: product.description,
      price: {
        mrp: product.price.base,
        salePrice: product.price.discounted,
        saleOff: product.sale,
      },
      category: product.category,
      quantity: product.quantity,
    };
  });
};

export default async function Products() {
  const products = await fetchingProducts(1, 10);

  return (
    <div>
      <ProductTable products={products} currentPageNo={0} />
    </div>
  );
}
