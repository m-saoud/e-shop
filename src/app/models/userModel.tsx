import { Document, Model, Schema, model, models } from "mongoose";

interface userDocument extends Document {
  email: string;
  name: string;
  password: string;
  role: "admin" | "user";
  avatar: { url: string; id: string };
  verified: boolean;
}

const userSchema = new Schema<userDocument>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModle = models.User || model("user", userSchema);
export default UserModle as Model<userDocument>;
