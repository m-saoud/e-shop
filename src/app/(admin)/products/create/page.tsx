"use client";
import ProductForm from "@/app/components/ProductForm";
import { NewProductInfo } from "@/app/types";
import { upLoadImage } from "@/app/utilites/helper";
import newProductInfoSchema from "@/app/utilites/validationSechma";
import React from "react";
import { toast } from "react-toastify";
import { ValidationError } from "yup";
import { createProduct } from "../action";

export default function Create() {
  const handleCreateProduct = async (values: NewProductInfo) => {
    const { thumbnail, images } = values;
    try {
      await newProductInfoSchema.validate(values, { abortEarly: false });
      const thumbnailRes = await upLoadImage(thumbnail!);
      let productImages: { url: string; id: string }[] = [];
      if (images) {
        const uploadPromise = images.map(async (imageFile) => {
          const { id, url } = await upLoadImage(imageFile);
          return { url, id };
        });
        productImages = await Promise.all(uploadPromise);
      }
      // await createProduct({
      //   ...values,
      //   price: {
      //     base: values.mrp,
      //     discounted: values.salePrice,
      //   },
      //   thumbnail: thumbnailRes,
      //   images: productImages,
      //   rating: 0,
      //   sale: 0,
      // });
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.forEach((err) => { // Changed map to forEach for side effects like toast notifications
          toast.error(err.message);
        });
      }
    }
  };

  return (
    <div>
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
}
