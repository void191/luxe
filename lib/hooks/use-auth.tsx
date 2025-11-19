"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { getToken, setToken as saveToken, removeToken, decodeToken } from "@/lib/auth"

interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  is_admin: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize user from backend /auth/me endpoint
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    // Fetch user from backend to ensure token is valid
    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          // Invalid token, clean up
          removeToken()
          setUser(null)
        }
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error)
        removeToken()
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const { token, user: userData } = await response.json()
        
        // Store token using centralized utility
        saveToken(token)
        
        // Set user state
        setUser({
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          is_admin: userData.is_admin,
        })
        
        toast.success('Login successful!')
        
        // Redirect based on admin status
        if (userData.is_admin) {
          router.push('/admin')
        } else {
          router.push('/')
        }
        
        return true
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Login failed.')
        return false
      }
    } catch (error) {
      console.error("Login failed", error)
      toast.error("An unexpected error occurred during login.")
      return false
    }
  }

  const logout = () => {
    setUser(null)
    removeToken()
    toast.success("Logged out successfully.")
    router.push("/")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const isAuthenticated = !!user
  const isAdmin = user?.is_admin || false

  if (loading) {
    return null // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
