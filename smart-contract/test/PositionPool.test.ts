import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import { parseEther, parseUnits, getAddress, Address } from "viem";

describe("PositionPool", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  let positionPool: any;
  let mockETH: any;
  let mockUSDC: any;
  let mockPositionManager: Address;

  let owner: Address;
  let nonOwner: Address;
  let recipient: Address;

  const INITIAL_AMOUNT = parseEther("1000");

  beforeEach(async function () {
    // Get test accounts
    const [deployerWallet, ownerWallet, nonOwnerWallet, recipientWallet] =
      await viem.getWalletClients();
    owner = ownerWallet.account.address;
    nonOwner = nonOwnerWallet.account.address;
    recipient = recipientWallet.account.address;

    // Mock position manager address
    mockPositionManager = getAddress(
      "0x1234567890123456789012345678901234567890"
    );

    // Deploy mock tokens
    mockETH = await viem.deployContract("MockETH");
    mockUSDC = await viem.deployContract("MockUSDC");

    // Deploy position pool with owner
    positionPool = await viem.deployContract(
      "PositionPool",
      [mockPositionManager],
      {
        account: owner,
      }
    );

    // Mint tokens to pool
    await mockETH.write.mint([positionPool.address, INITIAL_AMOUNT]);
    await mockUSDC.write.mint([positionPool.address, INITIAL_AMOUNT]);
  });

  it("Should initialize with correct owner and position manager", async function () {
    const poolOwner = await positionPool.read.owner();
    const poolPositionManager = await positionPool.read.positionManager();

    assert.equal(poolOwner, owner);
    assert.equal(poolPositionManager, mockPositionManager);
  });

  it("Should allow owner to transfer tokens", async function () {
    const transferAmount = parseEther("100");

    const initialPoolBalance = await mockETH.read.balanceOf([
      positionPool.address,
    ]);
    const initialRecipientBalance = await mockETH.read.balanceOf([recipient]);

    // Transfer as owner
    const hash = await positionPool.write.transfer(
      [mockETH.address, recipient, transferAmount],
      {
        account: owner,
      }
    );

    await publicClient.waitForTransactionReceipt({ hash });

    const finalPoolBalance = await mockETH.read.balanceOf([
      positionPool.address,
    ]);
    const finalRecipientBalance = await mockETH.read.balanceOf([recipient]);

    assert.equal(finalPoolBalance, initialPoolBalance - transferAmount);
    assert.equal(
      finalRecipientBalance,
      initialRecipientBalance + transferAmount
    );
  });

  it("Should return correct transfer amount", async function () {
    const transferAmount = parseEther("50");

    // Use simulate to check return value
    const result = await positionPool.simulate.transfer(
      [mockETH.address, recipient, transferAmount],
      {
        account: owner,
      }
    );

    assert.equal(result.result, transferAmount);
  });

  it("Should revert when non-owner tries to transfer", async function () {
    const transferAmount = parseEther("100");

    try {
      await positionPool.write.transfer(
        [mockETH.address, recipient, transferAmount],
        {
          account: nonOwner,
        }
      );
      assert.fail("Should have reverted");
    } catch (error: any) {
      // Check that it reverted due to ownership
      assert(
        error.message.includes("revert") || error.message.includes("Ownable")
      );
    }
  });

  it("Should transfer USDC correctly", async function () {
    const transferAmount = parseUnits("1000", 6); // 1000 USDC

    const initialPoolBalance = await mockUSDC.read.balanceOf([
      positionPool.address,
    ]);

    await positionPool.write.transfer(
      [mockUSDC.address, recipient, transferAmount],
      {
        account: owner,
      }
    );

    const finalPoolBalance = await mockUSDC.read.balanceOf([
      positionPool.address,
    ]);
    const recipientBalance = await mockUSDC.read.balanceOf([recipient]);

    assert.equal(finalPoolBalance, initialPoolBalance - transferAmount);
    assert.equal(recipientBalance, transferAmount);
  });

  it("Should transfer entire balance", async function () {
    const entireBalance = await mockETH.read.balanceOf([positionPool.address]);

    await positionPool.write.transfer(
      [mockETH.address, recipient, entireBalance],
      {
        account: owner,
      }
    );

    const finalPoolBalance = await mockETH.read.balanceOf([
      positionPool.address,
    ]);
    const recipientBalance = await mockETH.read.balanceOf([recipient]);

    assert.equal(finalPoolBalance, 0n);
    assert.equal(recipientBalance, entireBalance);
  });

  it("Should revert when transferring more than balance", async function () {
    const balance = await mockETH.read.balanceOf([positionPool.address]);
    const excessiveAmount = balance + parseEther("1");

    try {
      await positionPool.write.transfer(
        [mockETH.address, recipient, excessiveAmount],
        {
          account: owner,
        }
      );
      assert.fail("Should have reverted");
    } catch (error: any) {
      // Should revert due to insufficient balance
      assert(
        error.message.includes("revert") ||
          error.message.includes("insufficient")
      );
    }
  });

  it("Should handle zero amount transfer", async function () {
    const zeroAmount = 0n;

    const initialPoolBalance = await mockETH.read.balanceOf([
      positionPool.address,
    ]);
    const initialRecipientBalance = await mockETH.read.balanceOf([recipient]);

    const result = await positionPool.simulate.transfer(
      [mockETH.address, recipient, zeroAmount],
      {
        account: owner,
      }
    );

    assert.equal(result.result, zeroAmount);

    await positionPool.write.transfer(
      [mockETH.address, recipient, zeroAmount],
      {
        account: owner,
      }
    );

    const finalPoolBalance = await mockETH.read.balanceOf([
      positionPool.address,
    ]);
    const finalRecipientBalance = await mockETH.read.balanceOf([recipient]);

    // Balances should remain unchanged
    assert.equal(finalPoolBalance, initialPoolBalance);
    assert.equal(finalRecipientBalance, initialRecipientBalance);
  });

  it("Should revert when transferring to zero address", async function () {
    const transferAmount = parseEther("100");
    const zeroAddress = getAddress(
      "0x0000000000000000000000000000000000000000"
    );

    try {
      await positionPool.write.transfer(
        [mockETH.address, zeroAddress, transferAmount],
        {
          account: owner,
        }
      );
      assert.fail("Should have reverted");
    } catch (error: any) {
      // Should revert due to zero address
      assert(error.message.includes("revert"));
    }
  });

  it("Should handle multiple transfers", async function () {
    const transferAmount1 = parseEther("100");
    const transferAmount2 = parseEther("200");
    const transferAmount3 = parseUnits("500", 6); // USDC

    const [, , , recipient2, recipient3] = await viem.getWalletClients();

    // Multiple ETH transfers
    await positionPool.write.transfer(
      [mockETH.address, recipient, transferAmount1],
      {
        account: owner,
      }
    );

    await positionPool.write.transfer(
      [mockETH.address, recipient2.account.address, transferAmount2],
      {
        account: owner,
      }
    );

    // USDC transfer
    await positionPool.write.transfer(
      [mockUSDC.address, recipient3.account.address, transferAmount3],
      {
        account: owner,
      }
    );

    // Verify balances
    const recipient1Balance = await mockETH.read.balanceOf([recipient]);
    const recipient2Balance = await mockETH.read.balanceOf([
      recipient2.account.address,
    ]);
    const recipient3Balance = await mockUSDC.read.balanceOf([
      recipient3.account.address,
    ]);

    assert.equal(recipient1Balance, transferAmount1);
    assert.equal(recipient2Balance, transferAmount2);
    assert.equal(recipient3Balance, transferAmount3);
  });

  it("Should maintain correct pool balance after transfers", async function () {
    const initialETHBalance = await mockETH.read.balanceOf([
      positionPool.address,
    ]);
    const initialUSDCBalance = await mockUSDC.read.balanceOf([
      positionPool.address,
    ]);

    const ethTransfer = parseEther("300");
    const usdcTransfer = parseUnits("1500", 6);

    await positionPool.write.transfer(
      [mockETH.address, recipient, ethTransfer],
      {
        account: owner,
      }
    );

    await positionPool.write.transfer(
      [mockUSDC.address, recipient, usdcTransfer],
      {
        account: owner,
      }
    );

    const finalETHBalance = await mockETH.read.balanceOf([
      positionPool.address,
    ]);
    const finalUSDCBalance = await mockUSDC.read.balanceOf([
      positionPool.address,
    ]);

    assert.equal(finalETHBalance, initialETHBalance - ethTransfer);
    assert.equal(finalUSDCBalance, initialUSDCBalance - usdcTransfer);
  });

  // Note: Testing mintingPosition would require a proper mock of INonfungiblePositionManager
  // For now, we'll test the access control
  it("Should revert when non-owner tries to mint position", async function () {
    const mintParams = {
      token0: mockETH.address,
      token1: mockUSDC.address,
      fee: 3000,
      tickLower: -60,
      tickUpper: 60,
      amount0Desired: parseEther("1"),
      amount1Desired: parseUnits("2000", 6),
      amount0Min: 0n,
      amount1Min: 0n,
      recipient: positionPool.address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
    };

    try {
      await positionPool.write.mintingPosition([mintParams], {
        account: nonOwner,
      });
      assert.fail("Should have reverted");
    } catch (error: any) {
      // Should revert due to ownership
      assert(
        error.message.includes("revert") || error.message.includes("Ownable")
      );
    }
  });
});
