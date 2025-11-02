"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Heart, MapPin, CreditCard, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock order data
const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 639.98,
    items: [
      { name: "Cashmere Blend Sweater", image: "/luxury-cashmere-sweater.png", quantity: 1 },
      { name: "Italian Leather Handbag", image: "/luxury-leather-handbag.jpg", quantity: 1 },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-20",
    status: "In Transit",
    total: 329.99,
    items: [{ name: "Tailored Wool Blazer", image: "/luxury-wool-blazer.png", quantity: 1 }],
  },
]

const wishlistItems = [
  {
    id: "3",
    name: "Tailored Wool Blazer",
    price: 329.99,
    image: "/luxury-wool-blazer.png",
    category: "Men",
  },
  {
    id: "7",
    name: "Designer Sunglasses",
    price: 199.99,
    image: "/luxury-sunglasses.png",
    category: "Accessories",
  },
]

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">My Account</h1>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payment</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">Order {order.id}</CardTitle>
                        <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="font-semibold">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => alert(`Viewing details for order ${order.id}`)}>
                        View Details
                      </Button>
                      {order.status === "Delivered" && (
                        <Button variant="outline" size="sm" onClick={() => alert("Items from this order added to cart!")}>
                          Buy Again
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="group overflow-hidden">
                    <Link href={`/product/${item.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{item.category}</p>
                      <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.name}</h3>
                      <p className="font-semibold mb-3">${item.price.toFixed(2)}</p>
                      <Button size="sm" className="w-full" onClick={() => alert(`${item.name} added to cart!`)}>
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">123 Main Street, Apt 4B</p>
                    <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                    <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => alert("Edit address functionality coming soon!")}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => alert("Address removed successfully!")}>
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Button onClick={() => alert("Add new address form coming soon!")}>Add New Address</Button>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No saved payment methods</p>
                  <Button className="mt-4" onClick={() => alert("Add payment method form coming soon!")}>Add Payment Method</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profileFirstName">First Name</Label>
                      <Input id="profileFirstName" defaultValue="John" />
                    </div>
                    <div>
                      <Label htmlFor="profileLastName">Last Name</Label>
                      <Input id="profileLastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="profileEmail">Email</Label>
                    <Input id="profileEmail" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="profilePhone">Phone</Label>
                    <Input id="profilePhone" type="tel" defaultValue="(555) 123-4567" />
                  </div>
                  <Button onClick={() => alert("Profile changes saved successfully!")}>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
