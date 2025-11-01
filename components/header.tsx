"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-serif font-bold tracking-tight">Luxe</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/category/new-arrivals" className="text-sm font-medium transition-colors hover:text-accent">
            New Arrivals
          </Link>
          <Link href="/category/women" className="text-sm font-medium transition-colors hover:text-accent">
            Women
          </Link>
          <Link href="/category/men" className="text-sm font-medium transition-colors hover:text-accent">
            Men
          </Link>
          <Link href="/category/accessories" className="text-sm font-medium transition-colors hover:text-accent">
            Accessories
          </Link>
          <Link
            href="/category/sale"
            className="text-sm font-medium text-destructive transition-colors hover:text-destructive/80"
          >
            Sale
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {mounted && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                  0
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/category/new-arrivals" className="text-lg font-medium transition-colors hover:text-accent">
                  New Arrivals
                </Link>
                <Link href="/category/women" className="text-lg font-medium transition-colors hover:text-accent">
                  Women
                </Link>
                <Link href="/category/men" className="text-lg font-medium transition-colors hover:text-accent">
                  Men
                </Link>
                <Link href="/category/accessories" className="text-lg font-medium transition-colors hover:text-accent">
                  Accessories
                </Link>
                <Link
                  href="/category/sale"
                  className="text-lg font-medium text-destructive transition-colors hover:text-destructive/80"
                >
                  Sale
                </Link>
                <div className="pt-4 border-t">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search products..." className="pl-9" />
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
