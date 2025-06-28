// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {Script} from "forge-std/Script.sol";
import {DipSaver} from "../src/DipSaver.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Minimal ERC20 for local USDC
contract MockUSDC is ERC20 {
    constructor() ERC20("USDC", "USDC") {
        _mint(msg.sender, 1_000_000 ether);
    }
}

contract DeployDipSaver is Script {
    function run() external returns (DipSaver) {
        HelperConfig helperConfig = new HelperConfig();
        address priceFeed = helperConfig.activeNetworkConfig();
        address usdcAddress;

        if (block.chainid == 1) {
            // Mainnet: real USDC contract
            usdcAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
        } else if (block.chainid == 11155111) {
            // Sepolia: using our deployed MockUSDC contract
            usdcAddress = 0x97c633D7d9BE2C69758Add299371662C350aaAe4;
        } else {
            // Local Anvil: deploy a mock USDC
            MockUSDC mock = new MockUSDC();
            usdcAddress = address(mock);
        }

        vm.startBroadcast();
        DipSaver dipSaver = new DipSaver(usdcAddress, priceFeed);
        vm.stopBroadcast();

        return dipSaver;
    }
}
