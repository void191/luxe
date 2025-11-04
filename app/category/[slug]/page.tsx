"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products as initialProducts } from "@/lib/products";
import { Product } from "@/lib/types";

const categoryData: Record<string, { name: string; description: string }> = {
  "new-arrivals": {
    name: "New Arrivals",
    description: "Discover the latest additions to our collection",
  },
  women: {
    name: "Women's Collection",
    description: "Elegant and sophisticated pieces for the modern woman",
  },
  men: {
    name: "Men's Collection",
    description: "Refined style and timeless craftsmanship",
  },
  accessories: {
    name: "Accessories",
    description: "The perfect finishing touches to complete your look",
  },
  sale: {
    name: "Sale",
    description: "Premium pieces at exceptional prices",
  },
  featured: {
    name: "Featured",
    description: "Our most popular and highly recommended pieces",
  },
};

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const categoryInfo = categoryData[slug];

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    const products = storedProducts
      ? JSON.parse(storedProducts)
      : initialProducts;
    setAllProducts(products);

    const uniqueCategories = [
      ...new Set(products.map((p: Product) => p.category)),
    ];
    setCategories(uniqueCategories as string[]);
    // If the route requested a specific category (e.g. "women" or "featured"),
    // set that as the selected category. Otherwise default to "all" so
    // the select shows "All Categories" visibly.
    if (slug) {
      setSelectedCategory(slug);
    } else {
      setSelectedCategory("all");
    }
  }, []);

  useEffect(() => {
    let productsToDisplay;

    if (selectedCategory === "featured") {
      productsToDisplay = allProducts.filter((p) => p.isFeatured);
    } else {
      productsToDisplay =
        selectedCategory === "all"
          ? allProducts
          : allProducts.filter(
              (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
            );
    }

    let sortedProducts = [...productsToDisplay];
    switch (sortOption) {
      case "price-low":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // This assumes newer products are added later.
        // A more robust solution would use a creation timestamp.
        sortedProducts.reverse();
        break;
      default:
        break;
    }
    setDisplayedProducts(sortedProducts);
  }, [selectedCategory, sortOption, allProducts]);

  if (!categoryInfo && slug !== 'all') {
    notFound();
  }

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  
  const currentCategory = categoryData[selectedCategory] || { name: "All Products", description: "Browse all our collections." };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {currentCategory.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {currentCategory.description}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-sm text-muted-foreground">
                Showing {displayedProducts.length} products
              </p>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[180px]">
                    {/* Compute a friendly label from the selected value so the select
                        always displays something user-friendly (e.g. "All Categories"). */}
                    <SelectValue>
                      {(() => {
                        if (selectedCategory === "all") return "All Categories";
                        if (selectedCategory === "featured") return "Featured";
                        // find original-cased category name
                        const found = categories.find((c) => c.toLowerCase() === selectedCategory);
                        if (found) return found;
                        // fallback: capitalize the slug
                        return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
