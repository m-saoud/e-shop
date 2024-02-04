"use server";
import startDb from "@/app/lib/db";
import ProductModel, { NewProduct } from "@/app/models/prodctModel";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});
export const getCloudConfig = () => {
  return { name: process.env.CLOUD_NAME!, key: process.env.CLOUD_API_KEY! };
};

//generate our cloud signture
export const getCloudSignture = async () => {
  const secret = cloudinary.config().api_secret!;
  const timesStamp = Math.round(new Date().getTime() / 1000);
  const signture = cloudinary.utils.api_sign_request(
    {
      timesStamp,
    },
    secret
  );
  return { timesStamp, signture };
};
export const createProduct = async (info: NewProduct) => {
  try {
    await startDb();
    const newProduct = new ProductModel(info);
    await newProduct.save();
  } catch (error) {
    console.log((error as any).message);
    throw new Error("somthing went wrong ,cant make product");
  }
};
