"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { products as initialProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    const allProducts: Product[] = storedProducts
      ? JSON.parse(storedProducts)
      : initialProducts;
    const productToEdit = allProducts.find((p) => p.id === id);

    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price.toString());
      setCategory(productToEdit.category);
      setImage(productToEdit.image || null);
      setIsFeatured(productToEdit.isFeatured || false);
    } else {
      toast.error("Product not found!");
      router.push("/admin/dashboard");
    }
  }, [id, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !category) {
      toast.error("Please fill out all fields.");
      return;
    }

    const storedProducts = localStorage.getItem("products");
    const allProducts: Product[] = storedProducts
      ? JSON.parse(storedProducts)
      : initialProducts;

    const updatedProducts = allProducts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          name,
          description,
          price: parseFloat(price),
          category,
          image,
          isFeatured,
        };
      }
      return p;
    });

    localStorage.setItem("products", JSON.stringify(updatedProducts));
    toast.success("Product updated successfully!");
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Edit Product</CardTitle>
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
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  {image && (
                    <div>
                      <Label>Current Image</Label>
                      <img src={image} alt={name} className="mt-2 rounded-md max-h-48" />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFeatured"
                      checked={isFeatured}
                      onCheckedChange={(checked) => setIsFeatured(Boolean(checked))}
                    />
                    <Label htmlFor="isFeatured">Mark as Featured</Label>
                  </div>
                  <Button type="submit" className="w-full">
                    Update Product
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
