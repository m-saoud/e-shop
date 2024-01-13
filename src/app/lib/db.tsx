import mongoose from "mongoose";
let connection: typeof mongoose;
const url = `mongodb+srv://engmsaoud2014:${process.env.PASSWORD}@cluster0.hzgrr8w.mongodb.net/e_shope`;

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
