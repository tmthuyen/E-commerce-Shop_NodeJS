import GridProductsHomePage from './GridProductsHomePage';
import ProductsSkeleton from './ProductsSkeleton'; 

export default function NewProducts({ data }) { 
  if (!data) return <ProductsSkeleton count={8} />;
  return <GridProductsHomePage products={data} rows={1} gap={2} />;
}
