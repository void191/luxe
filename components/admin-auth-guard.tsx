"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useAuth } from "@/lib/hooks/use-auth"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access admin area")
      router.push("/login")
      return
    }

    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.")
      router.push("/")
      return
    }
  }, [isAuthenticated, isAdmin, router])

  // Only render children if user is authenticated and is admin
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return <>{children}</>
}
