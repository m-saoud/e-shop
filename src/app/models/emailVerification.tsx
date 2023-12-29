import { Date, Document, ObjectId,Schema } from "mongoose";

interface emailVerificationDoc extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


// Define the schema
const emailVerificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming there's a User model
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to hash the token before saving
emailVerificationSchema.pre("save", async function (next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the token with the salt
    const hashedToken = await bcrypt.hash(this.token, salt);

    // Set the hashed token back to the document
    this.token = hashedToken;

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare hashed tokens
emailVerificationSchema.methods.compareToken = async function (candidateToken) {
  try {
    // Use bcrypt's compare method to compare the candidate token with the stored hashed token
    const isMatch = await bcrypt.compare(candidateToken, this.token);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

// Method to check if the token has expired (assuming a 24-hour expiration)
emailVerificationSchema.methods.isTokenExpired = function () {
  const twentyFourHoursInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const now = new Date();
  return this.createdAt.getTime() + twentyFourHoursInMillis < now.getTime();
};

// Create the model
const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);

module.exports = EmailVerification;
