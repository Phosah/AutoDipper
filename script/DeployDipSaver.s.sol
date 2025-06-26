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
            // Mainnet: use the *real* USDC contract
            usdcAddress = 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6;
        } else if (block.chainid == 11155111) {
            // Sepolia: use the *real* USDC contract
            usdcAddress = 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E;
        } else {
            // Local Anvil: deploy a mock USDC
            MockUSDC mock = new MockUSDC();
            usdcAddress = address(mock);
        }

        // Deploy the DipSaver contract
        vm.startBroadcast();
        DipSaver dipSaver = new DipSaver(usdcAddress, priceFeed);
        vm.stopBroadcast();

        return dipSaver;
    }
}
