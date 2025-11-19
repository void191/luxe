import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "react-hot-toast"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Luxe - Premium E-Commerce",
  description: "Discover curated luxury products",
  generator: "v0.app",
}

import { CartProvider } from "@/lib/hooks/use-cart";
import { WishlistProvider } from "@/lib/hooks/use-wishlist";
import { ReviewsProvider } from "@/lib/hooks/use-reviews";
import { OrderHistoryProvider } from "@/lib/hooks/use-order-history";
import { PromoProvider } from "@/lib/hooks/use-promo";

import { AuthProvider } from "@/lib/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ReviewsProvider>
              <WishlistProvider>
                <PromoProvider>
                  <CartProvider>
                    <OrderHistoryProvider>
                      {children}
                      <Toaster />
                      <Analytics />
                    </OrderHistoryProvider>
                  </CartProvider>
                </PromoProvider>
              </WishlistProvider>
            </ReviewsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
