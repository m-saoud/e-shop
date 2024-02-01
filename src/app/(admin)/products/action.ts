"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

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
