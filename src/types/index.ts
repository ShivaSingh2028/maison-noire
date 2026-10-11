export interface ProductVariant {
  type: 'size' | 'color';
  label: string;
  value: string;
  available: boolean;
}

export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  details: string[];
  care: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  material?: string;
  fit?: string;
  sizes?: string[];
  colors?: string[];
  inventory?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
  name: string;
  price: number;
  image: string;
  slug?: string;
  size?: string;
  color?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  minPrice?: number;
  maxPrice?: number;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  sort: SortOption;
}
