import { compare, compareSync, genSalt, hash } from "bcrypt";
import mongoose, {
  Date,
  Document,
  Model,
  ObjectId,
  Schema,
  models,
} from "mongoose";

interface EmailVerificationDoc extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}
interface Method {
  compareToken(token: string): Promise<boolean>;
}

// Define the schema
const emailVerificationSchema = new Schema<EmailVerificationDoc, {}, Method>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
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
emailVerificationSchema.pre("save", async function (next) {
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
    next(error as mongoose.Error);
  }
});

// Method to compare hashed tokens
emailVerificationSchema.methods.compareToken = async function (
  tokenToCompare: string | Buffer
) {
  try {
    // Use bcrypt's compare method to compare the candidate token with the stored hashed token
    const isMatch = compare(tokenToCompare, this.token);
    return isMatch;
  } catch (error) {
    console.error("Error comparing tokens:", error);
    throw error;
  }
};

// // Method to check if the token has expired (assuming a 24-hour expiration)
// emailVerificationSchema.methods.isTokenExpired = function () {
//   const twentyFourHoursInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
//   const now = new Date();
//   return this.createdAt.getTime() + twentyFourHoursInMillis < now.getTime();
// };

// Create the model
export const EmailVerificationToken =
  models.EmailVerificationToken ||
  mongoose.model("EmailVerificationToken", emailVerificationSchema);

export default EmailVerificationToken as Model<
  EmailVerificationDoc,
  {},
  Method
>;
