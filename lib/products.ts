import { Product } from "./types";

let productsData: Product[] = [
  {
    id: "1",
    name: "Cashmere Blend Sweater",
    price: 189.99,
    originalPrice: 249.99,
    description:
      "Experience unparalleled luxury with our premium cashmere blend sweater. Crafted from the finest materials, this piece combines exceptional softness with timeless elegance.",
    category: "Women",
    images: [
      "/luxury-cashmere-sweater.png",
      "/luxury-wool-cardigan.jpg",
      "/luxury-cashmere-coat.png",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Ivory", value: "#F5F5DC" },
      { name: "Charcoal", value: "#36454F" },
      { name: "Camel", value: "#C19A6B" },
    ],
    rating: 4.8,
    reviews: 0,
    inStock: true,
    features: [
      "Premium cashmere blend",
      "Ribbed crew neck",
      "Long sleeves with ribbed cuffs",
      "Relaxed fit",
      "Dry clean only",
    ],
    image: "/luxury-cashmere-sweater.png",
  },
  {
    id: "2",
    name: "Italian Leather Handbag",
    price: 449.99,
    description: "A timeless handbag crafted from the finest Italian leather.",
    category: "Accessories",
    images: ["/luxury-leather-handbag.jpg"],
    sizes: ["One Size"],
    colors: [{ name: "Black", value: "#000000" }],
    rating: 4.9,
    reviews: 0,
    inStock: true,
    features: ["Genuine Italian leather", "Gold-tone hardware"],
    isNew: true,
    image: "/luxury-leather-handbag.jpg",
  },
  {
    id: "3",
    name: "Tailored Wool Blazer",
    price: 329.99,
    description: "A perfectly tailored blazer made from premium wool.",
    category: "Men",
    images: ["/luxury-wool-blazer.png"],
    sizes: ["38R", "40R", "42R", "44R"],
    colors: [{ name: "Navy", value: "#000080" }],
    rating: 4.7,
    reviews: 0,
    inStock: true,
    features: ["100% premium wool", "Notched lapels"],
    isNew: true,
    image: "/luxury-wool-blazer.png",
  },
  {
    id: "4",
    name: "Silk Scarf Collection",
    price: 89.99,
    originalPrice: 129.99,
    description: "A beautiful scarf made from pure silk.",
    category: "Accessories",
    images: ["/luxury-silk-scarf.png"],
    sizes: ["One Size"],
    colors: [{ name: "Floral", value: "#FFFFFF" }],
    rating: 4.6,
    reviews: 0,
    inStock: true,
    features: ["100% pure silk", "Hand-rolled edges"],
    image: "/luxury-silk-scarf.png",
  },
  {
    id: "5",
    name: "Merino Wool Cardigan",
    price: 159.99,
    description: "A cozy and stylish cardigan made from soft merino wool.",
    category: "Women",
    images: ["/luxury-wool-cardigan.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Grey", value: "#808080" }],
    rating: 4.8,
    reviews: 0,
    inStock: true,
    features: ["100% merino wool", "Button-front closure"],
    isNew: true,
    image: "/luxury-wool-cardigan.jpg",
  },
];

if (typeof window !== "undefined") {
  const storedProducts = localStorage.getItem("products");
  if (storedProducts) {
    productsData = JSON.parse(storedProducts);
  }
}

export const products: Product[] = productsData;
