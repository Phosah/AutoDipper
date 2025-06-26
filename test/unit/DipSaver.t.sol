// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployDipSaver} from "../../script/DeployDipSaver.s.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.sol";
import {DipSaver, DipSaver__InsufficientDeposit, DipSaver__DipPriceTooLow, DipSaver__PriceNotReached} from "../../src/DipSaver.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Minimal ERC20 for USDC
contract MockUSDC is ERC20 {
    constructor() ERC20("USDC", "USDC") {
        _mint(msg.sender, 1_000_000 ether);
    }
}

contract DipSaverTest is Test {
    DipSaver public dipSaver;
    uint256 constant STARTING_BALANCE = 10 ether;
    MockUSDC usdc;

    function setUp() external {
        MockV3Aggregator mockPriceFeed = new MockV3Aggregator(
            8,
            2000 * 1e8 // 2000 USD per ETH
        );
        usdc = new MockUSDC();
        dipSaver = new DipSaver(address(usdc), address(mockPriceFeed));

        // give test account some USDC
        usdc.transfer(address(this), 10_000 * 1e6);
        // approve contract
        usdc.approve(address(dipSaver), type(uint256).max);
    }

    function testGettingETHUSDPrice() public view {
        uint256 price = dipSaver.getLatestPrice();
        console.log("ETH/USD Price:", price);
        require(price > 0, "Price should be greater than zero");
    }

    function testRevertWhenNoDeposit() public {
        // dipSaver.createDipOrder{value: 1 ether}(2000 * 1e8, 1 ether); // Assuming a deposit of 1 ether
        vm.expectRevert(DipSaver__InsufficientDeposit.selector);
        dipSaver.createDipOrder(2000 * 1e8, 0); // Assuming a deposit of 1000 USDC
    }

    function testRevertWhenZeroPrice() public {
        vm.expectRevert(DipSaver__DipPriceTooLow.selector);
        // dipSaver.createDipOrder(2000 * 1e8, 1000 * 1e6); // Assuming a threshold of 2000
        dipSaver.createDipOrder(0,  1000 * 1e6); // Assuming a threshold of 0
    }

    function testGetLatestPrice() public view {
        uint256 price = dipSaver.getLatestPrice();
        console.log("ETH/USD Price:", price);
        assertEq(price, 2000 * 1e8, "Mock price should be correct");
    }

    function testCreateDipOrder_USDC() public {
        uint256 priceThreshold = 2000 * 1e8;
        uint256 depositUSDC = 2_000 * 1e6;

        dipSaver.createDipOrder(priceThreshold, depositUSDC);

        (address user, uint256 price, uint256 deposit, bool active) = dipSaver
            .getOrder(0);
        assertEq(user, address(this));
        assertEq(price, priceThreshold, "Price should match");
        assertEq(deposit, depositUSDC, "USDC deposit should match");
        assertTrue(active, "Order should be active after creation");
    }

    function testCannotExecuteBeforePriceHit() public {
        uint256 priceThreshold = 1700 * 1e8; // $1,700
        uint256 depositUSDC = 1700 * 1e6; // 1,700 USDC

        dipSaver.createDipOrder(priceThreshold, depositUSDC);
        vm.expectRevert(DipSaver__PriceNotReached.selector);
        dipSaver.executeDipOrder(0);
    }

    function testExecuteDipOrder_USDC() public {
        // uint256 threshold = 1800 * 1e8;
        uint256 threshold = 2000 * 1e18;
        uint256 depositUSDC = 4000 * 1e6;

        dipSaver.createDipOrder(threshold, depositUSDC);

        // Execute when price ≤ threshold
        dipSaver.executeDipOrder(0);

        // After execution: ETH credited
        uint256 ethCredited = dipSaver.ethBalance(address(this));
        console.log("Total ETH credited after buying the dip", ethCredited);
        assertEq(ethCredited, 2 ether);
    }

    function testBuyTwoETHAt2000_USDC() public {
        uint256 threshold = 2000 * 1e18;
        uint256 usdcDeposit = 4000 * 1e6; // 4000 USDC → should buy 2 ETH

        console.log("Creating dip order with threshold:", threshold);
        console.log("USDC deposit:", usdcDeposit);

        dipSaver.createDipOrder(threshold, usdcDeposit);

        (, , uint256 usdcAmt, bool activeBefore) = dipSaver.getOrder(0);
        assertEq(usdcAmt, usdcDeposit);
        assertTrue(activeBefore);

        console.log("Executing dip order...");
        console.log("Usdc amount before execution:", usdcAmt);

        dipSaver.executeDipOrder(0);
        console.log("Dip order executed");
        (, , , bool activeAfter) = dipSaver.getOrder(0);
        assertFalse(activeAfter);
        console.log("Order active after execution:", activeAfter);

        uint256 ethBal = dipSaver.ethBalance(address(this));
        assertEq(ethBal, 2 ether);
    }

    function testRevertWhenPriceAbove() public {
        // Set up a dip order with a price threshold of 1700 USD
        dipSaver.createDipOrder(1700 * 1e8, 1000 * 1e6);
        vm.expectRevert(DipSaver__PriceNotReached.selector);
        dipSaver.executeDipOrder(0);
    }
}
