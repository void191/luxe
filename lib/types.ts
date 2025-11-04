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
