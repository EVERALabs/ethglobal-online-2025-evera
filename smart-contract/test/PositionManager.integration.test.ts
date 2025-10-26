import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { network } from "hardhat";
import { PublicClient, TestClient, WalletClient } from "viem";
import { MockETH$Type } from "../artifacts/contracts/mocks/MockETH.sol/artifacts.js";
import { MockUSDC$Type } from "../artifacts/contracts/mocks/MockUSDC.sol/artifacts.js";
import { PositionRegistry$Type } from "../artifacts/contracts/PositionRegistry.sol/artifacts.js";
import { PositionPool$Type } from "../artifacts/contracts/PositionPool.sol/artifacts.js";
import { PositionManagerRouter$Type } from "../artifacts/contracts/modules/PositionManager.sol/artifacts.js";

describe("PositionManager", async () => {
  const { viem } = await network.connect();
  let publicClient: PublicClient;
  let testClient: TestClient;
  let walletClients: WalletClient[];
  let tokens: { mockETH: MockETH$Type; mockUSDC: MockUSDC$Type };
  let positionRegistry: PositionRegistry$Type;
  let positionPool: PositionPool$Type;
  let positionManager: PositionManagerRouter$Type;

  beforeEach(async () => {
    const connection = await network.connect();
    const { viem } = connection; // hardhat-viem extends the connection with a 'viem' object

    publicClient = await viem.getPublicClient();
    testClient = await viem.getTestClient();
    walletClients = await viem.getWalletClients({});

    if (!walletClients[0].account) {
      throw new Error("Wallet client account not found");
    }

    const tokens = {
      mockETH: await viem.deployContract("MockETH"),
      mockUSDC: await viem.deployContract("MockUSDC"),
    };

    const nonfungiblePositionManager = await viem.deployContract(
      "PositionManagerRouter",
      [
        walletClients[0].account.address,
        walletClients[0].account.address,
        tokens.mockUSDC.address,
        tokens.mockETH.address,
      ]
    );
  });

  it("should create a position", async () => {
    assert(1 == 1);
  });
});
