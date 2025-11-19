"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { toast } from "react-hot-toast"
import { getToken } from "@/lib/auth"

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

interface Order {
  id: number;
  total: number;
  status: string;
  date: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = getToken()
      
      // Fetch orders
      const ordersResponse = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      // Fetch users
      const usersResponse = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (ordersResponse.ok && usersResponse.ok) {
        const orders = await ordersResponse.json()
        const users = await usersResponse.json()

        // Calculate stats from real data
        const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0)
        const products = localStorage.getItem("products")
        const productCount = products ? JSON.parse(products).length : 0

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalCustomers: users.length,
          totalProducts: productCount,
        })

        // Get 5 most recent orders
        setRecentOrders(orders.slice(0, 5))
      } else {
        toast.error("Failed to load dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Error loading dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminHeader />

        <main className="flex-1 p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading orders...</p>
                ) : recentOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No orders yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-sm">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Total</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4 font-medium">ORD-{order.id.toString().padStart(3, '0')}</td>
                            <td className="py-3 px-4">{order.user.first_name} {order.user.last_name}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 font-semibold">${order.total.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "processing"
                                      ? "bg-blue-100 text-blue-700"
                                      : order.status === "shipped"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    </AdminAuthGuard>
  )
}
