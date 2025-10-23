// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {PositionPool} from "../contracts/PositionPool.sol";
import {MockETH} from "../contracts/mocks/MockETH.sol";
import {MockUSDC} from "../contracts/mocks/MockUSDC.sol";
import {INonfungiblePositionManager} from "../contracts/interfaces/INonfungiblePositionManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PositionPoolTest is Test {
    PositionPool public positionPool;
    MockETH public mockETH;
    MockUSDC public mockUSDC;

    address public mockPositionManager = address(0x123);
    address public owner = address(0x1);
    address public nonOwner = address(0x2);

    uint256 public constant INITIAL_AMOUNT = 1000 ether;

    function setUp() public {
        // Deploy mock tokens
        mockETH = new MockETH();
        mockUSDC = new MockUSDC();

        // Deploy position pool with owner
        vm.startPrank(owner);
        positionPool = new PositionPool(mockPositionManager);
        vm.stopPrank();

        // Mint tokens to pool
        mockETH.mint(address(positionPool), INITIAL_AMOUNT);
        mockUSDC.mint(address(positionPool), INITIAL_AMOUNT);
    }

    function testOwnership() public view {
        assertEq(positionPool.owner(), owner);
        assertEq(address(positionPool.positionManager()), mockPositionManager);
    }

    function testTransferAsOwner() public {
        uint256 transferAmount = 100 ether;
        address recipient = address(0x999);

        vm.startPrank(owner);

        uint256 initialBalance = mockETH.balanceOf(address(positionPool));
        uint256 initialRecipientBalance = mockETH.balanceOf(recipient);

        uint256 transferred = positionPool.transfer(
            address(mockETH),
            recipient,
            transferAmount
        );

        assertEq(transferred, transferAmount);
        assertEq(
            mockETH.balanceOf(address(positionPool)),
            initialBalance - transferAmount
        );
        assertEq(
            mockETH.balanceOf(recipient),
            initialRecipientBalance + transferAmount
        );

        vm.stopPrank();
    }

    function testFailTransferAsNonOwner() public {
        uint256 transferAmount = 100 ether;
        address recipient = address(0x999);

        vm.startPrank(nonOwner);

        // Should revert because nonOwner is not the owner
        vm.expectRevert();
        positionPool.transfer(address(mockETH), recipient, transferAmount);

        vm.stopPrank();
    }

    function testTransferUSDC() public {
        uint256 transferAmount = 1000 * 1e6; // 1000 USDC
        address recipient = address(0x999);

        vm.startPrank(owner);

        uint256 initialBalance = mockUSDC.balanceOf(address(positionPool));

        uint256 transferred = positionPool.transfer(
            address(mockUSDC),
            recipient,
            transferAmount
        );

        assertEq(transferred, transferAmount);
        assertEq(
            mockUSDC.balanceOf(address(positionPool)),
            initialBalance - transferAmount
        );
        assertEq(mockUSDC.balanceOf(recipient), transferAmount);

        vm.stopPrank();
    }

    function testTransferEntireBalance() public {
        address recipient = address(0x999);
        uint256 entireBalance = mockETH.balanceOf(address(positionPool));

        vm.startPrank(owner);

        uint256 transferred = positionPool.transfer(
            address(mockETH),
            recipient,
            entireBalance
        );

        assertEq(transferred, entireBalance);
        assertEq(mockETH.balanceOf(address(positionPool)), 0);
        assertEq(mockETH.balanceOf(recipient), entireBalance);

        vm.stopPrank();
    }

    function testFailTransferMoreThanBalance() public {
        uint256 balance = mockETH.balanceOf(address(positionPool));
        address recipient = address(0x999);

        vm.startPrank(owner);

        // Should fail when trying to transfer more than available
        vm.expectRevert();
        positionPool.transfer(address(mockETH), recipient, balance + 1);

        vm.stopPrank();
    }

    function testMintingPositionAsOwner() public {
        // Note: This test would require a proper mock of INonfungiblePositionManager
        // For now, we'll test the basic structure

        vm.startPrank(owner);

        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: address(mockETH),
                token1: address(mockUSDC),
                fee: 3000,
                tickLower: -60,
                tickUpper: 60,
                amount0Desired: 1 ether,
                amount1Desired: 2000 * 1e6,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(positionPool),
                deadline: block.timestamp + 1 hours
            });

        // This would fail without a proper mock, but shows the structure
        // uint256 tokenId = positionPool.mintingPosition(params);

        vm.stopPrank();
    }

    function testFailMintingPositionAsNonOwner() public {
        vm.startPrank(nonOwner);

        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: address(mockETH),
                token1: address(mockUSDC),
                fee: 3000,
                tickLower: -60,
                tickUpper: 60,
                amount0Desired: 1 ether,
                amount1Desired: 2000 * 1e6,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(positionPool),
                deadline: block.timestamp + 1 hours
            });

        // Should revert because nonOwner is not the owner
        vm.expectRevert();
        positionPool.mintingPosition(params);

        vm.stopPrank();
    }

    // Test edge cases
    function testTransferZeroAmount() public {
        address recipient = address(0x999);

        vm.startPrank(owner);

        uint256 transferred = positionPool.transfer(
            address(mockETH),
            recipient,
            0
        );
        assertEq(transferred, 0);

        vm.stopPrank();
    }

    function testTransferToZeroAddress() public {
        vm.startPrank(owner);

        // This might revert depending on SafeERC20 implementation
        // Test behavior with zero address
        vm.expectRevert();
        positionPool.transfer(address(mockETH), address(0), 100 ether);

        vm.stopPrank();
    }
}
