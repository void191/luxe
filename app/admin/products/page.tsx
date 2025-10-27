"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock products data
const products = [
  {
    id: "1",
    name: "Cashmere Blend Sweater",
    price: 189.99,
    stock: 45,
    category: "Women",
    image: "/luxury-cashmere-sweater.png",
    status: "Active",
  },
  {
    id: "2",
    name: "Italian Leather Handbag",
    price: 449.99,
    stock: 23,
    category: "Accessories",
    image: "/luxury-leather-handbag.jpg",
    status: "Active",
  },
  {
    id: "3",
    name: "Tailored Wool Blazer",
    price: 329.99,
    stock: 12,
    category: "Men",
    image: "/luxury-wool-blazer.png",
    status: "Active",
  },
  {
    id: "4",
    name: "Silk Scarf Collection",
    price: 89.99,
    stock: 67,
    category: "Accessories",
    image: "/luxury-silk-scarf.png",
    status: "Active",
  },
  {
    id: "5",
    name: "Merino Wool Cardigan",
    price: 159.99,
    stock: 0,
    category: "Women",
    image: "/luxury-wool-cardigan.jpg",
    status: "Out of Stock",
  },
]

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Products</h1>
                <p className="text-muted-foreground">Manage your product inventory</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Price</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Stock</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                          <td className="py-3 px-4 font-semibold">${product.price.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={product.stock === 0 ? "text-destructive font-medium" : "text-muted-foreground"}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                product.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
