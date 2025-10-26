import type { Address } from "viem";

/**
 * Configuration for Liquidity Pool Integration with usePosition Hook
 *
 * IMPORTANT: UPDATE THESE ADDRESSES WITH YOUR ACTUAL CONTRACT ADDRESSES
 *
 * Based on smart contract specifications:
 * Arguments for mint function:
 * 1. msg.sender
 * 2. mockUSDC (hardcode) - token0
 * 3. mockETH (hardcode) - token1
 * 4. 3000 (hardcode) - fee
 * 5. 1e18 (hardcode) - amount0Desired
 * 6. decimal e6 but below 3900e6 - amount1Desired (user input)
 * 7. 1 - type_
 * 8. address uniswapV3Pool
 */

export const LIQUIDITY_POOL_CONFIG = {
  // Token addresses - ACTUAL SEPOLIA TESTNET ADDRESSES
  MOCK_USDC_ADDRESS: "0xaaaa689d56722d6b4390bdbef2d8e56ebb80bb6a" as Address, // MOCK_USDC_SEP
  MOCK_ETH_ADDRESS: "0x837848780c9403f7bc05d25888fba1f05ddc5233" as Address, // MOCK_ETH_SEP

  // Uniswap V3 Pool address (Mock LP) - ACTUAL SEPOLIA TESTNET ADDRESS
  UNISWAP_V3_POOL_ADDRESS:
    "0xA0016e27c620BbC9b8bc165F36500DF4bcF46ca3" as Address, // MOCK_LP

  // Hardcoded parameters for mint function
  MINT_PARAMS: {
    FEE: 3000, // Fee tier (hardcoded)
    AMOUNT0_DESIRED: BigInt(1e18), // 1e18 for token0 (mockUSDC) - Note: This seems unusual for USDC which typically uses 6 decimals
    MAX_AMOUNT1: 3900, // Maximum amount1 (mockETH) in human readable format
    AMOUNT1_DECIMALS: 6, // Decimals for amount1 (user input)
    TYPE: 1, // Rebalance type
  },
} as const;

/**
 * ADDITIONAL CONTRACT ADDRESSES (for reference):
 *
 * POSITION_MANAGER_ROUTER: 0xdEe6d63946E0b80598D7e5a92a2FFf5C2632a9D0
 * PROXY_ADMIN_MANAGER_ROUTER: 0x9B2a4bd1189c6cC2160Fc9319dD4E4c179B7cf15
 * POSITION_REGISTRY: 0xa03B22b0e657d5355F08b06e9ACb762f52848143
 *
 * All addresses are on Sepolia testnet.
 */

/**
 * IMPORTANT NOTE:
 *
 * As per smart contract specifications:
 * - amount0Desired (mockUSDC) = 1e18 (hardcoded)
 * - amount1Desired (mockETH) = user input in e6 decimals, must be < 3900e6
 *
 * This means mockETH uses 6 decimals in this implementation, not the standard 18.
 */
