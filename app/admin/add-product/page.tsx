"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminAuthGuard } from "@/components/admin-auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { getToken } from "@/lib/auth";

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState("");
  const [sizes, setSizes] = useState("");
  const [features, setFeatures] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !category) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const token = getToken();
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          original_price: originalPrice ? parseFloat(originalPrice) : null,
          stock: parseInt(stock) || 0,
          category,
          images: images.split(",").map(img => img.trim()).filter(Boolean),
          sizes: sizes.split(",").map(s => s.trim()).filter(Boolean),
          features: features.split(",").map(f => f.trim()).filter(Boolean),
          colors: [],
          is_featured: isFeatured,
          is_new: isNew,
        }),
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        router.push("/admin/products");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 bg-muted/30 p-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Original Price</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stock">Stock Quantity *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Input
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="mt-1"
                          placeholder="e.g., Women, Men, Accessories"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="images">Image URLs (comma-separated)</Label>
                      <Input
                        id="images"
                        value={images}
                        onChange={(e) => setImages(e.target.value)}
                        className="mt-1"
                        placeholder="/image1.jpg, /image2.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                      <Input
                        id="sizes"
                        value={sizes}
                        onChange={(e) => setSizes(e.target.value)}
                        className="mt-1"
                        placeholder="XS, S, M, L, XL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="features">Features (comma-separated)</Label>
                      <Textarea
                        id="features"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        className="mt-1"
                        placeholder="Premium quality, Handcrafted, Limited edition"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isFeatured"
                          checked={isFeatured}
                          onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                        />
                        <Label htmlFor="isFeatured">Featured Product</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isNew"
                          checked={isNew}
                          onCheckedChange={(checked) => setIsNew(checked as boolean)}
                        />
                        <Label htmlFor="isNew">New Arrival</Label>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Adding..." : "Add Product"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/products")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
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
                    <Label htmlFor="originalPrice">Original Price (optional)</Label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$
                      </span>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
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
