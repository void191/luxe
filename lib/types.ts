export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: { name: string; value: string }[];
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  isNew?: boolean;
  image?: string;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
}

export type PromoType = "percentage" | "fixed";

export interface PromoCode {
  code: string; // alphanumeric promo code
  type: PromoType;
  value: number; // percentage (0-100) or fixed amount in dollars
  usageLimit?: number | null; // total uses allowed
  uses?: number; // times used so far
  perCustomer?: boolean; // whether limited to one per customer
  expiresAt?: string | null; // ISO date string
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  text: string;
  author: string;
  date: string;
}
