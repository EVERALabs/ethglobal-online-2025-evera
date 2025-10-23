// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {PositionManagerRouter} from "../contracts/modules/PositionManager.sol";
import {PositionRegistry} from "../contracts/PositionRegistry.sol";
import {PositionPool} from "../contracts/PositionPool.sol";
import {MockETH} from "../contracts/mocks/MockETH.sol";
import {MockUSDC} from "../contracts/mocks/MockUSDC.sol";
import {MockLP} from "../contracts/mocks/MockLP.sol";
import {INonfungiblePositionManager} from "../contracts/interfaces/INonfungiblePositionManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {RebalanceType, MintParams} from "../contracts/libraries/Types.sol";

contract PositionManagerRouterTest is Test {
    PositionManagerRouter public positionManager;
    PositionRegistry public positionRegistry;
    MockETH public mockETH;
    MockUSDC public mockUSDC;
    MockLP public mockLP;

    // Mock Uniswap V3 Position Manager (you'll need to deploy or mock this)
    address public mockPositionManager = address(0x123); // Replace with actual mock

    address public user1 = address(0x1);
    address public user2 = address(0x2);

    uint256 public constant INITIAL_ETH_AMOUNT = 10 ether;
    uint256 public constant INITIAL_USDC_AMOUNT = 20000 * 1e6; // 20k USDC

    function setUp() public {
        // Deploy mock tokens
        mockETH = new MockETH();
        mockUSDC = new MockUSDC();

        // Deploy position registry
        positionRegistry = new PositionRegistry(address(this)); // We'll be the manager for testing

        // Deploy position manager router
        positionManager = new PositionManagerRouter(
            INonfungiblePositionManager(mockPositionManager),
            positionRegistry,
            address(mockUSDC),
            address(mockETH)
        );

        // Update registry manager to position manager
        // Note: You might need to add a function to update manager in PositionRegistry

        // Mint tokens to users
        mockETH.mint(user1, INITIAL_ETH_AMOUNT);
        mockUSDC.mint(user1, INITIAL_USDC_AMOUNT);
        mockETH.mint(user2, INITIAL_ETH_AMOUNT);
        mockUSDC.mint(user2, INITIAL_USDC_AMOUNT);

        // Setup approvals
        vm.startPrank(user1);
        mockETH.approve(address(positionManager), type(uint256).max);
        mockUSDC.approve(address(positionManager), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(user2);
        mockETH.approve(address(positionManager), type(uint256).max);
        mockUSDC.approve(address(positionManager), type(uint256).max);
        vm.stopPrank();
    }

    function testCreatePosition() public {
        uint256 ethAmount = 1 ether;
        uint256 usdcAmount = 2000 * 1e6;

        vm.startPrank(user1);

        // Check initial balances
        assertEq(mockETH.balanceOf(user1), INITIAL_ETH_AMOUNT);
        assertEq(mockUSDC.balanceOf(user1), INITIAL_USDC_AMOUNT);

        // Create position
        positionManager.createPosition(ethAmount, usdcAmount);

        // Check balances after position creation
        assertEq(mockETH.balanceOf(user1), INITIAL_ETH_AMOUNT - ethAmount);
        assertEq(mockUSDC.balanceOf(user1), INITIAL_USDC_AMOUNT - usdcAmount);

        // Check position balance mapping
        (
            address owner,
            uint256 amount0,
            uint256 amount1,
            uint256 ltv,
            address pool,
            uint256 tokenId
        ) = positionManager.tokenIdToPositionBalance(1);

        assertEq(owner, user1);
        assertEq(amount0, ethAmount);
        assertEq(amount1, usdcAmount);
        assertEq(ltv, 0);
        assertNotEq(pool, address(0));
        assertEq(tokenId, 1);

        // Check NFT was minted
        assertEq(positionRegistry.ownerOf(1), user1);

        vm.stopPrank();
    }

    function testCreatePositionEmitsEvent() public {
        uint256 ethAmount = 1 ether;
        uint256 usdcAmount = 2000 * 1e6;

        vm.startPrank(user1);

        // Expect PositionCreated event
        vm.expectEmit(true, true, true, true);
        emit PositionManagerRouter.PositionCreated(
            user1,
            1,
            ethAmount,
            usdcAmount
        );

        positionManager.createPosition(ethAmount, usdcAmount);

        vm.stopPrank();
    }

    function testMultipleUsersCreatePositions() public {
        uint256 ethAmount = 1 ether;
        uint256 usdcAmount = 2000 * 1e6;

        // User 1 creates position
        vm.startPrank(user1);
        positionManager.createPosition(ethAmount, usdcAmount);
        vm.stopPrank();

        // User 2 creates position
        vm.startPrank(user2);
        positionManager.createPosition(ethAmount * 2, usdcAmount * 2);
        vm.stopPrank();

        // Check both positions exist
        assertEq(positionRegistry.ownerOf(1), user1);
        assertEq(positionRegistry.ownerOf(2), user2);

        // Check position balances
        (, uint256 user1Amount0, uint256 user1Amount1, , , ) = positionManager
            .tokenIdToPositionBalance(1);
        (, uint256 user2Amount0, uint256 user2Amount1, , , ) = positionManager
            .tokenIdToPositionBalance(2);

        assertEq(user1Amount0, ethAmount);
        assertEq(user1Amount1, usdcAmount);
        assertEq(user2Amount0, ethAmount * 2);
        assertEq(user2Amount1, usdcAmount * 2);
    }

    function testCalculateTickRange() public view {
        // This is an internal function, so we'd need to create a wrapper or make it public for testing
        // For now, we can test the logic indirectly through _mint function
        // Test different rebalance types
        // LOW: ±15 tick spacing
        // MEDIUM: ±60 tick spacing
        // You would need to expose calculateTickRange or create a test wrapper
    }

    function testFailCreatePositionWithZeroAmount() public {
        vm.startPrank(user1);

        // Should fail with zero amounts
        vm.expectRevert();
        positionManager.createPosition(0, 0);

        vm.stopPrank();
    }

    function testFailCreatePositionInsufficientBalance() public {
        vm.startPrank(user1);

        // Try to create position with more than available balance
        vm.expectRevert();
        positionManager.createPosition(
            INITIAL_ETH_AMOUNT + 1,
            INITIAL_USDC_AMOUNT + 1
        );

        vm.stopPrank();
    }

    // Helper function to create a position for testing
    function _createTestPosition(
        address user,
        uint256 ethAmount,
        uint256 usdcAmount
    ) internal returns (uint256 tokenId) {
        vm.startPrank(user);
        positionManager.createPosition(ethAmount, usdcAmount);
        vm.stopPrank();

        // Return the latest token ID (assuming incremental)
        return positionManager.tokenId();
    }

    // Test helper functions
    function testHelperCreatePosition() public {
        uint256 tokenId = _createTestPosition(user1, 1 ether, 2000 * 1e6);
        assertEq(tokenId, 1);
        assertEq(positionRegistry.ownerOf(tokenId), user1);
    }
}
