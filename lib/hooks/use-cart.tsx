"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import Decimal from 'decimal.js-light';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Omit<Product, 'quantity'>, quantity: number) => void;
  updateQuantity: (id: string, size: string, color: string, newQuantity: number) => void;
  removeFromCart: (id:string, size: string, color: string) => void;
  clearCart: () => void;
  subtotal: number;
  shipping: number;
  tax: number;
  cartCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Omit<Product, 'quantity'>, quantity: number) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === product.size && item.color === product.color
      );

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (id: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size && item.color === color ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.size === size && item.color === color))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = new Decimal(item.price).times(item.quantity);
    return new Decimal(sum).plus(itemTotal).toNumber();
  }, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = new Decimal(subtotal).times(0.08).toNumber();
  const total = new Decimal(subtotal).plus(shipping).plus(tax).toNumber();

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, subtotal, shipping, tax, total }}>
      {children}
    </CartContext.Provider>
  );
};
