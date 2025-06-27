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
            // USDC / USD address from chainlink data feeds: 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6

            // Mainnet
            usdcAddress = 0x8cFb7C6440b4b09a76A85A7D40EE3F7663cDd8A4;
        } else if (block.chainid == 11155111) {
            // Sepolia: using real USDC contract from price feeds
            usdcAddress = 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E;
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
