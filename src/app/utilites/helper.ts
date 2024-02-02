import { getCloudConfig, getCloudSignture } from "../(admin)/products/action";

export const upLoadImage = async (file: File) => {
  const { signture, timesStamp } = await getCloudSignture();
  const cloudConfig = getCloudConfig();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", cloudConfig.key);
  formData.append("signture", signture);
  formData.append("timesStamp", timesStamp.toString());
  const endPoint = `https://api.cloudinary.com/v1_1/${cloudConfig.name}/image/upload`;
  const res = await fetch(endPoint, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return { url: data.secure_url, id: data.public_id };
};
