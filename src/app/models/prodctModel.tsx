import mongoose, { Document, Schema } from "mongoose";
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
  sale: number;
}

interface ProductDocument extends NewProduct, Document {
  computedSale: number; // Adjust the virtual property name
}

const modelName = "Product";

// Check if the model already exists in mongoose.models
const existingModel = mongoose.models[
  modelName
] as mongoose.Model<ProductDocument>;

let ProductModel: mongoose.Model<ProductDocument>;

// If the model doesn't exist, create it
if (existingModel) {
  ProductModel = existingModel;
} else {
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
      sale: { type: Number },
      quantity: { type: Number, required: true },
      category: { type: String, enum: [...categories], required: true },
      rating: { type: Number, required: true },
    },
    { timestamps: true }
  );

  // Define the virtual property for 'computedSale'
  productSchema.virtual("computedSale").get(function (this: ProductDocument) {
    return this.price.base - this.price.discounted / this.price.base;
  });

  ProductModel = mongoose.model<ProductDocument>(modelName, productSchema);
}

export default ProductModel;
