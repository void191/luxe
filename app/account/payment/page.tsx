"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Plus, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const paymentMethods = [
  {
    id: 1,
    cardType: "Visa",
    last4: "4242",
    expiry: "12/26",
    isDefault: true,
  },
];

export default function PaymentMethodsPage() {
    const handleRemove = (id: number) => {
        toast.success("Payment method removed");
    }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/account">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Account
              </Link>
            </Button>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-serif font-bold">
                Payment Methods
              </h1>
              <Button onClick={() => toast.success("Add new payment form would open here")}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Method
              </Button>
            </div>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">
                          {method.cardType} ending in {method.last4}
                          {method.isDefault && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiry}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast.success("Edit form would open here")}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleRemove(method.id)}
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