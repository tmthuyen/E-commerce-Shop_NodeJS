import GridProductsBestSellers from "./GridProductsBestSellers"; 
import ProductsSkeleton from "./ProductsSkeleton";

export default function BestSellersProducts({ data }) {
  

  if (!data) return <ProductsSkeleton count={8} />;
  return (
    <GridProductsBestSellers products={data} rows={1} gap={2} />
  );
}
  