import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';

export default function Editorial() {
  return (
    <section className="bg-charcoal text-parchment">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-square lg:aspect-auto lg:h-[800px] w-full order-1 lg:order-none">
          <SafeImage
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop"
            alt="Crafted with Intention"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        
        <div className="flex flex-col justify-center px-8 py-20 lg:px-20 xl:px-32 order-2 lg:order-none">
          <p className="text-gold tracking-widest uppercase text-sm mb-6">Our Philosophy</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
            Crafted with Intention
          </h2>
          
          <div className="space-y-6 text-parchment/80 text-lg leading-relaxed mb-12">
            <p>
              At MAISON NOIRE, we believe that true luxury lies in the details. Every piece we create is born from a commitment to timeless design, exceptional craftsmanship, and uncompromising quality.
            </p>
            <p>
              Our collections are designed to transcend seasonal trends, offering a wardrobe of essential pieces that evolve with you. We partner with heritage mills and expert artisans who share our dedication to sustainable practices and mindful production.
            </p>
          </div>
          
          <div>
            <Link 
              href="/about" 
              className="inline-block border-b border-gold text-gold pb-1 uppercase tracking-widest text-sm hover:text-parchment hover:border-parchment transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
