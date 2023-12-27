import mongoose from "mongoose";

let connection: typeof mongoose;
const url =
  "mongodb+srv://engmsaoud2014:EqWMZhQiREBU4V1O@cluster0.hzgrr8w.mongodb.net/e_shope";
mongoose.set("bufferCommands", false);

const startDb = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(url);
    }
    return connection;
  } catch (error) {
    throw new Error(error as any).message;
  }
};
export default startDb;
