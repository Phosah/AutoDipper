// Reusable Types for AutoDipper
export interface Order {
  id: number;
  threshold: number;
  amount: number;
  isActive: boolean;
  created: string;
}

export interface OrderData {
  threshold: number;
  amount: number;
}

export interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export interface OrderFormProps {
  onCreateOrder: (orderData: OrderData) => void;
  onApprove: (amount: number) => void;
}

export interface OrderListProps {
  orders: Order[];
  onExecute: (orderId: number) => void;
  onCancel: (orderId: number) => void;
}

export interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

// Contract Types
export interface DipOrder {
  user: string;
  priceThreshold: bigint;
  depositUSDC: bigint;
  active: boolean;
}

// Network Configuration
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  usdcAddress: string;
  ethUsdPriceFeed: string;
  dipSaverAddress: string;
}

// Constants
export const NETWORKS: Record<number, NetworkConfig> = {
  11155111: { // Sepolia
    chainId: 11155111,
    name: "Sepolia",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/A33IUFjjL2OZ2LrqMPPmN",
    blockExplorer: "https://sepolia.etherscan.io",
    usdcAddress: "0x8cFb7C6440b4b09a76A85A7D40EE3F7663cDd8A4", // Mint ERC20 USDC CONTRACT ADDRESS
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // Sepolia ETH/USD
    dipSaverAddress: "0xEB7ED48b0380A8e8eDAb2aC53613CfbA028F39cA",
  }
};

export const USDC_DECIMALS = 6;
export const ETH_DECIMALS = 18;
export const PRICE_FEED_DECIMALS = 8; 