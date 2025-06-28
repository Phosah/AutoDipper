# 🚀 AutoDipper: Automated "Buy the Dip" Smart Contract

> **Automated ETH purchasing when prices drop to your target levels using Chainlink price feeds**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.18-blue.svg)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Foundry-Latest-orange.svg)](https://getfoundry.sh/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Chainlink](https://img.shields.io/badge/Chainlink-Price%20Feeds-blue.svg)](https://chain.link/)

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Smart Contract Setup](#-smart-contract-setup)
- [Frontend Setup](#-frontend-setup)
- [Deployment](#-deployment)
- [Usage](#-usage)
- [Challenges & Solutions](#-challenges--solutions)
- [Chainlink Integration](#-chainlink-integration)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

AutoDipper is a decentralized application that automatically buys ETH when prices drop to user-defined thresholds. It uses Chainlink's decentralized oracle network to get real-time ETH/USD price data and executes trades automatically when conditions are met.

### The Problem
- Crypto markets are volatile and move 24/7
- Most people can't monitor markets constantly
- Emotional trading leads to poor decisions
- Manual trading requires significant time investment

### The Solution
- Automated "buy the dip" strategies using smart contracts
- Real-time price monitoring via Chainlink oracles
- Emotion-free, consistent execution
- 24/7 operation without human intervention

## ✨ Features

- 🔄 **Automated Trading**: Set price targets and let smart contracts execute trades
- 📊 **Real-time Price Feeds**: Chainlink oracles provide tamper-proof price data
- 💰 **USDC Integration**: Use stablecoins for predictable trading
- 🛡️ **Transparent Execution**: All trades visible on blockchain
- ⚡ **Gas Optimized**: Efficient smart contract design
- 🌐 **Cross-platform**: Works on any device with web3 wallet
- 🔒 **Secure**: No counterparty risk, direct smart contract interaction

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   Chainlink     │
│   (Next.js)     │◄──►│   Contracts     │◄──►│   Price Feeds   │
│                 │    │   (Foundry)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web3 Wallet   │    │   MockUSDC      │    │   Sepolia       │
│   (RainbowKit)  │    │   (ERC-20)      │    │   Testnet       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack

**Smart Contracts:**
- Solidity 0.8.18
- Foundry framework
- Chainlink Price Feeds
- OpenZeppelin contracts

**Frontend:**
- Next.js 14
- TypeScript
- wagmi v2
- RainbowKit
- Tailwind CSS

**Deployment:**
- Sepolia testnet
- Alchemy RPC
- Foundry deployment scripts

## 📋 Prerequisites

- Node.js 18+ 
- Foundry (latest)
- Git
- MetaMask or other Web3 wallet
- Sepolia testnet ETH

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/AutoDipper.git
cd AutoDipper
```

### 2. Install Dependencies

```bash
# Install Foundry dependencies
forge install

# Install frontend dependencies
cd frontend
npm install
```

### 3. Environment Setup

Create environment files:

```bash
# Root directory
cp .env.example .env

# Frontend directory
cd frontend
cp .env.example .env.local
```

## 🔧 Smart Contract Setup

### 1. Foundry Configuration

The project uses Foundry for smart contract development. Key configuration in `foundry.toml`:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = [
    "@chainlink/contracts/=lib/chainlink-brownie-contracts/contracts/",
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/"
]
```

### 2. Chainlink Integration

The project integrates Chainlink price feeds through:

- `AggregatorV3Interface` for price data
- `PriceConverter` library for price calculations
- Sepolia ETH/USD price feed address

### 3. Contract Structure

```
src/
├── DipSaver.sol          # Main contract
├── PriceConverter.sol    # Price conversion library
└── MockUSDC.sol          # Test USDC token
```

## 🌐 Frontend Setup

### 1. Configuration

Update `frontend/src/types/index.ts` with your deployed contract addresses:

```typescript
export const NETWORKS = {
  11155111: { // Sepolia
    dipSaverAddress: "0x...", // Your deployed DipSaver address
    usdcAddress: "0x...",     // Your deployed MockUSDC address
    priceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306" // Sepolia ETH/USD
  }
};
```

### 2. Environment Variables

```bash
# frontend/.env.local
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id
```

### 3. Web3 Configuration

The frontend uses:
- **wagmi v2** for Web3 interactions
- **RainbowKit** for wallet connection
- **Viem** for blockchain interactions

## 🚀 Deployment

### 1. Smart Contract Deployment

#### Using Foundry Scripts

```bash
# Deploy MockUSDC
forge script script/DeployMockUSDC.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify

# Deploy DipSaver
forge script script/DeployDipSaver.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

#### Manual Deployment

```bash
# Deploy MockUSDC
forge create MockUSDC --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY

# Deploy DipSaver (requires MockUSDC address)
forge create DipSaver --constructor-args $MOCK_USDC_ADDRESS $PRICE_FEED_ADDRESS --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

### 2. Frontend Deployment

```bash
cd frontend
npm run build
npm run start
```

### 3. Environment Variables for Deployment

```bash
# .env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## 📖 Usage

### 1. Connect Wallet

1. Visit the AutoDipper frontend
2. Click "Connect Wallet" 
3. Approve the connection in your wallet
4. Ensure you're on Sepolia testnet

### 2. Get Test Tokens

```bash
# Mint MockUSDC tokens
cast send $MOCK_USDC_ADDRESS "mint(address,uint256)" $YOUR_ADDRESS 1000000000000000000000 --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

### 3. Create Dip Orders

1. Set your price threshold (e.g., $2200)
2. Enter USDC amount (e.g., 1000 USDC)
3. Click "Create Order"
4. Approve USDC spending
5. Confirm transaction

### 4. Monitor Orders

- View active orders in the dashboard
- See real-time ETH price from Chainlink
- Monitor order execution status

### 5. Execute Orders

- Orders execute automatically when ETH price drops below threshold
- Manual execution also available
- Cancel orders anytime

## 🐛 Challenges & Solutions

### 1. Chainlink Contract Integration

**Problem**: Difficulty importing Chainlink contracts and setting up remappings.

**Solution**: 
- Downloaded Chainlink contracts locally using Foundry
- Set up proper remappings in `foundry.toml`
- Used correct import paths for AggregatorV3Interface

### 2. OpenZeppelin Version Conflicts

**Problem**: Version conflicts between OpenZeppelin and Chainlink dependencies.

**Solution**:
- Standardized on OpenZeppelin 5.0.1
- Updated all contracts to use Solidity 0.8.18
- Resolved pragma version conflicts

### 3. Frontend-Backend Integration

**Problem**: Breaking changes when migrating from wagmi v1 to v2.

**Solution**:
- Updated to use `useReadContract` and `useWriteContract`
- Implemented `usePublicClient` for manual contract calls
- Added proper error handling and loading states

### 4. USDC Decimal Mismatch

**Problem**: Frontend expected 6 decimals but MockUSDC used 18 decimals.

**Solution**:
- Standardized on 18 decimals for consistency
- Updated frontend formatting functions
- Added clear documentation about decimal handling

### 5. Transaction Confirmation Issues

**Problem**: Transactions not showing on Etherscan and frontend not receiving confirmations.

**Solution**:
- Switched to Alchemy RPC for better reliability
- Implemented proper transaction waiting
- Added comprehensive error handling and logging

### 6. Contract Address Synchronization

**Problem**: Contract addresses hardcoded in multiple places causing mismatches.

**Solution**:
- Created centralized configuration in `types/index.ts`
- Implemented network-based address management
- Added address validation and error handling

### 7. Order Loading & State Management

**Problem**: Orders not loading automatically when users connect wallets.

**Solution**:
- Implemented `useEffect` hooks for automatic loading
- Added proper dependency arrays
- Created comprehensive error handling for order fetching

## 🔗 Chainlink Integration

### Files Using Chainlink

1. **`src/DipSaver.sol`** - Main contract using Chainlink price feeds
2. **`src/PriceConverter.sol`** - Library for processing Chainlink price data
3. **`lib/chainlink-brownie-contracts/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol`** - Chainlink interface
4. **`frontend/src/hooks/useDipSaver.ts`** - Frontend integration with Chainlink data

### How Chainlink is Used

```solidity
// Get real-time ETH/USD price
uint256 currentPrice = PriceConverter.getPrice(s_priceFeed);

// Execute order when price drops below threshold
if (currentPrice <= order.priceThreshold) {
    // Execute trade
    // Update user balances
    // Emit events
}
```

### Price Feed Addresses

- **Sepolia ETH/USD**: `0x694AA1769357215DE4FAC081bf1f309aDC325306`
- **Mainnet ETH/USD**: `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`

## 🧪 Testing

### Smart Contract Tests

```bash
# Run all tests
forge test

# Run specific test
forge test --match-test testCreateDipOrder

# Run with verbose output
forge test -vvv
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing

1. Deploy contracts to Sepolia
2. Mint test USDC tokens
3. Create dip orders with different price thresholds
4. Monitor order execution
5. Test order cancellation

## 🔧 Development Commands

### Foundry Commands

```bash
# Compile contracts
forge build

# Run tests
forge test

# Deploy contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast

# Get contract ABI
forge inspect DipSaver abi

# Verify contracts
forge verify-contract $CONTRACT_ADDRESS src/DipSaver.sol:DipSaver --chain-id 11155111
```

### Frontend Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Cast Wallet Commands

```bash
# Check ETH balance
cast balance $ADDRESS --rpc-url $SEPOLIA_RPC_URL

# Check USDC balance
cast call $MOCK_USDC_ADDRESS "balanceOf(address)" $ADDRESS --rpc-url $SEPOLIA_RPC_URL

# Mint USDC tokens
cast send $MOCK_USDC_ADDRESS "mint(address,uint256)" $ADDRESS 1000000000000000000000 --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY

# Create dip order
cast send $DIP_SAVER_ADDRESS "createDipOrder(uint256,uint256)" 220000000000 1000000000000000000000 --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

## 📁 Project Structure

```
AutoDipper/
├── src/                          # Smart contracts
│   ├── DipSaver.sol             # Main contract
│   ├── PriceConverter.sol       # Price conversion library
│   └── MockUSDC.sol             # Test USDC token
├── script/                       # Deployment scripts
│   ├── DeployMockUSDC.s.sol     # MockUSDC deployment
│   └── DeployDipSaver.s.sol     # DipSaver deployment
├── test/                         # Smart contract tests
├── frontend/                     # Next.js frontend
│   ├── src/
│   │   ├── app/                 # Next.js app directory
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Utility functions
│   ├── public/                  # Static assets
│   └── package.json
├── lib/                          # Foundry dependencies
├── foundry.toml                  # Foundry configuration
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Solidity style guide
- Write comprehensive tests
- Update documentation
- Use conventional commits
- Test on Sepolia before mainnet

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Chainlink](https://chain.link/) for decentralized oracle network
- [Foundry](https://getfoundry.sh/) for smart contract development framework
- [Next.js](https://nextjs.org/) for frontend framework
- [wagmi](https://wagmi.sh/) for Web3 React hooks
- [RainbowKit](https://www.rainbowkit.com/) for wallet connection

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/AutoDipper/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/AutoDipper/discussions)
- **Documentation**: [Project Wiki](https://github.com/yourusername/AutoDipper/wiki)

---

**Built with ❤️ using Chainlink, Foundry, and Next.js**
