"use client"

import { useState } from "react"
import { Search, MoreVertical, Mail, Ban } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock customers data
const customers = [
  { id: "1", name: "John Doe", email: "john@example.com", orders: 12, spent: 2459.88, joined: "2023-06-15" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", orders: 8, spent: 1829.92, joined: "2023-08-22" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", orders: 5, spent: 949.95, joined: "2023-10-10" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", orders: 15, spent: 3299.85, joined: "2023-05-03" },
  { id: "5", name: "Charlie Wilson", email: "charlie@example.com", orders: 3, spent: 539.97, joined: "2024-01-08" },
]

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
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
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Orders</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Total Spent</th>
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
                                  {customer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{customer.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{customer.email}</td>
                          <td className="py-3 px-4">{customer.orders}</td>
                          <td className="py-3 px-4 font-semibold">${customer.spent.toFixed(2)}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(customer.joined).toLocaleDateString()}
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
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Ban className="mr-2 h-4 w-4" />
                                  Block Customer
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
          </div>
        </main>
      </div>
    </div>
  )
}
