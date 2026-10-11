import { Product, FilterState, SortOption } from '../types';

export const products: Product[] = [
  // Coats & Outerwear
  {
    id: 'prod-001',
    name: 'Oversized Wool Trench',
    slug: 'oversized-wool-trench',
    category: 'Coats & Outerwear',
    subcategory: 'Coats',
    price: 1250,
    currency: 'USD',
    description: 'A masterclass in modern tailoring, this oversized trench coat is crafted from heavyweight Italian virgin wool. The structured silhouette is softened by dropped shoulders and fluid drape, making it the definitive layering piece for transitional weather.',
    details: [
      'Double-breasted front closure',
      'Oversized architectural fit',
      'Exaggerated notched lapels',
      'Removable tonal tie belt',
      'Deep welt storm pockets'
    ],
    care: [
      'Dry clean only by luxury specialist',
      'Do not bleach or tumble dry',
      'Cool iron with pressing cloth'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop&q=85', alt: 'Oversized Wool Trench Front View', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop&q=85', alt: 'Oversized Wool Trench Editorial View', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'XS', value: 'xs', available: true },
      { type: 'size', label: 'S', value: 's', available: true },
      { type: 'size', label: 'M', value: 'm', available: true },
      { type: 'size', label: 'L', value: 'l', available: false },
      { type: 'color', label: 'Noir', value: 'noir', available: true },
      { type: 'color', label: 'Parchment', value: 'parchment', available: true }
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    material: '100% Virgin Wool, Cupro lining',
    fit: 'Oversized. We recommend taking your true size for the intended runway silhouette.'
  },
  {
    id: 'prod-002',
    name: 'Cashmere Wrap Coat',
    slug: 'cashmere-wrap-coat',
    category: 'Coats & Outerwear',
    subcategory: 'Coats',
    price: 2450,
    currency: 'USD',
    description: 'Unapologetic luxury defined in pure Mongolian double-faced cashmere. This wrap coat features an enveloping shawl collar and a self-tie belt that cinches the waist for an effortlessly elegant, statuesque profile.',
    details: [
      'Sculpted shawl collar',
      'Fluid wrap silhouette',
      'Double-faced hand-finished seams',
      'Discrete side seam pockets'
    ],
    care: [
      'Specialist dry clean only',
      'Store on wide padded hanger in breathable garment bag'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=1000&fit=crop&q=85', alt: 'Cashmere Wrap Coat Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=1000&fit=crop&q=85', alt: 'Cashmere Wrap Coat Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'S', value: 's', available: true },
      { type: 'size', label: 'M', value: 'm', available: true },
      { type: 'size', label: 'L', value: 'l', available: true },
      { type: 'color', label: 'Stone', value: 'stone', available: true },
      { type: 'color', label: 'Parchment', value: 'parchment', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    material: '100% Grade-A Mongolian Cashmere',
    fit: 'Relaxed draped fit.'
  },
  {
    id: 'prod-003',
    name: 'Structured Leather Blazer',
    slug: 'structured-leather-blazer',
    category: 'Coats & Outerwear',
    subcategory: 'Jackets',
    price: 1850,
    originalPrice: 2100,
    currency: 'USD',
    description: 'A sharp, structured blazer rendered in buttery Italian lambskin leather. The precision tailoring offers a commanding silhouette, complete with accented shoulders, notched lapels, and a subtly nipped waist.',
    details: [
      'Hand-crafted horn button fastening',
      'Padded architectural shoulders',
      'Interior welt chest pocket',
      'Full silk lining'
    ],
    care: [
      'Professional leather specialist clean only'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&h=1000&fit=crop&q=85', alt: 'Structured Leather Blazer Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&h=1000&fit=crop&q=80', alt: 'Structured Leather Blazer Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'XS', value: 'xs', available: true },
      { type: 'size', label: 'S', value: 's', available: true },
      { type: 'size', label: 'M', value: 'm', available: true },
      { type: 'color', label: 'Charcoal', value: 'charcoal', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    material: '100% French Lambskin Leather',
    fit: 'Tailored architectural fit.'
  },
  
  // Dresses
  {
    id: 'prod-004',
    name: 'Silk Bias Slip Dress',
    slug: 'silk-bias-slip-dress',
    category: 'Dresses',
    subcategory: 'Evening',
    price: 795,
    currency: 'USD',
    description: 'An exploration of liquid elegance. Cut on the bias from heavyweight 22-momme silk charmeuse, this slip dress skims the body and cascades to a delicate ankle-grazing hem. Features micro-rouleau straps and a soft cowl neckline.',
    details: [
      'True bias cut for natural liquid drape',
      'Delicate cowl neckline',
      'Micro-rouleau adjustable straps',
      'French seam interior finishing'
    ],
    care: [
      'Dry clean only'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop&q=85', alt: 'Silk Bias Slip Dress Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&q=85', alt: 'Silk Bias Slip Dress Editorial View', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'XS', value: 'xs', available: true },
      { type: 'size', label: 'S', value: 's', available: true },
      { type: 'size', label: 'M', value: 'm', available: true },
      { type: 'size', label: 'L', value: 'l', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true },
      { type: 'color', label: 'Stone', value: 'stone', available: true }
    ],
    inStock: true,
    isNew: true,
    isFeatured: false,
    material: '100% Mulberry Silk Charmeuse',
    fit: 'Fluid bias drape; skims curves effortlessly.'
  },
  {
    id: 'prod-005',
    name: 'Architectural Poplin Midi',
    slug: 'architectural-poplin-midi',
    category: 'Dresses',
    subcategory: 'Day',
    price: 650,
    currency: 'USD',
    description: 'A study in volume and sculpture. Crafted from crisp organic cotton poplin with a subtle papery hand feel, this dress features pleated origami waist structuring that expands into a voluminous pleated midi skirt.',
    details: [
      'Pleated origami waist detail',
      'Voluminous gathered sleeves',
      'Concealed back invisible zip closure',
      'Generous side seam pockets'
    ],
    care: [
      'Gentle cold wash or dry clean',
      'Line dry in shade',
      'Steam or medium iron'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&h=1000&fit=crop&q=85', alt: 'Architectural Poplin Midi Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&h=1000&fit=crop&q=85', alt: 'Architectural Poplin Midi Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'S', value: 's', available: true },
      { type: 'size', label: 'M', value: 'm', available: true },
      { type: 'size', label: 'L', value: 'l', available: false },
      { type: 'color', label: 'White', value: 'white', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    material: '100% GOTS Certified Organic Cotton Poplin',
    fit: 'Fitted through waist, relaxed voluminous skirt.'
  },
  {
    id: 'prod-006',
    name: 'Draped Jersey Gown',
    slug: 'draped-jersey-gown',
    category: 'Dresses',
    subcategory: 'Evening',
    price: 950,
    originalPrice: 1200,
    currency: 'USD',
    description: 'Statuesque modernism. Expertly gathered and draped fluid matte jersey embraces the body before tapering into an elongated column profile with a dramatic side split.',
    details: [
      'Asymmetric gather at hip',
      'High jewel neckline',
      'Thigh-high side split',
      'Built-in inner corset support'
    ],
    care: [
      'Dry clean only'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&q=85', alt: 'Draped Jersey Gown Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&q=80', alt: 'Draped Jersey Gown Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'XS', value: 'xs', available: true },
      { type: 'size', label: 'S', value: 's', available: true },
      { type: 'size', label: 'M', value: 'm', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    material: '94% Viscose, 6% Elastane',
    fit: 'Body-contouring fit.'
  },

  // Knitwear
  {
    id: 'prod-007',
    name: 'Chunky Alpaca Turtleneck',
    slug: 'chunky-alpaca-turtleneck',
    category: 'Knitwear',
    subcategory: 'Sweaters',
    price: 595,
    currency: 'USD',
    description: 'Embrace tactile warmth with this chunky turtleneck sweater. Spun from plush royal baby alpaca blend yarns with ribbed cuffs, dropped shoulders, and a generous folded roll neck.',
    details: [
      'High sculptural turtleneck',
      'Dropped shoulder seam',
      'Chunky fisherman stitch',
      'Heavyweight ribbed hem and cuffs'
    ],
    care: [
      'Hand wash cold with wool detergent',
      'Dry flat on towel; do not hang'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=85', alt: 'Chunky Alpaca Turtleneck Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=80', alt: 'Chunky Alpaca Turtleneck Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'S', value: 's', available: true },
      { type: 'size', label: 'M', value: 'm', available: true },
      { type: 'size', label: 'L', value: 'l', available: true },
      { type: 'color', label: 'Parchment', value: 'parchment', available: true },
      { type: 'color', label: 'Stone', value: 'stone', available: true }
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    material: '70% Royal Baby Alpaca, 30% Fine Merino',
    fit: 'Generously oversized silhouette.'
  },
  {
    id: 'prod-008',
    name: 'Fine Gauge Cashmere Crew',
    slug: 'fine-gauge-cashmere-crew',
    category: 'Knitwear',
    subcategory: 'Sweaters',
    price: 450,
    currency: 'USD',
    description: 'The foundational wardrobe staple, perfected. Spun from fine 18-gauge 2-ply cashmere offering weightless warmth, a whisper-soft touch, and seamless layering under sharp tailoring.',
    details: [
      'Classic tubular crew neck',
      'Fully fashioned raglan seams',
      'Ribbed trim details',
      'Anti-pilling treatment'
    ],
    care: [
      'Hand wash cold or gentle dry clean'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop&q=85', alt: 'Fine Gauge Cashmere Crew Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop&q=80', alt: 'Fine Gauge Cashmere Crew Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'XS', value: 'xs', available: true },
      { type: 'size', label: 'S', value: 's', available: true },
      { type: 'size', label: 'M', value: 'm', available: true },
      { type: 'size', label: 'L', value: 'l', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true },
      { type: 'color', label: 'Stone', value: 'stone', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    material: '100% Inner Mongolian Cashmere',
    fit: 'Classic tailored fit.'
  },
  {
    id: 'prod-009',
    name: 'Ribbed Merino Cardigan',
    slug: 'ribbed-merino-cardigan',
    category: 'Knitwear',
    subcategory: 'Cardigans',
    price: 385,
    currency: 'USD',
    description: 'Refined tactile texture in extra-fine merino wool. Designed with a deep V-neckline, textural directional ribbing, and real horn buttons.',
    details: [
      'V-neckline silhouette',
      'Genuine buffalo horn buttons',
      'Elongated foldover cuffs',
      'Split side hems'
    ],
    care: [
      'Hand wash cold or dry clean'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop&q=85', alt: 'Ribbed Merino Cardigan Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=85', alt: 'Ribbed Merino Cardigan Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'S', value: 's', available: true },
      { type: 'size', label: 'M', value: 'm', available: true },
      { type: 'size', label: 'L', value: 'l', available: true },
      { type: 'color', label: 'Antique Gold', value: 'antique-gold', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    material: '100% Extra Fine Merino Wool',
    fit: 'Straight relaxed cut.'
  },

  // Accessories
  {
    id: 'prod-010',
    name: 'Sculptural Leather Tote',
    slug: 'sculptural-leather-tote',
    category: 'Accessories',
    subcategory: 'Bags',
    price: 895,
    currency: 'USD',
    description: 'An exercise in minimalist architecture. This structured tote bag is handcrafted from smooth Italian box calfskin with a distinctive curved base and clean, hardware-free exterior.',
    details: [
      'Magnetic hidden closure',
      'Interior zippered pocket and card slot',
      'Supple microfiber suede lining',
      'Reinforced rolled top handles'
    ],
    care: [
      'Wipe with clean dry microfiber cloth',
      'Store in dust bag with stuffing to maintain shape'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop&q=85', alt: 'Sculptural Leather Tote Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop&q=80', alt: 'Sculptural Leather Tote Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'One Size', value: 'os', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true },
      { type: 'color', label: 'Stone', value: 'stone', available: true }
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    material: '100% Full-Grain Calfskin Leather',
    fit: 'Dimensions: W 16" x H 13" x D 6"'
  },
  {
    id: 'prod-011',
    name: 'Mini Crossbody Saddle',
    slug: 'mini-crossbody-saddle',
    category: 'Accessories',
    subcategory: 'Bags',
    price: 650,
    currency: 'USD',
    description: 'A compact companion for day-to-night movement. Crafted from textured pebble grain leather, featuring an adjustable cross-body strap and our signature understated foil emblem.',
    details: [
      'Contoured saddle flap with magnetic lock',
      'Adjustable leather shoulder strap',
      'Exterior quick-access slip pocket',
      'Brushed champagne gold-tone accents'
    ],
    care: [
      'Clean with leather lotion as required'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1000&fit=crop&q=85', alt: 'Mini Crossbody Saddle Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=1000&fit=crop&q=85', alt: 'Mini Crossbody Saddle Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'One Size', value: 'os', available: true },
      { type: 'color', label: 'Antique Gold', value: 'antique-gold', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    material: '100% Grained Italian Calf Leather',
    fit: 'Dimensions: W 8.5" x H 6.5" x D 3"'
  },
  {
    id: 'prod-012',
    name: 'Oversized Silk Scarf',
    slug: 'oversized-silk-scarf',
    category: 'Accessories',
    subcategory: 'Scarves',
    price: 245,
    currency: 'USD',
    description: 'Generously proportioned silk twill foulard scarf featuring a delicate, tonal architectural border. Finished by hand with exquisite rolled edges.',
    details: [
      'Hand-rolled and stitched hems',
      'Tonal geometric architectural print',
      'Heavy 18-momme silk twill'
    ],
    care: [
      'Specialist dry clean only'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&q=85', alt: 'Oversized Silk Scarf Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&q=80', alt: 'Oversized Silk Scarf Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'One Size', value: 'os', available: true },
      { type: 'color', label: 'Parchment', value: 'parchment', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    material: '100% Silk Twill',
    fit: 'Dimensions: 36" x 36"'
  },
  {
    id: 'prod-013',
    name: 'Minimalist Obi Belt',
    slug: 'minimalist-obi-belt',
    category: 'Accessories',
    subcategory: 'Belts',
    price: 195,
    currency: 'USD',
    description: 'A contemporary take on traditional waist cinching. Crafted from supple glove nappa leather, wrapping the waist cleanly and fastening with slender knot ties.',
    details: [
      'Continuous wrap design',
      'Slender knot ties',
      'Wide central contouring panel',
      'Clean raw edge construction'
    ],
    care: [
      'Specialist leather care'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=1000&fit=crop&q=85', alt: 'Minimalist Obi Belt Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=1000&fit=crop&q=80', alt: 'Minimalist Obi Belt Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: 'S/M', value: 's-m', available: true },
      { type: 'size', label: 'M/L', value: 'm-l', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true }
    ],
    inStock: true,
    isNew: true,
    isFeatured: false,
    material: '100% Nappa Leather',
    fit: 'Fully adjustable wrap length.'
  },

  // Shoes
  {
    id: 'prod-014',
    name: 'Pointed Toe Leather Boots',
    slug: 'pointed-toe-leather-boots',
    category: 'Shoes',
    subcategory: 'Boots',
    price: 850,
    currency: 'USD',
    description: 'A striking silhouette for modern evening dressing. Featuring an elongated pointed toe, a sculpted 65mm heel, and constructed from polished Italian box calf.',
    details: [
      'Chiseled pointed toe profile',
      'Medial tonal zip closure',
      'Hand-painted leather sole',
      '65mm sculpted kitten heel'
    ],
    care: [
      'Condition with neutral cream; buff with horsehair brush'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop&q=85', alt: 'Pointed Toe Leather Boots Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop&q=80', alt: 'Pointed Toe Leather Boots Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: '36', value: '36', available: true },
      { type: 'size', label: '37', value: '37', available: true },
      { type: 'size', label: '38', value: '38', available: true },
      { type: 'size', label: '39', value: '39', available: true },
      { type: 'size', label: '40', value: '40', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true }
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    material: '100% Box Calfskin, Leather sole with rubber injection',
    fit: 'True to European size.'
  },
  {
    id: 'prod-015',
    name: 'Asymmetric Strappy Sandal',
    slug: 'asymmetric-strappy-sandal',
    category: 'Shoes',
    subcategory: 'Heels',
    price: 695,
    currency: 'USD',
    description: 'Delicate yet definitive negative space. Barely-there tubular leather straps crisscross asymmetrically across the arch, balanced on a slender 85mm stiletto heel.',
    details: [
      'Square open toe silhouette',
      'Ankle buckle closure',
      'Cushioned memory foam insole',
      '85mm leather-wrapped heel'
    ],
    care: [
      'Store in dust bag with tissue protection'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&q=85', alt: 'Asymmetric Strappy Sandal Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&h=1000&fit=crop&q=85', alt: 'Asymmetric Strappy Sandal Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: '36', value: '36', available: true },
      { type: 'size', label: '37', value: '37', available: true },
      { type: 'size', label: '38', value: '38', available: true },
      { type: 'size', label: '39', value: '39', available: true },
      { type: 'size', label: '40', value: '40', available: true },
      { type: 'color', label: 'White', value: 'white', available: true },
      { type: 'color', label: 'Antique Gold', value: 'antique-gold', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    material: '100% Nappa Leather upper, Italian leather sole',
    fit: 'True to European size.'
  },
  {
    id: 'prod-016',
    name: 'Chunky Leather Loafer',
    slug: 'chunky-leather-loafer',
    category: 'Shoes',
    subcategory: 'Flats',
    price: 550,
    originalPrice: 650,
    currency: 'USD',
    description: 'The classic penny loafer, reimagined with architectural proportions. A lightweight lugged rubber platform sole contrasts with glossy brushed leather uppers.',
    details: [
      'Sculpted penny strap bridge',
      'Custom lightweight EVA lug tread sole',
      'Padded leather footbed',
      'Hand-stitched apron toe'
    ],
    care: [
      'Wipe clean with soft damp cloth'
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=1000&fit=crop&q=85', alt: 'Chunky Leather Loafer Front', width: 800, height: 1000 },
      { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop&q=85', alt: 'Chunky Leather Loafer Detail', width: 800, height: 1000 }
    ],
    variants: [
      { type: 'size', label: '36', value: '36', available: true },
      { type: 'size', label: '37', value: '37', available: true },
      { type: 'size', label: '38', value: '38', available: true },
      { type: 'size', label: '39', value: '39', available: true },
      { type: 'size', label: '40', value: '40', available: true },
      { type: 'color', label: 'Noir', value: 'noir', available: true }
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    material: '100% Brushed Calf Leather, Lugged sole',
    fit: 'True to European size.'
  }
];

export const categories = [
  {
    name: 'Coats & Outerwear',
    slug: 'coats-outerwear',
    description: 'Architectural outerwear crafted from premium wools and leathers.',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=1000&fit=crop&q=85'
  },
  {
    name: 'Dresses',
    slug: 'dresses',
    description: 'Fluid silks and structured poplins for day to evening.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop&q=85'
  },
  {
    name: 'Knitwear',
    slug: 'knitwear',
    description: 'Tactile luxury in cashmere, alpaca, and extra-fine merino.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop&q=85'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Sculptural bags and minimalist accoutrements.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop&q=85'
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Striking silhouettes constructed from premium leathers.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop&q=85'
  }
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter(
    (p) =>
      p.category.toLowerCase() === category.toLowerCase() ||
      p.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') === category.toLowerCase() ||
      p.slug === category
  );
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase().trim();
  if (!lowercaseQuery) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery) ||
      p.material?.toLowerCase().includes(lowercaseQuery)
  );
}

export function filterProducts(productsToFilter: Product[], filters: Partial<FilterState>): Product[] {
  return productsToFilter.filter((product) => {
    if (filters.categories && filters.categories.length > 0) {
      const match = filters.categories.some(
        (cat) =>
          cat.toLowerCase() === product.category.toLowerCase() ||
          cat.toLowerCase() === product.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')
      );
      if (!match) return false;
    }
    
    // Support minPrice / maxPrice
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }
    
    // Support priceRange
    if (filters.priceRange) {
      const price = product.price;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    }
    
    // Support case-insensitive size matching
    if (filters.sizes && filters.sizes.length > 0) {
      const productSizes = product.variants
        .filter((v) => v.type === 'size')
        .map((v) => v.label.toUpperCase());
      const hasSize = filters.sizes.some((size) => productSizes.includes(size.toUpperCase()));
      if (!hasSize) return false;
    }
    
    // Support color matching
    if (filters.colors && filters.colors.length > 0) {
      const productColors = product.variants
        .filter((v) => v.type === 'color')
        .map((v) => v.label.toLowerCase());
      const hasColor = filters.colors.some((color) => productColors.includes(color.toLowerCase()));
      if (!hasColor) return false;
    }
    
    if (filters.inStock && !product.inStock) {
      return false;
    }
    
    return true;
  });
}

export function sortProducts(productsToSort: Product[], sort: SortOption): Product[] {
  const sorted = [...productsToSort];
  
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
    case 'featured':
    default:
      return sorted.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
  }
}
