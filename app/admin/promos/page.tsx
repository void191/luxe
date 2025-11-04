"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePromo } from "@/lib/hooks/use-promo";
import toast from "react-hot-toast";

export default function AdminPromosPage() {
  const { promos, createPromo, updatePromo, deletePromo } = usePromo();
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleCreate = () => {
    if (!code || !value) return toast.error("Please provide code and value");
    const promo = {
      code: code.trim(),
      type: type as any,
      value: parseFloat(value),
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      uses: 0,
      perCustomer: false,
      expiresAt: expiresAt || null,
      active: true,
    };
    createPromo(promo);
    toast.success("Promo created")
    setCode("");
    setValue("");
    setUsageLimit("");
    setExpiresAt("");
  };

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 bg-muted/30">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Promo Codes</h1>
              <p className="text-muted-foreground">Create and manage promo codes</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>Code</Label>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Type</Label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full mt-1 p-2 border rounded-md">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
                <div>
                  <Label>Value</Label>
                  <Input value={value} onChange={(e) => setValue(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Usage limit (optional)</Label>
                  <Input value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Expires at (optional)</Label>
                  <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="mt-1" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreate}>Create Promo</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Existing Promo Codes</h2>
                <div className="space-y-3">
                  {promos.length === 0 && <p className="text-muted-foreground">No promos yet</p>}
                  {promos.map((p) => (
                    <div key={p.code} className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <div className="font-medium">{p.code}</div>
                        <div className="text-sm text-muted-foreground">{p.type} — {p.value}{p.type === 'percentage' ? '%' : '$'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => updatePromo(p.code, { active: !p.active })}>
                          {p.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="ghost" className="text-destructive" onClick={() => deletePromo(p.code)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
