"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther, parseUnits, formatUnits } from "viem";
import DipSaverABI from "../app/utils/abi/DipSaverABI.json";
import { NETWORKS, USDC_DECIMALS, PRICE_FEED_DECIMALS, type DipOrder } from "../types";

// USDC ABI (minimal for our needs)
const USDC_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const useDipSaver = () => {
  const { address, chainId } = useAccount();
  const [orders, setOrders] = useState<DipOrder[]>([]);
  const [usdcBalance, setUsdcBalance] = useState<bigint>(BigInt(0));
  const [ethBalance, setEthBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);

  // Get network config
  const network = chainId ? NETWORKS[chainId] : null;
  const dipSaverAddress = network?.dipSaverAddress as `0x${string}`;
  const usdcAddress = network?.usdcAddress as `0x${string}`;

  // Read contract data
  const { data: orderCount = BigInt(0) } = useReadContract({
    address: dipSaverAddress,
    abi: DipSaverABI,
    functionName: "orderCount",
  });

  const { data: latestPrice = BigInt(0) } = useReadContract({
    address: dipSaverAddress,
    abi: DipSaverABI,
    functionName: "getLatestPrice",
  });

  // USDC balance
  const { data: userUsdcBalance = BigInt(0) } = useReadContract({
    address: usdcAddress,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address!],
  });

  // ETH balance in contract
  const { data: userEthBalance = BigInt(0) } = useReadContract({
    address: dipSaverAddress,
    abi: DipSaverABI,
    functionName: "ethBalance",
    args: [address!],
  });

  // Write contract functions
  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isTransactionPending, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Load orders - simplified for now
  const loadOrders = async () => {
    // This will be implemented when we have the contract deployed
    console.log("Loading orders...");
  };

  // Create dip order
  const createDipOrder = async (priceThreshold: number, usdcAmount: number) => {
    if (!dipSaverAddress || !usdcAddress) return;

    try {
      setIsLoading(true);
      
      // First approve USDC spending
      await writeContract({
        address: usdcAddress,
        abi: USDC_ABI,
        functionName: "approve",
        args: [dipSaverAddress, parseUnits(usdcAmount.toString(), USDC_DECIMALS)],
      });

      // Then create the order
      await writeContract({
        address: dipSaverAddress,
        abi: DipSaverABI,
        functionName: "createDipOrder",
        args: [
          parseUnits(priceThreshold.toString(), PRICE_FEED_DECIMALS),
          parseUnits(usdcAmount.toString(), USDC_DECIMALS),
        ],
      });
    } catch (error) {
      console.error("Error creating dip order:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Execute dip order
  const executeDipOrder = async (orderId: number) => {
    if (!dipSaverAddress) return;

    try {
      setIsLoading(true);
      await writeContract({
        address: dipSaverAddress,
        abi: DipSaverABI,
        functionName: "executeDipOrder",
        args: [BigInt(orderId)],
      });
    } catch (error) {
      console.error("Error executing dip order:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel dip order
  const cancelDipOrder = async (orderId: number) => {
    if (!dipSaverAddress) return;

    try {
      setIsLoading(true);
      await writeContract({
        address: dipSaverAddress,
        abi: DipSaverABI,
        functionName: "cancelDipOrder",
        args: [BigInt(orderId)],
      });
    } catch (error) {
      console.error("Error cancelling dip order:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Format price for display
  const formatPrice = (price: bigint) => {
    return Number(formatUnits(price, PRICE_FEED_DECIMALS));
  };

  // Format USDC for display
  const formatUSDC = (amount: bigint) => {
    return Number(formatUnits(amount, USDC_DECIMALS));
  };

  // Format ETH for display
  const formatETH = (amount: bigint) => {
    return Number(formatEther(amount));
  };

  // Refresh data when transaction succeeds
  useEffect(() => {
    if (isTransactionSuccess) {
      loadOrders();
    }
  }, [isTransactionSuccess]);

  // Update balances
  useEffect(() => {
    if (userUsdcBalance && typeof userUsdcBalance === 'bigint') setUsdcBalance(userUsdcBalance);
    if (userEthBalance && typeof userEthBalance === 'bigint') setEthBalance(userEthBalance);
  }, [userUsdcBalance, userEthBalance]);

  return {
    // Data
    orders,
    latestPrice: formatPrice(latestPrice),
    usdcBalance: formatUSDC(usdcBalance),
    ethBalance: formatETH(ethBalance),
    orderCount: Number(orderCount),
    
    // State
    isLoading: isLoading || isTransactionPending,
    isConnected: !!address,
    network,
    
    // Actions
    createDipOrder,
    executeDipOrder,
    cancelDipOrder,
    loadOrders,
    
    // Utilities
    formatPrice,
    formatUSDC,
    formatETH,
  };
}; 