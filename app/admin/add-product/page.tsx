"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { products as initialProducts } from "@/lib/products";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { Product } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !image || !category) {
      toast.error("Please fill out all fields and upload an image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newProduct: Omit<Product, 'id' | 'rating' | 'reviews' | 'sizes' | 'colors' | 'features' | 'images' | 'inStock'> & { id: string; image: string; isNew: boolean; isFeatured: boolean; rating: { rate: number; count: number }; } = {
        id: uuidv4(),
        name,
        description,
        price: parseFloat(price),
        image: reader.result as string,
        category,
        isNew: true,
        isFeatured,
        rating: { rate: 0, count: 0 },
      };

      const storedProducts = localStorage.getItem("products");
      const allProducts = storedProducts
        ? JSON.parse(storedProducts)
        : initialProducts;
      const updatedProducts = [...allProducts, newProduct];
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      toast.success("Product added successfully!");
      router.push("/admin/dashboard");
    };
    reader.readAsDataURL(image);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-7 hide-arrows"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image">Product Image</Label>
                    <Input
                      id="image"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFeatured"
                      checked={isFeatured}
                      onCheckedChange={(checked) => setIsFeatured(Boolean(checked))}
                    />
                    <Label htmlFor="isFeatured">Mark as Featured</Label>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
