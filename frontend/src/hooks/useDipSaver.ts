"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { formatEther, parseUnits, formatUnits } from "viem";
import DipSaverABI from "../app/utils/abi/DipSaverABI.json";
import { NETWORKS, USDC_DECIMALS, PRICE_FEED_DECIMALS, type DipOrder } from "../types";

import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/A33IUFjjL2OZ2LrqMPPmN');
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
  const publicClient = usePublicClient();
  const [orders, setOrders] = useState<DipOrder[]>([]);
  const [usdcBalance, setUsdcBalance] = useState<bigint>(BigInt(0));
  const [ethBalance, setEthBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);

  const network = chainId ? NETWORKS[chainId] : null;
  const dipSaverAddress = network?.dipSaverAddress as `0x${string}`;
  const usdcAddress = network?.usdcAddress as `0x${string}`;

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

  const { data: userUsdcBalance = BigInt(0) } = useReadContract({
    address: usdcAddress,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address!],
  });

  const { data: userEthBalance = BigInt(0) } = useReadContract({
    address: dipSaverAddress,
    abi: DipSaverABI,
    functionName: "ethBalance",
    args: [address!],
  });

  const { writeContract, data: hash, writeContractAsync } = useWriteContract();
  const { isLoading: isTransactionPending, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const loadOrders = async () => {
    if (!dipSaverAddress || !publicClient) return;
    
    try {
      // Get the order count
      const count = await publicClient.readContract({
        address: dipSaverAddress,
        abi: DipSaverABI,
        functionName: "orderCount",
      });
      
      const orderCount = Number(count);
      
      // Fetch all orders
      const fetchedOrders: DipOrder[] = [];
      
      for (let i = 0; i < orderCount; i++) {
        try {
          const orderData = await publicClient.readContract({
            address: dipSaverAddress,
            abi: DipSaverABI,
            functionName: "getOrder",
            args: [BigInt(i)],
          });
          
          const [user, priceThreshold, depositUSDC, active] = orderData as [string, bigint, bigint, boolean];
          
          // Only show orders for the current user
          if (user.toLowerCase() === address?.toLowerCase()) {
            fetchedOrders.push({
              user,
              priceThreshold,
              depositUSDC,
              active,
            });
          }
        } catch (error) {
          console.error(`Error fetching order ${i}:`, error);
        }
      }
      
      setOrders(fetchedOrders);
      
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };



  const createDipOrder = async (priceThreshold: number, usdcAmount: number) => {
    
    if (!dipSaverAddress || !usdcAddress) {
      return;
    }
  

    try {
      setIsLoading(true);

      const frontendAmount = parseUnits(usdcAmount.toString(), 18);
      const contractAmount = parseUnits(usdcAmount.toString(), 18);
      
      const approvalTxHash = await writeContractAsync({
        address: usdcAddress,
        abi: USDC_ABI,
        functionName: "approve",
        args: [dipSaverAddress, frontendAmount],
      });

      const approvalTxReceipt = await provider.waitForTransaction(approvalTxHash);
      console.log("✅ Approval transaction confirmed:", approvalTxReceipt);

      const parsedPriceThreshold = parseUnits(priceThreshold.toString(), PRICE_FEED_DECIMALS);

      const dipOrderTxHash = await writeContractAsync({
        address: dipSaverAddress,
        abi: DipSaverABI,
        functionName: "createDipOrder",
        args: [parsedPriceThreshold, contractAmount],
      });


      const dipOrderTxReceipt = await provider.waitForTransaction(dipOrderTxHash);
      console.log("✅ Order created:", dipOrderTxReceipt);

    } catch (error) {
      console.error("Error creating dip order:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatUSDC = (amount: bigint) => {
    console.log("Raw USDC balance:", amount.toString());
    const formatted = Number(formatUnits(amount, USDC_DECIMALS));
    console.log("Formatted USDC balance:", formatted);
    return formatted;
  };

  const formatETH = (amount: bigint) => {
    return Number(formatEther(amount));
  };

  useEffect(() => {
    if (isTransactionSuccess) {
      loadOrders();
    }

    // eslint-disable-next-line
  }, [isTransactionSuccess]);

  // Load orders when component mounts and when user connects
  useEffect(() => {
    if (address && dipSaverAddress && publicClient) {
      loadOrders();
    }
  }, [address, dipSaverAddress, publicClient]);

  useEffect(() => {
    if (userUsdcBalance && typeof userUsdcBalance === 'bigint') setUsdcBalance(userUsdcBalance);
    if (userEthBalance && typeof userEthBalance === 'bigint') setEthBalance(userEthBalance);
  }, [userUsdcBalance, userEthBalance]);

  return {
    // Data
    orders,
    latestPrice: formatPrice(latestPrice as bigint),
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