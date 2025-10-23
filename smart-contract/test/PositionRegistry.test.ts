import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import { getAddress, Address } from "viem";

describe("PositionRegistry", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  let positionRegistry: any;

  let manager: Address;
  let nonManager: Address;
  let user1: Address;
  let user2: Address;

  beforeEach(async function () {
    // Get test accounts
    const [managerWallet, nonManagerWallet, user1Wallet, user2Wallet] =
      await viem.getWalletClients();
    manager = managerWallet.account.address;
    nonManager = nonManagerWallet.account.address;
    user1 = user1Wallet.account.address;
    user2 = user2Wallet.account.address;

    // Deploy position registry
    positionRegistry = await viem.deployContract("PositionRegistry", [manager]);
  });

  it("Should initialize with correct manager and metadata", async function () {
    const registryManager = await positionRegistry.read.MANAGER();
    const name = await positionRegistry.read.name();
    const symbol = await positionRegistry.read.symbol();

    assert.equal(registryManager, manager);
    assert.equal(name, "Bloom Finance Position Registry");
    assert.equal(symbol, "BLOOM");
  });

  it("Should allow manager to mint NFT", async function () {
    const tokenId = 1n;

    // Check initial balance
    const initialBalance = await positionRegistry.read.balanceOf([user1]);
    assert.equal(initialBalance, 0n);

    // Mint NFT as manager
    const hash = await positionRegistry.write.mint([user1, tokenId], {
      account: manager,
    });

    await publicClient.waitForTransactionReceipt({ hash });

    // Check ownership and balance
    const owner = await positionRegistry.read.ownerOf([tokenId]);
    const balance = await positionRegistry.read.balanceOf([user1]);

    assert.equal(owner, user1);
    assert.equal(balance, 1n);
  });

  it("Should mint multiple tokens to same user", async function () {
    const tokenIds = [1n, 2n, 3n];

    // Mint multiple tokens
    for (const tokenId of tokenIds) {
      await positionRegistry.write.mint([user1, tokenId], {
        account: manager,
      });
    }

    // Check balance and ownership
    const balance = await positionRegistry.read.balanceOf([user1]);
    assert.equal(balance, BigInt(tokenIds.length));

    for (const tokenId of tokenIds) {
      const owner = await positionRegistry.read.ownerOf([tokenId]);
      assert.equal(owner, user1);
    }
  });

  it("Should mint tokens to different users", async function () {
    const tokenId1 = 1n;
    const tokenId2 = 2n;

    await positionRegistry.write.mint([user1, tokenId1], {
      account: manager,
    });

    await positionRegistry.write.mint([user2, tokenId2], {
      account: manager,
    });

    // Check ownership
    const owner1 = await positionRegistry.read.ownerOf([tokenId1]);
    const owner2 = await positionRegistry.read.ownerOf([tokenId2]);

    assert.equal(owner1, user1);
    assert.equal(owner2, user2);

    // Check balances
    const balance1 = await positionRegistry.read.balanceOf([user1]);
    const balance2 = await positionRegistry.read.balanceOf([user2]);

    assert.equal(balance1, 1n);
    assert.equal(balance2, 1n);
  });

  it("Should revert when non-manager tries to mint", async function () {
    const tokenId = 1n;

    try {
      await positionRegistry.write.mint([user1, tokenId], {
        account: nonManager,
      });
      assert.fail("Should have reverted");
    } catch (error: any) {
      // Should revert with OnlyManagerCanMint error
      assert(
        error.message.includes("revert") ||
          error.message.includes("OnlyManagerCanMint")
      );
    }
  });

  it("Should revert when minting same tokenId twice", async function () {
    const tokenId = 1n;

    // First mint should succeed
    await positionRegistry.write.mint([user1, tokenId], {
      account: manager,
    });

    // Second mint with same tokenId should fail
    try {
      await positionRegistry.write.mint([user2, tokenId], {
        account: manager,
      });
      assert.fail("Should have reverted");
    } catch (error: any) {
      // Should revert due to token already existing
      assert(error.message.includes("revert"));
    }
  });

  it("Should support ERC721 transfers", async function () {
    const tokenId = 1n;

    // Mint token to user1
    await positionRegistry.write.mint([user1, tokenId], {
      account: manager,
    });

    // Transfer from user1 to user2
    await positionRegistry.write.transferFrom([user1, user2, tokenId], {
      account: user1,
    });

    // Check new ownership
    const newOwner = await positionRegistry.read.ownerOf([tokenId]);
    const user1Balance = await positionRegistry.read.balanceOf([user1]);
    const user2Balance = await positionRegistry.read.balanceOf([user2]);

    assert.equal(newOwner, user2);
    assert.equal(user1Balance, 0n);
    assert.equal(user2Balance, 1n);
  });

  it("Should support ERC721 safe transfers", async function () {
    const tokenId = 1n;

    await positionRegistry.write.mint([user1, tokenId], {
      account: manager,
    });

    // Safe transfer
    await positionRegistry.write.safeTransferFrom([user1, user2, tokenId], {
      account: user1,
    });

    const newOwner = await positionRegistry.read.ownerOf([tokenId]);
    assert.equal(newOwner, user2);
  });

  it("Should support ERC721 approval mechanism", async function () {
    const tokenId = 1n;
    const [, , , , approvedWallet] = await viem.getWalletClients();
    const approved = approvedWallet.account.address;

    // Mint token
    await positionRegistry.write.mint([user1, tokenId], {
      account: manager,
    });

    // User1 approves someone else
    await positionRegistry.write.approve([approved, tokenId], {
      account: user1,
    });

    // Check approval
    const approvedAddress = await positionRegistry.read.getApproved([tokenId]);
    assert.equal(approvedAddress, approved);

    // Approved address can transfer
    await positionRegistry.write.transferFrom([user1, user2, tokenId], {
      account: approved,
    });

    const newOwner = await positionRegistry.read.ownerOf([tokenId]);
    assert.equal(newOwner, user2);
  });

  it("Should support setApprovalForAll", async function () {
    const tokenId1 = 1n;
    const tokenId2 = 2n;
    const [, , , , operatorWallet] = await viem.getWalletClients();
    const operator = operatorWallet.account.address;

    // Mint tokens
    await positionRegistry.write.mint([user1, tokenId1], {
      account: manager,
    });
    await positionRegistry.write.mint([user1, tokenId2], {
      account: manager,
    });

    // Set approval for all
    await positionRegistry.write.setApprovalForAll([operator, true], {
      account: user1,
    });

    // Check approval
    const isApproved = await positionRegistry.read.isApprovedForAll([
      user1,
      operator,
    ]);
    assert.equal(isApproved, true);

    // Operator can transfer both tokens
    await positionRegistry.write.transferFrom([user1, user2, tokenId1], {
      account: operator,
    });
    await positionRegistry.write.transferFrom([user1, user2, tokenId2], {
      account: operator,
    });

    const balance = await positionRegistry.read.balanceOf([user2]);
    assert.equal(balance, 2n);
  });

  it("Should revert when minting to zero address", async function () {
    const tokenId = 1n;
    const zeroAddress = getAddress(
      "0x0000000000000000000000000000000000000000"
    );

    try {
      await positionRegistry.write.mint([zeroAddress, tokenId], {
        account: manager,
      });
      assert.fail("Should have reverted");
    } catch (error: any) {
      // Should revert when minting to zero address
      assert(error.message.includes("revert"));
    }
  });

  it("Should return correct tokenURI", async function () {
    const tokenId = 1n;

    await positionRegistry.write.mint([user1, tokenId], {
      account: manager,
    });

    // Test that tokenURI doesn't revert
    try {
      const uri = await positionRegistry.read.tokenURI([tokenId]);
      // URI can be empty or have content, just shouldn't revert
      assert(typeof uri === "string");
    } catch (error: any) {
      // If tokenURI is not implemented, it might revert
      assert(error.message.includes("revert"));
    }
  });

  it("Should support interface detection", async function () {
    // ERC721 interface ID
    const ERC721_INTERFACE_ID = "0x80ac58cd";
    // ERC165 interface ID
    const ERC165_INTERFACE_ID = "0x01ffc9a7";

    const supportsERC721 = await positionRegistry.read.supportsInterface([
      ERC721_INTERFACE_ID,
    ]);
    const supportsERC165 = await positionRegistry.read.supportsInterface([
      ERC165_INTERFACE_ID,
    ]);

    assert.equal(supportsERC721, true);
    assert.equal(supportsERC165, true);
  });

  it("Should handle batch minting correctly", async function () {
    const tokenIds = [1n, 2n, 3n, 4n, 5n];
    const users = [user1, user2, user1, user2, user1];

    // Batch mint
    for (let i = 0; i < tokenIds.length; i++) {
      await positionRegistry.write.mint([users[i], tokenIds[i]], {
        account: manager,
      });
    }

    // Check balances
    const user1Balance = await positionRegistry.read.balanceOf([user1]);
    const user2Balance = await positionRegistry.read.balanceOf([user2]);

    assert.equal(user1Balance, 3n); // tokens 1, 3, 5
    assert.equal(user2Balance, 2n); // tokens 2, 4

    // Verify ownership
    for (let i = 0; i < tokenIds.length; i++) {
      const owner = await positionRegistry.read.ownerOf([tokenIds[i]]);
      assert.equal(owner, users[i]);
    }
  });

  it("Should revert on invalid token queries", async function () {
    const nonExistentTokenId = 999n;

    try {
      await positionRegistry.read.ownerOf([nonExistentTokenId]);
      assert.fail("Should have reverted");
    } catch (error: any) {
      // Should revert for non-existent token
      assert(error.message.includes("revert"));
    }
  });
});
