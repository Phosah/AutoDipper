"use client";

import { Zap, Bell } from "lucide-react";
import { useDipSaver } from "@/hooks/useDipSaver";
import { OrderListProps } from "@/types";

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
                        {(Number(order.depositUSDC) / 1e18).toLocaleString()}{" "}
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

export default OrderList;
