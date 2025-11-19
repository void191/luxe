"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, Eye, Edit, Trash2, Package } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminAuthGuard } from "@/components/admin-auth-guard";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-hot-toast"

interface Order {
  id: number;
  total: number;
  status: string;
  date: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  items: {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        toast.error("Failed to fetch orders")
      }
    } catch (error) {
      toast.error("Error fetching orders")
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.user.first_name} ${order.user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="min-h-screen flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6 bg-muted/30 flex items-center justify-center">
              <p>Loading orders...</p>
            </main>
          </div>
        </div>
      </AdminAuthGuard>
    )
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
                              <td className="py-3 px-4 font-medium">ORD-{order.id.toString().padStart(3, '0')}</td>
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">{order.user.first_name} {order.user.last_name}</p>
                                  <p className="text-sm text-muted-foreground">{order.user.email}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {new Date(order.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">{order.items.length}</td>
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
    </AdminAuthGuard>
  )
}
