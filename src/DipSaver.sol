// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.18;

import {AggregatorV3Interface} from "../lib/chainlink-brownie-contracts/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import {VRFCoordinatorV2_5Mock} from "../lib/chainlink-brownie-contracts/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2_5Mock.sol";
import {PriceConverter} from "./PriceConverter.sol";

// Errors
error DipSaver_InsufficientDeposit();
error DipSaver_OrderNotFound();

// error DipSaver_InsufficientBalance();

// using PriceConverter for uint256;

/* @title A  Dip Saver Contract
 * @author Efosa Uyi-Idahor
 * @notice This contract is a placeholder for a buy the dip saver system.
 * @dev Implements Chainlink VRF2.5
 */

contract DipSaver {
    address private immutable i_owner;
    uint256 public orderCount;
    AggregatorV3Interface public s_priceFeed;

    struct DipOrder {
        address user;
        uint256 dipPriceUSD; // Example price threshold in USD * 1e8
        bool active;
    }

    mapping(uint256 => DipOrder) public orders;

    event DipOrderCreated(
        uint256 orderId,
        address indexed user,
        uint256 dipPriceUSD
    );
    event DipOrderCancelled(uint256 orderId, address indexed user);

    // User sets a "dip" price for a token (e.g., ETH < $2000)
    // Contract monitors price using Chainlink Price Feeds
    // If price drops below threshold, action occurs (buy, notify, etc.)
    // Optional: Use Chainlink Automation to automate monitoring

    // Handle user deposits
    // Record target price
    // Integrate Chainlink Price Feeds
    // Mock swap logic for demo (since on-chain DEX is advanced)

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function createDipOrder(uint256 dipPriceUSD) external {
        if (dipPriceUSD == 0) {
            revert DipSaver_InsufficientDeposit();
        }
        orders[orderCount] = DipOrder(msg.sender, dipPriceUSD, true);

        // Emit an event for the new order
        emit DipOrderCreated(orderCount, msg.sender, dipPriceUSD);
        orderCount++;
    }

    function cancelDipOrder(uint256 orderId) external {
        DipOrder storage order = orders[orderId];
        if (order.user != msg.sender || !order.active) {
            revert DipSaver_OrderNotFound();
        }
        order.active = false;

        emit DipOrderCancelled(orderId, msg.sender);
    }

    function getOrders() public view returns (DipOrder[] memory) {
        DipOrder[] memory activeOrders = new DipOrder[](orderCount);
        for (uint256 i = 0; i < orderCount; i++) {
            activeOrders[i] = orders[i];
        }
        return activeOrders;
    }

    function getLatestPrice() public view returns (uint256) {
        return PriceConverter.getPrice(s_priceFeed);
    }
}
