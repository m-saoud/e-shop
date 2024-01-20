import { compare, genSalt, hash, hashSync } from "bcrypt";
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
    const hashedToken = await hash(this.token, salt);

    // Set the hashed token back to the document
    this.token = hashedToken;

    next();
  } catch (error) {
    throw error;
  }
});

// Method to compare hashed tokens
passwordRestSchema.methods.compareToken = async function (
  rawToken: string | Buffer
) {
  try {
    // Use bcrypt's compare method to compare the candidate token with the stored hashed token
    const isMatch = await compare(rawToken, this.token);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

// Create the model
export const PasswordResetTokenModel =
  models.PasswordRestToken || model("PasswordResetToken", passwordRestSchema);

export default PasswordResetTokenModel as Model<PasswordResetDoc, {}, Method>;
