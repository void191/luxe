"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function ClearLocalStoragePage() {
  const [done, setDone] = useState(false)

  const clear = () => {
    try {
      localStorage.removeItem("cart")
      localStorage.removeItem("wishlist")
      setDone(true)
      alert("Cleared cart and wishlist from localStorage")
    } catch (err) {
      console.error(err)
      alert("Failed to clear localStorage")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Dev: Clear Client Storage</h1>
          <p className="text-muted-foreground mb-6">This clears cart and wishlist stored in localStorage.</p>
          <Button onClick={clear} disabled={done}>
            {done ? "Cleared" : "Clear cart & wishlist"}
          </Button>
        </div>
      </main>
    </div>
  )
}
