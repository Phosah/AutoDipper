"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useApproveUsdc } from "./hooks/useApproval";
import { useCreateDipOrder } from "./hooks/useDipOrder";

export default function Home() {
  const [threshold, setThreshold] = useState("1800");
  const [usdcAmount, setUsdcAmount] = useState("3600");

  const {
    approve,
    isPending: isApproving,
    error: approveError,
  } = useApproveUsdc();
  const {
    createOrder,
    isPending: isCreatingOrder,
    error: createOrderError,
  } = useCreateDipOrder();

  const handleApprove = () => {
    const amount = BigInt(usdcAmount) * BigInt(1e6);
    approve(amount);
  };

  const handleCreateOrder = () => {
    const thresholdBigInt = BigInt(threshold) * BigInt(1e8);
    const usdcAmountBigInt = BigInt(usdcAmount) * BigInt(1e6);
    createOrder(thresholdBigInt, usdcAmountBigInt);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Autodipper</h1>
      <ConnectButton />

      <div className="mt-4 space-y-4">
        <div>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="Price Threshold (USD)"
            className="border p-2 rounded mr-2"
          />
          <input
            type="number"
            value={usdcAmount}
            onChange={(e) => setUsdcAmount(e.target.value)}
            placeholder="USDC Amount"
            className="border p-2 rounded"
          />
        </div>

        <div className="space-x-2">
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isApproving ? "Approving..." : "Approve USDC"}
          </button>

          <button
            onClick={handleCreateOrder}
            disabled={isCreatingOrder}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isCreatingOrder ? "Creating..." : "Create Dip Order"}
          </button>
        </div>

        {/* Error messages */}
        {approveError && (
          <div className="text-red-500 text-sm">
            Approve Error: {approveError.message}
          </div>
        )}
        {createOrderError && (
          <div className="text-red-500 text-sm">
            Create Order Error: {createOrderError.message}
          </div>
        )}
      </div>
    </main>
  );
}
