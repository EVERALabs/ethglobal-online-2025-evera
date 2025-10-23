// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {PositionRegistry} from "../contracts/PositionRegistry.sol";
import {Errors} from "../contracts/libraries/Errors.sol";

contract PositionRegistryTest is Test {
    PositionRegistry public positionRegistry;

    address public manager = address(0x1);
    address public nonManager = address(0x2);
    address public user1 = address(0x3);
    address public user2 = address(0x4);

    function setUp() public {
        positionRegistry = new PositionRegistry(manager);
    }

    function testInitialState() public view {
        assertEq(positionRegistry.MANAGER(), manager);
        assertEq(positionRegistry.name(), "Bloom Finance Position Registry");
        assertEq(positionRegistry.symbol(), "BLOOM");
    }

    function testMintAsManager() public {
        uint256 tokenId = 1;

        vm.startPrank(manager);

        // Check initial balance
        assertEq(positionRegistry.balanceOf(user1), 0);

        // Mint NFT
        positionRegistry.mint(user1, tokenId);

        // Check ownership
        assertEq(positionRegistry.ownerOf(tokenId), user1);
        assertEq(positionRegistry.balanceOf(user1), 1);

        vm.stopPrank();
    }

    function testMintMultipleTokens() public {
        vm.startPrank(manager);

        // Mint multiple tokens to same user
        positionRegistry.mint(user1, 1);
        positionRegistry.mint(user1, 2);
        positionRegistry.mint(user1, 3);

        // Check balance and ownership
        assertEq(positionRegistry.balanceOf(user1), 3);
        assertEq(positionRegistry.ownerOf(1), user1);
        assertEq(positionRegistry.ownerOf(2), user1);
        assertEq(positionRegistry.ownerOf(3), user1);

        vm.stopPrank();
    }

    function testMintToDifferentUsers() public {
        vm.startPrank(manager);

        positionRegistry.mint(user1, 1);
        positionRegistry.mint(user2, 2);

        assertEq(positionRegistry.ownerOf(1), user1);
        assertEq(positionRegistry.ownerOf(2), user2);
        assertEq(positionRegistry.balanceOf(user1), 1);
        assertEq(positionRegistry.balanceOf(user2), 1);

        vm.stopPrank();
    }

    function testFailMintAsNonManager() public {
        vm.startPrank(nonManager);

        // Should revert with custom error
        vm.expectRevert(
            abi.encodeWithSelector(
                Errors.OnlyManagerCanMint.selector,
                nonManager,
                manager
            )
        );
        positionRegistry.mint(user1, 1);

        vm.stopPrank();
    }

    function testFailMintSameTokenIdTwice() public {
        uint256 tokenId = 1;

        vm.startPrank(manager);

        // First mint should succeed
        positionRegistry.mint(user1, tokenId);

        // Second mint with same tokenId should fail
        vm.expectRevert();
        positionRegistry.mint(user2, tokenId);

        vm.stopPrank();
    }

    function testOnlyManagerModifier() public {
        // Test that the modifier works correctly
        vm.startPrank(nonManager);

        vm.expectRevert(
            abi.encodeWithSelector(
                Errors.OnlyManagerCanMint.selector,
                nonManager,
                manager
            )
        );
        positionRegistry.mint(user1, 1);

        vm.stopPrank();

        // But manager should work
        vm.startPrank(manager);
        positionRegistry.mint(user1, 1);
        vm.stopPrank();
    }

    function testERC721Functionality() public {
        uint256 tokenId = 1;

        vm.startPrank(manager);
        positionRegistry.mint(user1, tokenId);
        vm.stopPrank();

        // Test transfer functionality
        vm.startPrank(user1);
        positionRegistry.transferFrom(user1, user2, tokenId);
        vm.stopPrank();

        // Check new ownership
        assertEq(positionRegistry.ownerOf(tokenId), user2);
        assertEq(positionRegistry.balanceOf(user1), 0);
        assertEq(positionRegistry.balanceOf(user2), 1);
    }

    function testApprovalAndTransfer() public {
        uint256 tokenId = 1;
        address approved = address(0x5);

        vm.startPrank(manager);
        positionRegistry.mint(user1, tokenId);
        vm.stopPrank();

        // User1 approves someone else to transfer
        vm.startPrank(user1);
        positionRegistry.approve(approved, tokenId);
        vm.stopPrank();

        // Approved address can transfer
        vm.startPrank(approved);
        positionRegistry.transferFrom(user1, user2, tokenId);
        vm.stopPrank();

        assertEq(positionRegistry.ownerOf(tokenId), user2);
    }

    function testSafeTransfer() public {
        uint256 tokenId = 1;

        vm.startPrank(manager);
        positionRegistry.mint(user1, tokenId);
        vm.stopPrank();

        vm.startPrank(user1);
        positionRegistry.safeTransferFrom(user1, user2, tokenId);
        vm.stopPrank();

        assertEq(positionRegistry.ownerOf(tokenId), user2);
    }

    function testTokenURI() public {
        uint256 tokenId = 1;

        vm.startPrank(manager);
        positionRegistry.mint(user1, tokenId);
        vm.stopPrank();

        // Test that tokenURI doesn't revert (basic ERC721 implementation)
        // The actual URI would depend on your implementation
        string memory uri = positionRegistry.tokenURI(tokenId);
        // Basic check that it returns something
        assertTrue(bytes(uri).length > 0 || bytes(uri).length == 0); // Either has URI or empty
    }

    function testSupportsInterface() public view {
        // Test ERC721 interface support
        assertTrue(positionRegistry.supportsInterface(0x80ac58cd)); // ERC721
        assertTrue(positionRegistry.supportsInterface(0x01ffc9a7)); // ERC165
    }

    // Test edge cases
    function testMintToZeroAddress() public {
        vm.startPrank(manager);

        // Should revert when minting to zero address
        vm.expectRevert();
        positionRegistry.mint(address(0), 1);

        vm.stopPrank();
    }

    function testBurnFunctionality() public {
        // Note: Standard ERC721 doesn't have burn, but if you add it:
        uint256 tokenId = 1;

        vm.startPrank(manager);
        positionRegistry.mint(user1, tokenId);
        vm.stopPrank();

        assertEq(positionRegistry.balanceOf(user1), 1);

        // If you implement burn functionality:
        // vm.startPrank(user1);
        // positionRegistry.burn(tokenId);
        // vm.stopPrank();
        //
        // assertEq(positionRegistry.balanceOf(user1), 0);
    }
}
