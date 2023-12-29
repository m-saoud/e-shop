import { Document, Model, Schema, model, models } from "mongoose";
import { compare, genSalt, hashSync } from "bcrypt";

interface userDocument extends Document {
  email: string;
  name: string;
  password: string;
  role: "admin" | "user";
  avatar: { url: string; id: string };
  verified: boolean;
}
interface Method {
  comparePssword(password: string): Promise<boolean>;
}

const userSchema = new Schema<userDocument, {}, Method>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: Object, url: String, id: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await genSalt(10);
    this.password = hashSync(this.password, salt);
    next();
  } catch (error) {
    throw error;
  }
});
userSchema.methods.comparePssword = async function (password) {
  try {
    return await compare(password, this.password);
  } catch (error) {
    throw error;
  }
};
const UserModel = models.User || model("User", userSchema);
export default UserModel as Model<userDocument, {}, Method>;
