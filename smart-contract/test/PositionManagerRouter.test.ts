import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import { parseEther, parseUnits, getAddress, Address } from "viem";

describe("PositionManagerRouter", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  let positionManager: any;
  let positionRegistry: any;
  let mockETH: any;
  let mockUSDC: any;
  let mockPositionManager: any;

  let user1: Address;
  let user2: Address;

  const INITIAL_ETH_AMOUNT = parseEther("100");
  const INITIAL_USDC_AMOUNT = parseUnits("50000", 6); // 50k USDC with 6 decimals

  beforeEach(async function () {
    // Get test accounts
    const [deployer, testUser1, testUser2] = await viem.getWalletClients();
    user1 = testUser1.account.address;
    user2 = testUser2.account.address;

    // Deploy mock tokens
    mockETH = await viem.deployContract("MockETH");
    mockUSDC = await viem.deployContract("MockUSDC");

    // Deploy a mock position manager (you'll need to create this or use a real one)
    // For now, we'll use a placeholder address
    mockPositionManager = getAddress(
      "0x1234567890123456789012345678901234567890"
    );

    // Deploy position registry
    positionRegistry = await viem.deployContract("PositionRegistry", [
      deployer.account.address,
    ]);

    // Deploy position manager router
    positionManager = await viem.deployContract("PositionManagerRouter", [
      mockPositionManager,
      positionRegistry.address,
      mockUSDC.address,
      mockETH.address,
    ]);

    // Mint tokens to test users
    await mockETH.write.mint([user1, INITIAL_ETH_AMOUNT]);
    await mockUSDC.write.mint([user1, INITIAL_USDC_AMOUNT]);
    await mockETH.write.mint([user2, INITIAL_ETH_AMOUNT]);
    await mockUSDC.write.mint([user2, INITIAL_USDC_AMOUNT]);

    // Setup approvals
    await mockETH.write.approve([positionManager.address, INITIAL_ETH_AMOUNT], {
      account: user1,
    });
    await mockUSDC.write.approve(
      [positionManager.address, INITIAL_USDC_AMOUNT],
      {
        account: user1,
      }
    );
    await mockETH.write.approve([positionManager.address, INITIAL_ETH_AMOUNT], {
      account: user2,
    });
    await mockUSDC.write.approve(
      [positionManager.address, INITIAL_USDC_AMOUNT],
      {
        account: user2,
      }
    );
  });

  it("Should create a position successfully", async function () {
    const ethAmount = parseEther("1");
    const usdcAmount = parseUnits("2000", 6);

    // Check initial balances
    const initialETHBalance = await mockETH.read.balanceOf([user1]);
    const initialUSDCBalance = await mockUSDC.read.balanceOf([user1]);

    assert.equal(initialETHBalance, INITIAL_ETH_AMOUNT);
    assert.equal(initialUSDCBalance, INITIAL_USDC_AMOUNT);

    // Create position
    const hash = await positionManager.write.createPosition(
      [ethAmount, usdcAmount],
      {
        account: user1,
      }
    );

    // Wait for transaction to be mined
    await publicClient.waitForTransactionReceipt({ hash });

    // Check balances after position creation
    const finalETHBalance = await mockETH.read.balanceOf([user1]);
    const finalUSDCBalance = await mockUSDC.read.balanceOf([user1]);

    assert.equal(finalETHBalance, INITIAL_ETH_AMOUNT - ethAmount);
    assert.equal(finalUSDCBalance, INITIAL_USDC_AMOUNT - usdcAmount);

    // Check position balance mapping
    const positionBalance = await positionManager.read.tokenIdToPositionBalance(
      [1n]
    );

    assert.equal(positionBalance[0], user1); // owner
    assert.equal(positionBalance[1], ethAmount); // amount0
    assert.equal(positionBalance[2], usdcAmount); // amount1
    assert.equal(positionBalance[3], 0n); // ltv
    assert.notEqual(
      positionBalance[4],
      getAddress("0x0000000000000000000000000000000000000000")
    ); // pool
    assert.equal(positionBalance[5], 1n); // tokenId
  });

  it("Should emit PositionCreated event", async function () {
    const ethAmount = parseEther("1");
    const usdcAmount = parseUnits("2000", 6);

    // Create position and check for event
    await viem.assertions.emitWithArgs(
      positionManager.write.createPosition([ethAmount, usdcAmount], {
        account: user1,
      }),
      positionManager,
      "PositionCreated",
      [user1, 1n, ethAmount, usdcAmount]
    );
  });

  it("Should handle multiple users creating positions", async function () {
    const ethAmount1 = parseEther("1");
    const usdcAmount1 = parseUnits("2000", 6);
    const ethAmount2 = parseEther("2");
    const usdcAmount2 = parseUnits("4000", 6);

    // User 1 creates position
    await positionManager.write.createPosition([ethAmount1, usdcAmount1], {
      account: user1,
    });

    // User 2 creates position
    await positionManager.write.createPosition([ethAmount2, usdcAmount2], {
      account: user2,
    });

    // Check both positions exist
    const position1 = await positionManager.read.tokenIdToPositionBalance([1n]);
    const position2 = await positionManager.read.tokenIdToPositionBalance([2n]);

    assert.equal(position1[0], user1);
    assert.equal(position1[1], ethAmount1);
    assert.equal(position1[2], usdcAmount1);

    assert.equal(position2[0], user2);
    assert.equal(position2[1], ethAmount2);
    assert.equal(position2[2], usdcAmount2);

    // Check NFT ownership
    const owner1 = await positionRegistry.read.ownerOf([1n]);
    const owner2 = await positionRegistry.read.ownerOf([2n]);

    assert.equal(owner1, user1);
    assert.equal(owner2, user2);
  });

  it("Should increment tokenId correctly", async function () {
    const ethAmount = parseEther("0.5");
    const usdcAmount = parseUnits("1000", 6);

    // Check initial tokenId
    const initialTokenId = await positionManager.read.tokenId();
    assert.equal(initialTokenId, 0n);

    // Create first position
    await positionManager.write.createPosition([ethAmount, usdcAmount], {
      account: user1,
    });

    let currentTokenId = await positionManager.read.tokenId();
    assert.equal(currentTokenId, 1n);

    // Create second position
    await positionManager.write.createPosition([ethAmount, usdcAmount], {
      account: user2,
    });

    currentTokenId = await positionManager.read.tokenId();
    assert.equal(currentTokenId, 2n);
  });

  it("Should revert when creating position with insufficient balance", async function () {
    const excessiveAmount = INITIAL_ETH_AMOUNT + parseEther("1");

    try {
      await positionManager.write.createPosition(
        [excessiveAmount, parseUnits("1000", 6)],
        {
          account: user1,
        }
      );
      assert.fail("Should have reverted");
    } catch (error: any) {
      // Check that it reverted due to insufficient balance
      assert(
        error.message.includes("revert") ||
          error.message.includes("insufficient")
      );
    }
  });

  it("Should create positions with different amounts", async function () {
    const positions = [
      { eth: parseEther("0.1"), usdc: parseUnits("200", 6) },
      { eth: parseEther("5"), usdc: parseUnits("10000", 6) },
      { eth: parseEther("0.01"), usdc: parseUnits("20", 6) },
    ];

    for (let i = 0; i < positions.length; i++) {
      await positionManager.write.createPosition(
        [positions[i].eth, positions[i].usdc],
        {
          account: user1,
        }
      );

      const position = await positionManager.read.tokenIdToPositionBalance([
        BigInt(i + 1),
      ]);
      assert.equal(position[1], positions[i].eth);
      assert.equal(position[2], positions[i].usdc);
    }
  });

  it("Should track user balances correctly", async function () {
    const ethAmount = parseEther("2");
    const usdcAmount = parseUnits("4000", 6);

    const initialETHBalance = await mockETH.read.balanceOf([user1]);
    const initialUSDCBalance = await mockUSDC.read.balanceOf([user1]);

    await positionManager.write.createPosition([ethAmount, usdcAmount], {
      account: user1,
    });

    const finalETHBalance = await mockETH.read.balanceOf([user1]);
    const finalUSDCBalance = await mockUSDC.read.balanceOf([user1]);

    // Verify exact balance changes
    assert.equal(finalETHBalance, initialETHBalance - ethAmount);
    assert.equal(finalUSDCBalance, initialUSDCBalance - usdcAmount);
  });

  it("Should handle edge case with minimum amounts", async function () {
    const minEthAmount = 1n; // 1 wei
    const minUsdcAmount = 1n; // 1 unit (smallest USDC unit)

    await positionManager.write.createPosition([minEthAmount, minUsdcAmount], {
      account: user1,
    });

    const position = await positionManager.read.tokenIdToPositionBalance([1n]);
    assert.equal(position[1], minEthAmount);
    assert.equal(position[2], minUsdcAmount);
  });

  it("Should verify pool creation for each position", async function () {
    const ethAmount = parseEther("1");
    const usdcAmount = parseUnits("2000", 6);

    await positionManager.write.createPosition([ethAmount, usdcAmount], {
      account: user1,
    });

    const position = await positionManager.read.tokenIdToPositionBalance([1n]);
    const poolAddress = position[4];

    // Verify pool address is not zero
    assert.notEqual(
      poolAddress,
      getAddress("0x0000000000000000000000000000000000000000")
    );

    // Verify pool has the deposited tokens
    const poolETHBalance = await mockETH.read.balanceOf([poolAddress]);
    const poolUSDCBalance = await mockUSDC.read.balanceOf([poolAddress]);

    assert.equal(poolETHBalance, ethAmount);
    assert.equal(poolUSDCBalance, usdcAmount);
  });
});
