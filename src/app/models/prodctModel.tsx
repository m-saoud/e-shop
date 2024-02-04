import mongoose, { Document, Schema } from "mongoose";
import { number } from "prop-types";
import categories from "../utilites/categories";

export interface NewProduct {
  title: string;
  description: string;
  bulletPoints?: string[];
  thumbnail: { url: string; id: string };
  images?: { url: string; id: string }[];
  price: {
    base: number;
    discounted: number;
  };
  quantity: number;
  category: string;
  rating: number;
}

interface ProductDocument extends NewProduct {
  sale: number;
}

const modelName = "Product";

// Check if the model already exists in mongoose.models
const existingModel = mongoose.models[modelName];

const productSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    bulletPoints: { type: [String] },
    thumbnail: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    images: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    price: {
      base: { type: Number, required: true },
      discounted: { type: Number, required: true },
    },
    quantity: { type: Number, required: true },
    category: { type: String, enum: [...categories], required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

// Define the virtual property for 'sale'
productSchema.virtual("sale").get(function (this: ProductDocument) {
  return this.price.base - this.price.discounted / this.price.base;
});

// If the model doesn't exist, create it
export default ProductModel: mongoose.Model<ProductDocument> = existingModel
  ? existingModel.discriminator(modelName, productSchema)
  : mongoose.model(modelName, productSchema);

