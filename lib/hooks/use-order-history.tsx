"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
  status: string;
}

interface OrderHistoryContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined);

export const useOrderHistory = () => {
  const context = useContext(OrderHistoryContext);
  if (!context) {
    throw new Error('useOrderHistory must be used within an OrderHistoryProvider');
  }
  return context;
};

export const OrderHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Processing',
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  return (
    <OrderHistoryContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};
