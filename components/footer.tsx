import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Luxe</h3>
          <p className="text-sm">
            Premium e-commerce for discerning customers.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/category/new-arrivals" className="hover:text-foreground">New Arrivals</Link></li>
            <li><Link href="/category/women" className="hover:text-foreground">Women</Link></li>
            <li><Link href="/category/men" className="hover:text-foreground">Men</Link></li>
            <li><Link href="/category/accessories" className="hover:text-foreground">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-foreground">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-foreground">FAQ</Link></li>
            <li><Link href="#" className="hover:text-foreground">Shipping</Link></li>
            <li><Link href="#" className="hover:text-foreground">Returns</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Newsletter</h3>
          <p className="text-sm mb-4">Subscribe to our newsletter for the latest updates.</p>
          <div className="flex">
            <Input type="email" placeholder="Your email" className="rounded-r-none" />
            <Button type="submit" className="rounded-l-none">Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Luxe. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
