"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CreditCard, Lock, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/lib/hooks/use-cart"
import { usePromo } from "@/lib/hooks/use-promo"
import { useAuth } from "@/lib/hooks/use-auth"
import { getToken } from "@/lib/auth"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { cart, subtotal, tax, total, clearCart } = useCart()
  const { appliedPromo, validatePromo, recordPromoUse, removeAppliedPromo } = usePromo()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const [shippingMethod, setShippingMethod] = useState("standard")
  const shippingCost = shippingMethod === "express" ? 25 : 0
  const promoDiscount = appliedPromo ? (validatePromo(appliedPromo.code, subtotal).discount ?? 0) : 0
  const finalTotal = total + shippingCost - promoDiscount
  const [isProcessing, setIsProcessing] = useState(false)

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const [shippingAddress, setShippingAddress] = useState({
    first_name: "",
    last_name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    country: "USA",
  })

  const [email, setEmail] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCardDetails((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setShippingAddress((prev) => ({ ...prev, [id]: value }))
  }

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    const { number, expiry, cvc, name } = cardDetails

    if (!number || !expiry || !cvc || !name) {
      toast.error("Please fill in all credit card details.")
      return
    }

    // Basic validation
    if (number.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a valid 16-digit card number.")
      return
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      toast.error("Please enter a valid expiry date in MM/YY format.")
      return
    }
    if (cvc.length < 3 || cvc.length > 4) {
      toast.error("Please enter a valid CVC.")
      return
    }

    // Validate address
    if (!shippingAddress.first_name || !shippingAddress.last_name || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postal_code) {
      toast.error("Please fill in all shipping address fields.")
      return
    }

    setIsProcessing(true)

    try {
      // Check authentication
      if (!isAuthenticated) {
        toast.error("Please log in to complete your order.")
        router.push("/login")
        return
      }

      const token = getToken()
      if (!token) {
        toast.error("Authentication error. Please log in again.")
        router.push("/login")
        return
      }

      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image || '/placeholder.svg',
        })),
        total_amount: finalTotal,
        shipping_address: shippingAddress,
        billing_address: shippingAddress, // Using same address for billing
        promo_code: appliedPromo?.code || null,
        discount_amount: promoDiscount,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Record promo use if applicable
        if (appliedPromo) {
          recordPromoUse(appliedPromo.code)
          removeAppliedPromo()
        }

        toast.success("Order placed successfully!")
        clearCart()
        router.push("/account?tab=orders")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to place order. Please try again.")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          {/* Back to Cart */}
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>

          <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Contact Information</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/login" className="text-accent hover:underline">
                        Log in
                      </Link>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="newsletter" />
                    <label
                      htmlFor="newsletter"
                      className="text-sm text-muted-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email me with news and offers
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input 
                        id="first_name" 
                        placeholder="John" 
                        value={shippingAddress.first_name}
                        onChange={handleAddressChange}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input 
                        id="last_name" 
                        placeholder="Doe" 
                        value={shippingAddress.last_name}
                        onChange={handleAddressChange}
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="line1">Address</Label>
                    <Input 
                      id="line1" 
                      placeholder="123 Main St" 
                      value={shippingAddress.line1}
                      onChange={handleAddressChange}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
                    <Input 
                      id="line2" 
                      placeholder="Apt 4B" 
                      value={shippingAddress.line2}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        placeholder="New York" 
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        placeholder="NY" 
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">ZIP Code</Label>
                      <Input 
                        id="postal_code" 
                        placeholder="10001" 
                        value={shippingAddress.postal_code}
                        onChange={handleAddressChange}
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="(555) 123-4567" 
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center justify-between p-4 border rounded-lg mb-3">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          <div className="font-medium">Standard Shipping</div>
                          <div className="text-sm text-muted-foreground">5-7 business days</div>
                        </Label>
                      </div>
                      <span className="font-semibold">Free</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <div className="font-medium">Express Shipping</div>
                          <div className="text-sm text-muted-foreground">2-3 business days</div>
                        </Label>
                      </div>
                      <span className="font-semibold">$25.00</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup defaultValue="card">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="cursor-pointer flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Credit Card
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="number">Card Number</Label>
                      <Input id="number" placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" value={cardDetails.expiry} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" value={cardDetails.cvc} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Doe" value={cardDetails.name} onChange={handleInputChange} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full" type="submit" disabled={cart.length === 0 || isProcessing}>
                {isProcessing ? "Processing..." : "Complete Order"}
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-4 pb-4 border-b">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                        <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                          <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
