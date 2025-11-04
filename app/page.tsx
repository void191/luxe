import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"

// Mock data - will be replaced with real data later
const featuredProducts = [
  {
    id: "1",
    name: "Cashmere Blend Sweater",
    price: 189.99,
    originalPrice: 249.99,
    image: "/luxury-cashmere-sweater.png",
    category: "Women",
    isNew: false,
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
    isNew: false,
  },
]

const categories = [
  {
    name: "Women",
    slug: "women",
    image: "/elegant-woman-fashion.jpg",
  },
  {
    name: "Men",
    slug: "men",
    image: "/elegant-man-fashion.jpg",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "/luxury-accessories.png",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
          <Image src="/new-hero-image.jpg" alt="Hero background" fill className="object-cover object-top" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/60" />
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-balance">
              Timeless Elegance, Modern Style
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover our curated collection of premium fashion and accessories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base" asChild>
                <Link href="/category/new-arrivals">
                  Shop New Arrivals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
                <Link href="/category/sale">View Sale</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Featured Collection</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Handpicked pieces that define sophistication and quality
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/category/new-arrivals">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>




      </main>
    </div>
  )
}
