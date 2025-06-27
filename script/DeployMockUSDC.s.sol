// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import {MockUSDC} from '../src/MockUSDC.sol';


contract DeployMockUSDC is Script {
    function run() external {
        vm.startBroadcast();
        MockUSDC usdc = new MockUSDC();
        // Mint 10,000 USDC (with 6 decimals) to your wallet
        usdc.mint(msg.sender, 10_000 * 1e6);
        vm.stopBroadcast();
    }
}