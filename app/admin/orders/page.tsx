"use client"

import { useState } from "react"
import { Search, MoreVertical, Eye, Truck, CheckCircle } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock orders data
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 639.98,
    status: "Completed",
    date: "2024-01-15",
    items: 2,
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 329.99,
    status: "Processing",
    date: "2024-01-20",
    items: 1,
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    total: 189.99,
    status: "Shipped",
    date: "2024-01-22",
    items: 1,
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    total: 449.99,
    status: "Pending",
    date: "2024-01-23",
    items: 1,
  },
  {
    id: "ORD-005",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    total: 89.99,
    status: "Completed",
    date: "2024-01-24",
    items: 2,
  },
]

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Orders</h1>
              <p className="text-muted-foreground">Manage and track customer orders</p>
            </div>

            <Tabs defaultValue="all" onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value={statusFilter} className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search orders..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-sm">Order ID</th>
                            <th className="text-left py-3 px-4 font-medium text-sm">Customer</th>
                            <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                            <th className="text-left py-3 px-4 font-medium text-sm">Items</th>
                            <th className="text-left py-3 px-4 font-medium text-sm">Total</th>
                            <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                            <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="py-3 px-4 font-medium">{order.id}</td>
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">{order.customer}</p>
                                  <p className="text-sm text-muted-foreground">{order.email}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {new Date(order.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">{order.items}</td>
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
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Truck className="mr-2 h-4 w-4" />
                                      Mark as Shipped
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
