"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"

// Mock analytics data
const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "2,350",
    change: "+15.3%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Products",
    value: "456",
    change: "-2.4%",
    trend: "down",
    icon: Package,
  },
]

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", total: 639.98, status: "Completed", date: "2024-01-15" },
  { id: "ORD-002", customer: "Jane Smith", total: 329.99, status: "Processing", date: "2024-01-20" },
  { id: "ORD-003", customer: "Bob Johnson", total: 189.99, status: "Shipped", date: "2024-01-22" },
  { id: "ORD-004", customer: "Alice Brown", total: 449.99, status: "Pending", date: "2024-01-23" },
  { id: "ORD-005", customer: "Charlie Wilson", total: 89.99, status: "Completed", date: "2024-01-24" },
]

export default function AdminDashboard() {
  return (
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
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs mt-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                      <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
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
                          <td className="py-3 px-4 font-medium">{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-semibold">${order.total.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "Processing"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "Shipped"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
