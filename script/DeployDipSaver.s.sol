// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {DipSaver} from "../src/DipSaver.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployDipSaver is Script {
    function run() external returns (DipSaver) {
        HelperConfig helperConfig = new HelperConfig();
        address ethUsdPriceFeed = helperConfig.activeNetworkConfig();

        vm.startBroadcast();
        DipSaver dipSaver = new DipSaver(ethUsdPriceFeed);
        vm.stopBroadcast();
        return dipSaver;
    }
}
