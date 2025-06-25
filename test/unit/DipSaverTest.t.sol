// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DipSaver} from "../../src/DipSaver.sol";
import {DeployDipSaver} from "../../script/DeployDipSaver.s.sol";

contract DipSaverTest is Test {
    DipSaver dipSaver;
    address USER = makeAddr("user");
    // uint256 constant SEND_VALUE = 0.1 ether;
    uint256 constant STARTING_BALANCE = 10 ether;

    function setUp() external {
        DeployDipSaver deployDipSaver = new DeployDipSaver();
        dipSaver = deployDipSaver.run();
        vm.deal(USER, STARTING_BALANCE);
    }

    function testGettingETHUSDPrice() public view {
        // This test is just to check if the price feed is working correctly
        // It will not actually run any transactions, so it won't cost gas
        uint256 price = dipSaver.getLatestPrice();
        console.log("ETH/USD Price:", price);
        require(price > 0, "Price should be greater than zero");
    }

    // function testFundFailsWithoutEnoughETH() public {
    //     vm.expectRevert();
    //     fundMe.fund();
    // }

    // function testFundUpdatesFundedDataStructure() public {
    //     vm.prank(USER);
    //     fundMe.fund{value: SEND_VALUE}();
    //     uint256 amountFunded = fundMe.getAddressToAmountFunded(USER);
    //     assertEq(amountFunded, SEND_VALUE);
    // }

    // function testAddsFunderToArrayOfFunders() public {
    //     vm.prank(USER);
    //     fundMe.fund{value: SEND_VALUE}();

    //     address funder = fundMe.getFunder(0);
    //     assertEq(funder, USER);
    // }

    // modifier funded() {
    //     vm.prank(USER);
    //     fundMe.fund{value: SEND_VALUE}();
    //     _;
    // }

    // function testOnlyOwnerCanWithdraw() public funded {
    //     vm.expectRevert();
    //     vm.prank(USER);
    //     fundMe.withdraw();
    // }

    // function testWithdrawWithASingleFunder() public funded {
    //     // Arrange
    //     uint256 startingOwnerBalance = fundMe.getOwner().balance;
    //     uint256 startingFundMeBalance = address(fundMe).balance;

    //     // Act
    //     vm.prank(fundMe.getOwner());
    //     fundMe.withdraw();

    //     // Assert
    //     uint256 endingOwnerBalance = fundMe.getOwner().balance;
    //     uint256 endingFundMeBalance = address(fundMe).balance;
    //     assertEq(endingFundMeBalance, 0);
    //     assertEq(
    //         startingFundMeBalance + startingOwnerBalance,
    //         endingOwnerBalance
    //     );
    // }

    // function testWithdrawFromMultipleFunders() public funded {
    //     uint160 numberOfFunders = 10;
    //     uint160 startingFunderIndex = 1;
    //     for (uint160 i = startingFunderIndex; i < numberOfFunders; i++) {
    //         hoax(address(i), SEND_VALUE);
    //         fundMe.fund{value: SEND_VALUE}();
    //     }

    //     uint256 startingOwnerBalance = fundMe.getOwner().balance;
    //     uint256 startingFundMeBalance = address(fundMe).balance;

    //     vm.startPrank(fundMe.getOwner());
    //     fundMe.withdraw();
    //     vm.stopPrank();

    //     assert(address(fundMe).balance == 0);
    //     assert(
    //         startingFundMeBalance + startingOwnerBalance ==
    //             fundMe.getOwner().balance
    //     );
    // }

    // function testWithdrawFromMultipleFundersCheaper() public funded {
    //     uint160 numberOfFunders = 10;
    //     uint160 startingFunderIndex = 1;
    //     for (uint160 i = startingFunderIndex; i < numberOfFunders; i++) {
    //         hoax(address(i), SEND_VALUE);
    //         fundMe.fund{value: SEND_VALUE}();
    //     }

    //     uint256 startingOwnerBalance = fundMe.getOwner().balance;
    //     uint256 startingFundMeBalance = address(fundMe).balance;

    //     vm.startPrank(fundMe.getOwner());
    //     fundMe.cheaperWithdraw();
    //     vm.stopPrank();

    //     assert(address(fundMe).balance == 0);
    //     assert(
    //         startingFundMeBalance + startingOwnerBalance ==
    //             fundMe.getOwner().balance
    //     );
    // }
}
