import mongoose, { Document, Schema } from "mongoose";
import { number } from "prop-types";

interface ProductDocument extends Document {
  title: string;
  description: string;
  bulletPoints?: string[];
  thumbnail: { url: string; id: string };
  image?: { url: string; id: string }[];
  price: {
    base: number;
    discounted: number;
  };
  quantity: number;
  category: string;
  rating: number;

  sale: number;
}

const productSchema = new Schema<ProductDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  bulletPoints: { type: [String] },
  thumbnail: {
    type: Object,
    required: true,
    url: { type: String, required: true },
    id: { type: String, required: true },
  },
  image: [
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
  category: { type: String, required: true },
  rating: { type: Number, required: true },
});

// Define the virtual property for 'sale'
productSchema.virtual("sale").get(function (this: ProductDocument) {
  return this.price.base - this.price.discounted;
});

// Check if the model already exists in mongoose.models
const modelName = "Product";
const existingModel = mongoose.models[modelName];

// If the model doesn't exist, create it
const ProductModel = existingModel
  ? existingModel.discriminator(modelName, productSchema)
  : mongoose.model(modelName, productSchema);

export default ProductModel;
