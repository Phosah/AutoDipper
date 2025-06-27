"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  Zap,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useDipSaver } from "../../hooks/useDipSaver";
import { ToastProps, ToastState, DipOrder } from "../../types";

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

const Dashboard = () => {
  const { latestPrice, usdcBalance, orderCount } = useDipSaver();
  const priceChange = 2.3; // TODO: Calculate real price change

  // useEffect(() => {
  //   console.log("Latest price from contract:", latestPrice);
  //   console.log("usdc balance", usdcBalance);
  // }, [latestPrice, usdcBalance]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">ETH Price</p>
            <p className="text-3xl font-bold">${latestPrice.toFixed(2)}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="flex items-center mt-2">
          {priceChange > 0 ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span className="ml-1 text-sm">
            {priceChange > 0 ? "+" : ""}
            {priceChange}% (24h)
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">USDC Balance</p>
            <p className="text-3xl font-bold">
              ${usdcBalance.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <DollarSign size={24} />
          </div>
        </div>
        <p className="text-green-100 text-sm mt-2">Available for orders</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Active Orders</p>
            <p className="text-3xl font-bold">{orderCount}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <Zap size={24} />
          </div>
        </div>
        <p className="text-purple-100 text-sm mt-2">Ready to execute</p>
      </div>
    </div>
  );
};

interface OrderListProps {
  orders: DipOrder[];
  onExecute: (orderId: number) => void;
  onCancel: (orderId: number) => void;
}

const OrderList = ({ orders, onExecute, onCancel }: OrderListProps) => {
  const { latestPrice } = useDipSaver();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Bell className="text-purple-500" size={24} />
        Active Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Zap size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No active orders yet</p>
          <p className="text-sm">Create your first dip order above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const isTriggered =
              latestPrice <= Number(order.priceThreshold) / 1e8;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isTriggered
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isTriggered ? "bg-green-500" : "bg-blue-500"
                        }`}
                      />
                      <span className="font-semibold text-gray-800">
                        Buy at $
                        {(Number(order.priceThreshold) / 1e8).toLocaleString()}
                      </span>
                      {isTriggered && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          READY TO EXECUTE
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Amount:</strong> $
                        {(Number(order.depositUSDC) / 1e6).toLocaleString()}{" "}
                        USDC
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {order.active ? "Active" : "Inactive"}
                      </p>
                      <p>
                        <strong>Current Price:</strong> $
                        {latestPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onExecute(index)}
                      disabled={!order.active}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isTriggered && order.active
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      } ${
                        !order.active ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isTriggered && order.active
                        ? "Execute Now"
                        : "Force Execute"}
                    </button>
                    <button
                      onClick={() => onCancel(index)}
                      disabled={!order.active}
                      className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors ${
                        !order.active ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const OrderForm = ({
  onCreateOrder,
  onApprove,
}: {
  onCreateOrder: (orderData: { threshold: number; amount: number }) => void;
  onApprove: (amount: number) => void;
}) => {
  const [threshold, setThreshold] = useState("");
  const [amount, setAmount] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = () => {
    onApprove(parseFloat(amount));
    setIsApproved(true);
  };

  const handleSubmit = () => {
    if (!threshold || !amount) return;
    onCreateOrder({
      threshold: parseFloat(threshold),
      amount: parseFloat(amount),
    });
    setThreshold("");
    setAmount("");
    setIsApproved(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Zap className="text-blue-500" size={24} />
        Create Dip Order
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price Threshold (USD)
            </label>
            <div className="relative">
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="e.g. 2200"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors pl-8 text-gray-800"
              />
              <DollarSign
                className="absolute left-2 top-4 text-gray-400"
                size={18}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Order executes when ETH drops below this price
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              USDC Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors pl-8 text-gray-800"
              />
              <DollarSign
                className="absolute left-2 top-4 text-gray-400"
                size={18}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Amount of USDC to spend on ETH
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {!isApproved && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={!amount}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Approve USDC
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isApproved || !threshold || !amount}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Zap size={18} />
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ImprovedDipSaver() {
  const { isConnected } = useAccount();
  const { orders, createDipOrder, executeDipOrder, cancelDipOrder, isLoading } =
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
