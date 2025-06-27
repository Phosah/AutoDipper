"use client";
import { TrendingDown, TrendingUp, DollarSign, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface Order {
  id: number;
  threshold: number;
  amount: number;
  isActive: boolean;
  created: string;
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

const Dashboard = () => {
  const { ethPrice, usdcBalance } = useMockData();
  const priceChange = 2.3;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">ETH Price</p>
            <p className="text-3xl font-bold">${ethPrice.toFixed(2)}</p>
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
            <p className="text-3xl font-bold">2</p>
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

export default Dashboard;
