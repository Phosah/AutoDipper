"use client";

import { useState } from "react";
import { DollarSign, Zap, CheckCircle } from "lucide-react";

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

export default OrderForm;
