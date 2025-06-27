"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Zap, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import Dashboard from "./components/Dashboard";

interface Order {
  id: number;
  threshold: number;
  amount: number;
  isActive: boolean;
  created: string;
}

interface OrderData {
  threshold: number;
  amount: number;
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

const useMockData = () => {
  const [ethPrice, setEthPrice] = useState(2400);
  const [usdcBalance, setUsdcBalance] = useState(5000);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      threshold: 2200,
      amount: 1000,
      isActive: true,
      created: "2024-01-15",
    },
    {
      id: 2,
      threshold: 2000,
      amount: 2000,
      isActive: true,
      created: "2024-01-14",
    },
  ]);

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setEthPrice((prev) => prev + (Math.random() - 0.5) * 50);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return { ethPrice, usdcBalance, orders, setOrders };
};

const Toast = ({ message, type, onClose }: ToastProps) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 min-w-64 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`}
  >
    {type === "success" && <CheckCircle size={20} />}
    {type === "error" && <XCircle size={20} />}
    {type === "info" && <AlertCircle size={20} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-auto text-xl">
      &times;
    </button>
  </div>
);

export default function ImprovedDipSaver() {
  const { isConnected } = useAccount();
  const { orders, setOrders } = useMockData();
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreateOrder = (orderData: OrderData) => {
    const newOrder: Order = {
      id: Date.now(),
      threshold: orderData.threshold,
      amount: orderData.amount,
      isActive: true,
      created: new Date().toISOString().split("T")[0],
    };
    setOrders((prev) => [...prev, newOrder]);
    showToast("Order created successfully!", "success");
  };

  const handleApprove = (amount: number) => {
    showToast(`Approved ${amount} USDC for spending`, "success");
  };

  const handleExecute = (orderId: number) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    showToast("Order executed successfully!", "success");
  };

  const handleCancel = (orderId: number) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    showToast("Order cancelled", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AutoDipper
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Buy the dip, automatically
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </header>

        {isConnected ? (
          <div className="max-w-6xl mx-auto">
            <Dashboard />
            <OrderForm
              onCreateOrder={handleCreateOrder}
              onApprove={handleApprove}
            />
            <OrderList
              orders={orders}
              onExecute={handleExecute}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <Zap size={64} className="mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your MetaMask wallet to start creating automated dip
                orders
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
