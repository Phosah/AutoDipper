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
  orders: DipOrder[];
  onExecute: (orderId: number) => void;
  onCancel: (orderId: number) => void;
}

export interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}
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


export const NETWORKS: Record<number, NetworkConfig> = {
  11155111: { // Sepolia
    chainId: 11155111,
    name: "Sepolia",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/A33IUFjjL2OZ2LrqMPPmN",
    blockExplorer: "https://sepolia.etherscan.io",
    usdcAddress: "0x97c633D7d9BE2C69758Add299371662C350aaAe4", // New MockUSDC contract
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // Sepolia ETH/USD
    dipSaverAddress: "0x5c932e86516b501CF1072E206d2B8052B135500F", // New DipSaver contract
  }
};

export const USDC_DECIMALS = 18;
export const ETH_DECIMALS = 18;
export const PRICE_FEED_DECIMALS = 8;

// Token Configuration
export interface TokenConfig {
  symbol: string;
  name: string;
  address: string;
  priceFeedAddress: string;
  decimals: number;
}