// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DipSaver} from "../src/DipSaver.sol";

contract DipSaverTest is Test {
    DipSaver public dipSaver;

    function setUp() public {
        dipSaver = new DipSaver();
    }

    function testCreateDipOrder() public {
        uint256 dipPriceUSD = 2000 * 1e8; // Example price threshold in USD * 1e8
        dipSaver.createDipOrder(dipPriceUSD);
        console.log("Order Count after creation:", dipSaver.orderCount());

        assertEq(
            dipSaver.orderCount(),
            1,
            "Order count should be 1 after creation"
        );

        (address user, uint256 price, bool active) = dipSaver.orders(0);
        console.log("User:", user);
        assertEq(user, address(this), "User should be the contract address");
        assertEq(
            price,
            dipPriceUSD,
            "Dip price should match the created order price"
        );
        assertTrue(active, "Order should be active after creation");
    }
}
