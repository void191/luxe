"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, Mail, Ban, Edit, Eye, Trash2 } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminAuthGuard } from '@/components/admin-auth-guard'
import { getToken } from '@/lib/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "react-hot-toast"

interface User {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
  is_admin: boolean
  status: string
  created_at: string
}

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = getToken()
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        toast.error('Failed to fetch users')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const token = getToken()
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success('User deleted successfully')
        fetchUsers()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to delete user')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleViewOrders = async (userId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${userId}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const orders = await response.json()
        console.log('User orders:', orders)
        toast.success(`User has ${orders.length} order(s)`)
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const filteredCustomers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex">
        <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Customers</h1>
              <p className="text-muted-foreground">Manage your customer base</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-sm">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Joined</th>
                          <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer) => (
                          <tr key={customer.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {customer.first_name?.[0] || customer.email[0].toUpperCase()}
                                    {customer.last_name?.[0] || ''}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {customer.first_name && customer.last_name
                                    ? `${customer.first_name} ${customer.last_name}`
                                    : customer.email}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{customer.email}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                  customer.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {customer.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">{customer.is_admin ? 'Admin' : 'Customer'}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(customer.created_at).toLocaleDateString()}
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
                                  <DropdownMenuItem onClick={() => handleViewOrders(customer.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Orders
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteUser(customer.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    </AdminAuthGuard>
  )
}
