"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
}

export function ProductGrid({ products }: { products: Product[] }) {
  const [count, setCount] = useState(Math.min(8, products.length))

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, count).map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>

      {count < products.length && (
        <div className="text-center mt-12">
          <button
            className="inline-flex items-center justify-center px-6 py-3 border rounded-md"
            onClick={() => setCount((c) => Math.min(products.length, c + 8))}
          >
            Load More Products
          </button>
        </div>
      )}
    </>
  )
}
