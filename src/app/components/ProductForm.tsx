"use client";
import {
  Button,
  Input,
  Option,
  Select,
  Textarea,
} from "@material-tailwind/react";
import React, {
  useEffect,
  useState,
  useTransition,
  ChangeEventHandler,
} from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import categories from "@/app/utilites/categories";
import ImageSelector from "@/app/components/ImageSelector";
import { NewProductInfo } from "../types";

interface Props {
  initialValue?: InitialValue;
  onSubmit(values: NewProductInfo): void;
}

export interface InitialValue {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images?: string[];
  bulletPoints: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
}

const defaultValue = {
  title: "",
  description: "",
  bulletPoints: [""],
  mrp: 0,
  salePrice: 0,
  category: "",
  quantity: 0,
};

export default function ProductForm(props: Props) {
  const { onSubmit, initialValue } = props;
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File>();
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [productInfo, setProductInfo] = useState({ ...defaultValue });
  const [thumbnailSource, setThumbnailSource] = useState<string[]>();
  const [productImagesSource, setProductImagesSource] = useState<string[]>();

  const fields = productInfo.bulletPoints;

  const addMoreBulletPoints = () => {
    setProductInfo({
      ...productInfo,
      bulletPoints: [...productInfo.bulletPoints, ""],
    });
  };

  const removeBulletPoint = (indexToRemove: number) => {
    const points = [...productInfo.bulletPoints];
    const filteredPoints = points.filter((_, index) => index !== indexToRemove);
    setProductInfo({
      ...productInfo,
      bulletPoints: [...filteredPoints],
    });
  };

  const updateBulletPointValue = (value: string, index: number) => {
    const oldValues = [...fields];
    oldValues[index] = value;

    setProductInfo({ ...productInfo, bulletPoints: [...oldValues] });
  };

  const removeImage = async (index: number) => {
    const newImages = images.filter((_, idx) => idx !== index);
    setImages([...newImages]);
  };

  const getBtnTitle = () => {
    if (isForUpdate) return isPending ? "Updating" : "Update";
    return isPending ? "Creating" : "Create";
  };

  useEffect(() => {
    if (initialValue) {
      setProductInfo({ ...initialValue });
      setThumbnailSource([initialValue.thumbnail]);
      setProductImagesSource(initialValue.images);
      setIsForUpdate(true);
    }
  }, [initialValue]);

  const onImagesChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const files = target.files;
    if (files) {
      const newImages = Array.from(files).map((item) => item);
      const oldImages = productImagesSource || [];
      setImages([...images, ...newImages]);
      setProductImagesSource([
        ...oldImages,
        ...newImages.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const onThumbnailChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const files = target.files;
    if (files) {
      const file = files[0];
      setThumbnail(file);
      setThumbnailSource([URL.createObjectURL(file)]);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="mb-2 text-xl">Add new product</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            onSubmit({ ...productInfo, images, thumbnail });
          });
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <h3>Poster</h3>
          <ImageSelector
            id="thumb"
            images={thumbnailSource}
            onChange={onThumbnailChange}
          />

          <h3>Images</h3>
          <ImageSelector
            multiple
            id="images"
            images={productImagesSource}
            onRemove={removeImage}
            onChange={onImagesChange}
          />
        </div>

        <Input
          label="Title"
          value={productInfo.title}
          onChange={({ target }) =>
            setProductInfo({ ...productInfo, title: target.value })
          }
          crossOrigin={undefined}
        />

        <Textarea
          className="h-52"
          label="Description"
          value={productInfo.description}
          onChange={({ target }) =>
            setProductInfo({ ...productInfo, description: target.value })
          }
        />

        <Select
          onChange={(category) => {
            if (category) setProductInfo({ ...productInfo, category });
          }}
          value={productInfo.category}
          label="Select Category"
          placeholder={undefined}
        >
          {categories.map((c) => (
            <Option value={c} key={c}>
              {c}
            </Option>
          ))}
        </Select>

        <div className="flex space-x-4">
          <div className="space-y-4 flex-1">
            <h3>Price</h3>

            <Input
              value={productInfo.mrp}
              label="MRP ($)"
              onChange={({ target }) => {
                const mrp = +target.value;
                setProductInfo({ ...productInfo, mrp });
              }}
              className="mb-4"
              crossOrigin={undefined}
            />
            <Input
              value={productInfo.salePrice}
              label="Sale Price ($)"
              onChange={({ target }) => {
                const salePrice = +target.value;
                setProductInfo({ ...productInfo, salePrice });
              }}
              className="mb-4"
              crossOrigin={undefined}
            />
          </div>

          <div className="space-y-4 flex-1">
            <h3>Stock</h3>

            <Input
              value={productInfo.quantity}
              label="Qty"
              onChange={({ target }) => {
                const quantity = +target.value;
                if (!isNaN(quantity))
                  setProductInfo({ ...productInfo, quantity });
              }}
              className="mb-4"
              crossOrigin={undefined}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3>Bullet points</h3>
          {fields.map((field, index) => (
            <div key={index} className="flex items-center">
              <Input
                type="text"
                value={field}
                label={`Bullet point ${index + 1}`}
                onChange={({ target }) =>
                  updateBulletPointValue(target.value, index)
                }
                className="mb-4"
                crossOrigin={undefined}
              />
              {fields.length > 1 ? (
                <button
                  onClick={() => removeBulletPoint(index)}
                  type="button"
                  className="ml-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              ) : null}
            </div>
          ))}

          <button
            disabled={isPending}
            type="button"
            onClick={addMoreBulletPoints}
            className="flex items-center space-x-1 text-gray-800 ml-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add more</span>
          </button>
        </div>

        <Button disabled={isPending} type="submit" placeholder={undefined}>
          {getBtnTitle()}
        </Button>
      </form>
    </div>
  );
}
