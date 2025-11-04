"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import toast from "react-hot-toast";

const addresses = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "(555) 123-4567",
    isDefault: true,
  },
];

export default function AddressManagementPage() {
  const handleRemove = (id: number) => {
    toast.success("Address removed");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/account">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Account
              </Link>
            </Button>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-serif font-bold">
                Address Management
              </h1>
              <Button onClick={() => toast.success("Add new address form would open here")}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            </div>
            <div className="space-y-4">
              {addresses.map((addr) => (
                <Card key={addr.id}>
                  <CardContent className="p-6 flex justify-between items-start">
                    <div>
                      <p className="font-semibold flex items-center">
                        {addr.name}
                        {addr.isDefault && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast.success("Edit form would open here")}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleRemove(addr.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}