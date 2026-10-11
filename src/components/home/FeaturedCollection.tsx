'use client';

import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import { getFeaturedProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';

export default function FeaturedCollection() {
  const products = getFeaturedProducts().slice(0, 4);

  return (
    <section className="py-24 px-6 lg:px-12 bg-cream text-noir">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <h2 className="font-serif text-4xl md:text-5xl">Curated for You</h2>
          <Link href="/shop" className="text-stone hover:text-noir transition-colors uppercase tracking-widest text-sm mt-4 md:mt-0 underline underline-offset-4">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 auto-rows-[auto]">
          {/* Main large product */}
          {products[0] && (
            <div className="md:col-span-7 md:row-span-2 group">
              <Link href={`/shop/${products[0].slug}`} className="block relative aspect-[3/4] md:aspect-auto md:h-full w-full overflow-hidden mb-4">
                <SafeImage
                  src={products[0].images[0]?.src || ''}
                  alt={products[0].name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </Link>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium">{products[0].name}</h3>
                  <p className="text-stone mt-1">{formatPrice(products[0].price)}</p>
                </div>
                <Link href={`/shop/${products[0].slug}`} className="text-sm tracking-wider uppercase border-b border-noir pb-1 hover:text-stone hover:border-stone transition-colors">
                  Shop Now
                </Link>
              </div>
            </div>
          )}

          {/* Secondary products */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-8">
            {products.slice(1, 4).map((product, index) => (
              <div key={product.id} className="group flex flex-col">
                <Link href={`/shop/${product.slug}`} className="block relative aspect-[3/4] w-full overflow-hidden mb-4">
                  <SafeImage
                    src={product.images[0]?.src || ''}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 40vw"
                  />
                </Link>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg">{product.name}</h3>
                    <p className="text-stone text-sm mt-1">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
