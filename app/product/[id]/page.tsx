"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Minus, Plus, ShoppingBag, Star, Truck, RefreshCw, Shield } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/lib/hooks/use-cart"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import toast from "react-hot-toast"
import { products } from "@/lib/products"
import { notFound } from "next/navigation"

export default function ProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const product = products.find((p) => p.id === resolvedParams.id)

  if (!product) {
    notFound()
  }

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const wishlisted = isInWishlist(product.id)

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart")
      return
    }
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor.name,
      },
      quantity
    )
    toast.success("Added to cart!")
  }

  const handleWishlistToggle = () => {
    toggleWishlist(product.id)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
    
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/category/${product.category.toLowerCase()}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Details */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-semibold px-4 py-2 rounded-full">
                    -{discount}%
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                    title={`View image ${index + 1}`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">{product.category}</p>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Color: <span className="font-normal text-muted-foreground">{selectedColor.name}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor.name === color.name
                          ? "border-primary scale-110"
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{ backgroundColor: color.value }}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">Size</label>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border rounded-md font-medium transition-colors ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {product.inStock ? (
                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-sm text-destructive font-medium">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!selectedSize || !product.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      wishlisted ? "fill-current text-red-500" : ""
                    }`}
                  />
                  <span className="sr-only">Toggle wishlist</span>
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">100% secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-muted-foreground">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <p className="text-muted-foreground">Customer reviews will be displayed here.</p>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                <p className="text-muted-foreground mb-4">
                  We offer free standard shipping on all orders over $100. Orders are typically processed within 1-2
                  business days.
                </p>
                <h3 className="text-xl font-semibold mb-4">Returns Policy</h3>
                <p className="text-muted-foreground">
                  We accept returns within 30 days of purchase. Items must be unworn and in original condition with tags
                  attached.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Related Products */}
        <section className="container mx-auto px-4 py-12 border-t">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
