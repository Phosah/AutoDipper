// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.18;

import {AggregatorV3Interface} from "../lib/chainlink-brownie-contracts/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PriceConverter} from "./PriceConverter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error DipSaver__InsufficientDeposit();
error DipSaver__OrderNotFound();
error DipSaver__DipPriceTooLow();
error DipSaver__PriceNotReached();

/* @title A Contract
 * @author Efosa Uyi-Idahor
 * @notice This contract is a placeholder for a buy the dip saver system.
 * @dev This contract allows users to create dip orders where they can deposit USDC and set a price threshold for ETH.
 */

contract DipSaver {
    address private immutable i_owner;
    uint256 public orderCount;
    AggregatorV3Interface public s_priceFeed;
    IERC20 public immutable i_usdc;

    struct DipOrder {
        address user;
        uint256 priceThreshold;
        uint256 depositUSDC;
        bool active;
    }

    mapping(uint256 => DipOrder) public orders;
    mapping(address => uint256) public ethBalance;

    event DipOrderCreated(
        uint256 indexed id,
        address indexed user,
        uint256 threshold,
        uint256 usdc
    );
    event DipOrderExecuted(
        uint256 orderId,
        address indexed user,
        uint256 ethAmount
    );
    event DipOrderCancelled(uint256 orderId, address indexed user);

    constructor(address usdcAddress, address priceFeedAddress) {
        i_owner = msg.sender;
        i_usdc = IERC20(usdcAddress);
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function createDipOrder(
        uint256 priceThreshold,
        uint256 usdcAmount
    ) external {
        if (usdcAmount == 0) revert DipSaver__InsufficientDeposit();
        if (priceThreshold == 0) revert DipSaver__DipPriceTooLow();

        bool ok = i_usdc.transferFrom(msg.sender, address(this), usdcAmount);
        if (!ok) revert DipSaver__InsufficientDeposit();

        orders[orderCount] = DipOrder(
            msg.sender,
            priceThreshold,
            usdcAmount,
            true
        );

        emit DipOrderCreated(
            orderCount,
            msg.sender,
            priceThreshold,
            usdcAmount
        );
        orderCount++;
    }

    function executeDipOrder(uint256 orderId) external {
        DipOrder storage order = orders[orderId];
        if (order.user != msg.sender || !order.active) {
            revert DipSaver__OrderNotFound();
        }
        uint256 currentPrice = PriceConverter.getPrice(s_priceFeed);
        if (currentPrice > order.priceThreshold) {
            revert DipSaver__PriceNotReached();
        }

        uint256 ethAmount = (order.depositUSDC * 1e20) / currentPrice; // Assuming 1 ETH = 1e20 USDC for simplicity

        ethBalance[order.user] += ethAmount;
        order.active = false;

        emit DipOrderExecuted(orderId, order.user, ethAmount);
    }

    function cancelDipOrder(uint256 orderId) external {
        DipOrder storage order = orders[orderId];
        if (order.user != msg.sender || !order.active) {
            revert DipSaver__OrderNotFound();
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

    function getOrder(
        uint256 orderId
    ) public view returns (address, uint256, uint256, bool) {
        DipOrder memory order = orders[orderId];
        return (
            order.user,
            order.priceThreshold,
            order.depositUSDC,
            order.active
        );
    }
}
