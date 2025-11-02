"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"

// Mock data - will be replaced with real data later
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
}

const mockProducts = [
  {
    id: "1",
    name: "Cashmere Blend Sweater",
    price: 189.99,
    originalPrice: 249.99,
    image: "/luxury-cashmere-sweater.png",
    category: "Women",
  },
  {
    id: "2",
    name: "Italian Leather Handbag",
    price: 449.99,
    image: "/luxury-leather-handbag.jpg",
    category: "Accessories",
    isNew: true,
  },
  {
    id: "3",
    name: "Tailored Wool Blazer",
    price: 329.99,
    image: "/luxury-wool-blazer.png",
    category: "Men",
    isNew: true,
  },
  {
    id: "4",
    name: "Silk Scarf Collection",
    price: 89.99,
    originalPrice: 129.99,
    image: "/luxury-silk-scarf.png",
    category: "Accessories",
  },
  {
    id: "5",
    name: "Merino Wool Cardigan",
    price: 159.99,
    image: "/luxury-wool-cardigan.jpg",
    category: "Women",
    isNew: true,
  },
  {
    id: "6",
    name: "Leather Oxford Shoes",
    price: 279.99,
    originalPrice: 349.99,
    image: "/luxury-oxford-shoes.jpg",
    category: "Men",
  },
  {
    id: "7",
    name: "Designer Sunglasses",
    price: 199.99,
    image: "/luxury-sunglasses.png",
    category: "Accessories",
  },
  {
    id: "8",
    name: "Cashmere Coat",
    price: 599.99,
    image: "/luxury-cashmere-coat.png",
    category: "Women",
    isNew: true,
  },
]

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [slug, setSlug] = useState<string>("")
  const [displayedProducts, setDisplayedProducts] = useState(mockProducts)
  const [loadMoreCount, setLoadMoreCount] = useState(0)

  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  if (!slug) {
    return null
  }

  const category = categoryData[slug]

  if (!category) {
    notFound()
  }

  const handleLoadMore = () => {
    // Simulate loading more products
    const moreProducts = mockProducts.map((p, i) => ({
      ...p,
      id: `${p.id}-${loadMoreCount}-${i}`,
    }))
    setDisplayedProducts([...displayedProducts, ...moreProducts])
    setLoadMoreCount(loadMoreCount + 1)
    alert("Loading more products...")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Category Header */}
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{category.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{category.description}</p>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-sm text-muted-foreground">Showing {displayedProducts.length} products</p>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" onClick={handleLoadMore}>
                Load More Products
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
