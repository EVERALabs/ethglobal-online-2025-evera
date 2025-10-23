import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],

    // overrides: {
    //   "node_modules/@uniswap/v3-core/contracts/libraries/FullMath.sol": {
    //     version: "0.7.6",
    //     settings: {
    //       optimizer: {
    //         enabled: true,
    //         runs: 800,
    //       },
    //     },
    //   },
    //   "node_modules/@uniswap/v3-periphery/contracts/libraries/LiquidityAmounts.sol":
    //     {
    //       version: "0.8.0",
    //       settings: {
    //         optimizer: {
    //           enabled: true,
    //           runs: 800,
    //         },
    //       },
    //     },
    //   "@uniswap/v3-core/contracts/**/*": {
    //     version: "0.8.0",
    //     settings: {
    //       optimizer: {
    //         enabled: true,
    //         runs: 800,
    //       },
    //     },
    //   },
    //   "@uniswap/v3-periphery/contracts/**/*": {
    //     version: "0.8.0",
    //     settings: {
    //       optimizer: {
    //         enabled: true,
    //         runs: 800,
    //       },
    //     },
    //   },
    // },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
};

export default config;
