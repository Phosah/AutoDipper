"use client";

import { useState, useEffect } from "react";
import { Zap, Bell } from "lucide-react";

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

interface Order {
  id: number;
  threshold: number;
  amount: number;
  isActive: boolean;
  created: string;
}

interface OrderListProps {
  orders: Order[];
  onExecute: (orderId: number) => void;
  onCancel: (orderId: number) => void;
}

const OrderList = ({ orders, onExecute, onCancel }: OrderListProps) => {
  const { ethPrice } = useMockData();

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
          {orders.map((order: Order) => {
            const isTriggered = ethPrice <= order.threshold;
            return (
              <div
                key={order.id}
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
                        Buy at ${order.threshold.toLocaleString()}
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
                        {order.amount.toLocaleString()} USDC
                      </p>
                      <p>
                        <strong>Created:</strong> {order.created}
                      </p>
                      <p>
                        <strong>Current Price:</strong> ${ethPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onExecute(order.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isTriggered
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {isTriggered ? "Execute Now" : "Force Execute"}
                    </button>
                    <button
                      onClick={() => onCancel(order.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
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

export default OrderList;
