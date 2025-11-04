"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { PromoCode } from "@/lib/types";

interface PromoContextType {
  promos: PromoCode[];
  appliedPromo: PromoCode | null;
  createPromo: (promo: PromoCode) => void;
  updatePromo: (code: string, patch: Partial<PromoCode>) => void;
  deletePromo: (code: string) => void;
  applyPromo: (code: string, subtotal: number) => { valid: boolean; message?: string; discount?: number };
  removeAppliedPromo: () => void;
  recordPromoUse: (code: string) => void; // mark a promo as used (increments uses)
  validatePromo: (code: string, subtotal?: number) => { valid: boolean; message?: string; discount?: number };
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export const usePromo = () => {
  const ctx = useContext(PromoContext);
  if (!ctx) throw new Error("usePromo must be used within a PromoProvider");
  return ctx;
};

const PROMOS_KEY = "promo_codes";
const APPLIED_KEY = "applied_promo";

export const PromoProvider = ({ children }: { children: React.ReactNode }) => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(PROMOS_KEY);
    if (stored) setPromos(JSON.parse(stored));

    const applied = localStorage.getItem(APPLIED_KEY);
    if (applied) setAppliedPromo(JSON.parse(applied));
  }, []);

  useEffect(() => {
    localStorage.setItem(PROMOS_KEY, JSON.stringify(promos));
  }, [promos]);

  useEffect(() => {
    if (appliedPromo) localStorage.setItem(APPLIED_KEY, JSON.stringify(appliedPromo));
    else localStorage.removeItem(APPLIED_KEY);
  }, [appliedPromo]);

  const persistPromos = (next: PromoCode[]) => {
    setPromos(next);
    localStorage.setItem(PROMOS_KEY, JSON.stringify(next));
  };

  const createPromo = (promo: PromoCode) => {
    const next = [...promos, { ...promo, uses: promo.uses ?? 0 }];
    persistPromos(next);
  };

  const updatePromo = (code: string, patch: Partial<PromoCode>) => {
    const next = promos.map((p) => (p.code === code ? { ...p, ...patch } : p));
    persistPromos(next);
    if (appliedPromo && appliedPromo.code === code) setAppliedPromo((ap) => (ap ? { ...ap, ...patch } : ap));
  };

  const deletePromo = (code: string) => {
    const next = promos.filter((p) => p.code !== code);
    persistPromos(next);
    if (appliedPromo && appliedPromo.code === code) setAppliedPromo(null);
  };

  const computeDiscount = (promo: PromoCode, subtotal: number) => {
    if (promo.type === "percentage") {
      return Math.min(subtotal, (subtotal * promo.value) / 100);
    }
    return Math.min(subtotal, promo.value);
  };

  const validatePromo = (code: string, subtotal = 0) => {
    const promo = promos.find((p) => p.code.toLowerCase() === code.toLowerCase());
    if (!promo) return { valid: false, message: "Promo code not found" };
    if (!promo.active) return { valid: false, message: "Promo code is not active" };
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return { valid: false, message: "Promo code has expired" };
    if (typeof promo.usageLimit === "number" && (promo.uses ?? 0) >= promo.usageLimit) return { valid: false, message: "Promo code usage limit reached" };
    const discount = computeDiscount(promo, subtotal);
    if (discount <= 0) return { valid: false, message: "Promo does not apply to this cart" };
    return { valid: true, discount };
  };

  const applyPromo = (code: string, subtotal: number) => {
    const check = validatePromo(code, subtotal);
    if (!check.valid) return { valid: false, message: check.message };
    const promo = promos.find((p) => p.code.toLowerCase() === code.toLowerCase())!;
    setAppliedPromo(promo);
    return { valid: true, discount: check.discount };
  };

  const removeAppliedPromo = () => setAppliedPromo(null);

  const recordPromoUse = (code: string) => {
    const next = promos.map((p) => {
      if (p.code === code) return { ...p, uses: (p.uses ?? 0) + 1 };
      return p;
    });
    persistPromos(next);
    // if applied promo reached limit, clear applied
    const applied = next.find((p) => p.code === code);
    if (applied && typeof applied.usageLimit === "number" && (applied.uses ?? 0) >= applied.usageLimit) {
      if (appliedPromo && appliedPromo.code === code) setAppliedPromo(null);
    }
  };

  return (
    <PromoContext.Provider
      value={{ promos, appliedPromo, createPromo, updatePromo, deletePromo, applyPromo, removeAppliedPromo, recordPromoUse, validatePromo }}
    >
      {children}
    </PromoContext.Provider>
  );
};

export default PromoProvider;
