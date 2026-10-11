import { notFound } from 'next/navigation';
import { getProductBySlug, products } from '@/data/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) {
    return { title: 'Product Not Found | MAISON NOIRE' };
  }

  return {
    title: `${product.name} | MAISON NOIRE`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, exclude current, limit to 4)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // If we don't have enough related products from the same category, pad with others
  if (relatedProducts.length < 4) {
    const additional = products
      .filter(p => p.id !== product.id && !relatedProducts.find(rp => rp.id === p.id))
      .slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...additional);
  }

  return (
    <div className="bg-cream min-h-screen pt-24 md:pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24">
          {/* Left Column - Gallery */}
          <div className="w-full lg:w-[60%]">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="w-full lg:w-[40%]">
            <div className="sticky top-32">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
