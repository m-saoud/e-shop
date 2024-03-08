import Image from "next/image";
import startDb from "../lib/db";
import ProductModel from "../models/prodctModel";
import GridView from "../components/GridView";
import ProductCard from "../components/ProductCard";

const fetchLatestProducts = async () => {
  await startDb();
  const proudacts = ProductModel.find().sort("-createdAt").limit(20);
  return (await proudacts).map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail.url,
      price: product.price,
      sale:product.sale
    };
  });
};
export default async function Home() {
  const latestProduct = await fetchLatestProducts();
  return (
    <GridView>
      {latestProduct.map((product) => {
        // eslint-disable-next-line react/jsx-key
        return <ProductCard product={product} />;
      })}
    </GridView>
  );
}
