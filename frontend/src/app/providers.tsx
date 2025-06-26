"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";

// Configure only MetaMask
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet],
    },
  ],
  {
    appName: "AutoDipper",
    projectId: "dummy", // Not needed for MetaMask only
  }
);

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors,
  ssr: true,
});

// Create a client for React Query
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// "use client";

// import { WagmiProvider, createConfig, http } from "wagmi";
// import { sepolia } from "wagmi/chains";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { metaMask, walletConnect } from "wagmi/connectors";
// import "@rainbow-me/rainbowkit/styles.css";

// // Create wagmi config with MetaMask and WalletConnect
// const config = createConfig({
//   chains: [sepolia],
//   transports: {
//     [sepolia.id]: http(),
//   },
//   connectors: [
//     metaMask(),
//     walletConnect({
//       projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Replace with your actual project ID
//     }),
//   ],
//   ssr: true,
// });

// // Create a client for React Query
// const queryClient = new QueryClient();

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider>{children}</RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }
