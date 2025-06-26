// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import {Test} from "forge-std/Test.sol";
import {DeployDipSaver} from "../../script/DeployDipSaver.s.sol";
import {DipSaver} from "../../src/DipSaver.sol";

contract DeployIntegrationTest is Test {
    function testDeployViaScript() public {
        DeployDipSaver deployer = new DeployDipSaver();
        DipSaver dipSaver = deployer.run();
        uint256 price = dipSaver.getLatestPrice();
        assertGt(price, 0);
    }
}
