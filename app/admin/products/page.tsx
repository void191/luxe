"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getToken } from "@/lib/auth"
import { toast } from "react-hot-toast"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: string
  images: string[]
  in_stock: boolean
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        toast.error("Failed to load products")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Error loading products")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const token = getToken()
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Product deleted successfully")
        fetchProducts()
      } else {
        toast.error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Error deleting product")
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminAuthGuard>
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
              <Button asChild>
                <Link href="/admin/add-product">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Link>
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
                  {loading ? (
                    <p className="text-center py-8 text-muted-foreground">Loading products...</p>
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No products found</p>
                  ) : (
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
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {product.images && product.images.length > 0 && (
                                  <div className="relative w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                            <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                            <td className="py-3 px-4">{product.stock}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.in_stock
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {product.in_stock ? "In Stock" : "Out of Stock"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <Link href={`/admin/edit-product/${product.id}`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      </div>
    </AdminAuthGuard>
  )
}
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
                                  product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                              >
                                {product.stock > 0 ? "Active" : "Out of Stock"}
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    </AdminAuthGuard>
  )
}
