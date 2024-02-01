import * as yup from "yup";

interface FileWithSize extends File {
  size: number;
}

const fileSchema = yup
  .mixed<FileWithSize>()
  .transform((originalValue, originalObject) => {
    // This transformation is necessary to access file properties
    return originalObject instanceof File
      ? (originalObject as FileWithSize)
      : originalValue;
  });

const newProductInfoSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  bulletPoints: yup.array().of(yup.string()),
  mrp: yup.number().required(),
  salePrice: yup
    .number()
    .required()
    .lessThan(yup.ref("mrp"), "Sale price must be less than MRP"),
  category: yup.string().required(),
  quantity: yup.number().required().positive().integer(),
  thumbnail: fileSchema
    .required("Thumbnail is required")
    .test("fileSize", "Thumbnail must be 1 MB or less", (value) => {
      return value && value.size <= 1024 * 1024;
    })
    .test("fileType", "Thumbnail must be an image", (value) => {
      return value && value.type.startsWith("image/");
    }),
  images: yup
    .array()
    .of(
      fileSchema
        .test("fileSize", "Image must be 1 MB or less", (value) => {
          return value && value.size <= 1024 * 1024;
        })
        .test("fileType", "Image must be an image", (value) => {
          return value && value.type.startsWith("image/");
        })
    )
    .required("At least one image is required"),
});

export default newProductInfoSchema;
