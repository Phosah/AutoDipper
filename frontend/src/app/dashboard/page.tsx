"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  Zap,
} from "lucide-react";
import { useDipSaver } from "../../hooks/useDipSaver";
import { ToastState } from "../../types";
import OrderForm from "../components/OrderForm";
import OrderList from "../components/OrderList";
import Dashboard from "../components/Dashboard";
import Toast from "../components/Toast";

export default function DipSaver() {
  const { isConnected } = useAccount();
  const { orders, createDipOrder, executeDipOrder, cancelDipOrder } =
    useDipSaver();
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreateOrder = async (orderData: {
    threshold: number;
    amount: number;
  }) => {
    try {
      await createDipOrder(orderData.threshold, orderData.amount);
      showToast("Order created successfully!", "success");
    } catch (error) {
      showToast(`Error creating order: ${error}`, "error");
    }
  };

  const handleApprove = (amount: number) => {
    showToast(`Approved ${amount} USDC for spending`, "success");
  };

  const handleExecute = async (orderId: number) => {
    try {
      await executeDipOrder(orderId);
      showToast("Order executed successfully!", "success");
    } catch (error) {
      showToast(`Error executing order: ${error}`, "error");
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      await cancelDipOrder(orderId);
      showToast("Order cancelled", "info");
    } catch (error) {
      showToast(`Error cancelling order: ${error}`, "error");
    }
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
