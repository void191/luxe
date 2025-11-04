"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/lib/hooks/use-wishlist";

import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  if (!product) {
    return null;
  }
  const { id, name, price, originalPrice, image, category, isNew } = product;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(id);
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-shadow">
      <Link href={`/product/${id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isNew && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
              New
            </span>
          )}
          {discount > 0 && !isNew && (
            <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                wishlisted ? "fill-current text-red-500" : ""
              }`}
            />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${id}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {category}
          </p>
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
