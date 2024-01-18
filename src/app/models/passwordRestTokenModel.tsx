import { compare, genSalt, hash } from "bcrypt";
import {
  Date,
  Document,
  Model,
  ObjectId,
  Schema,
  model,
  models,
} from "mongoose";

interface PasswordResetDoc extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}
interface Method {
  compareToken(token: string): Promise<boolean>;
}

// Define the schema
const passwordRestSchema = new Schema<PasswordResetDoc, {}, Method>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24,
  },
});

// Pre-save middleware to hash the token before saving
passwordRestSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("token")) {
      return next();
    }
    // Generate a salt
    const salt = await genSalt(10);

    // Hash the token with the salt
    this.token = await hash(this.token, salt);

    next();
  } catch (error) {
    throw error;
  }
});

// Method to compare hashed tokens
passwordRestSchema.methods.compareToken = async function (
  tokenToCompare: string | Buffer
) {
  try {
    // Use bcrypt's compare method to compare the candidate token with the stored hashed token
    const isMatch = compare(tokenToCompare, this.token);
    return await isMatch;
  } catch (error) {
    throw error;
  }
};

// Create the model
const PasswordResetTokenModel =
  models.PasswordRestToken || model("PasswordResetToken", passwordRestSchema);

export default PasswordResetTokenModel as Model<PasswordResetDoc, {}, Method>;
