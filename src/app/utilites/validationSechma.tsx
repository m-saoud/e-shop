import * as yup from "yup";
import { NewProductInfo } from "../types";

const newProductInfoSchema: yup.ObjectSchema<NewProductInfo, yup.AnyObject, any, ""> = yup
  .object()
  .shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    bulletPoints: yup.array().of(yup.string()).default([]), // default to an empty array if undefined
    mrp: yup.number().required("MRP is required"),
    salePrice: yup
      .number()
      .required("Sale price is required")
      .test(
        "is-less-than-mrp",
        "Sale price must be less than MRP",
        function (salePrice) {
          const mrp = this.parent?.mrp; // Access 'mrp' from the parent object
          return salePrice < mrp;
        }
      ),
    category: yup.string().required("Category is required"),
    quantity: yup
      .number()
      .required("Quantity is required")
      .positive("Quantity must be a positive number"),
    thumbnail: yup
      .mixed()
      .required("Thumbnail is required")
      .test(
        "is-file-size",
        "Thumbnail size must be less than 1MB",
        function (file) {
          return file && (file as File).size <= 1024 * 1024; // 1MB in bytes
        }
      ),
    images: yup
      .array()
      .of(
        yup
          .mixed()
          .test(
            "is-file-size",
            "Image size must be less than 1MB",
            function (file) {
              return file && (file as File).size <= 1024 * 1024; // 1MB in bytes
            }
          )
      )
      .default([]), // default to an empty array if undefined
  });

export default newProductInfoSchema;
