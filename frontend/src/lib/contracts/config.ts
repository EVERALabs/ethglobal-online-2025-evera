import { type Address, parseUnits } from "viem";
import { PositionContractAbi } from "./abi/abi.ts";

export const NETWORKS = {
  SEPOLIA: 11155111,
} as const;

export const PositionContractAddress = {
  [NETWORKS.SEPOLIA]: (import.meta.env.VITE_POSITION_CONTRACT_ADDRESS || '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9') as Address,
} as const;

export const PositionContractConfig = {
  [NETWORKS.SEPOLIA]: {
    address: PositionContractAddress[NETWORKS.SEPOLIA],
    chainId: NETWORKS.SEPOLIA,
    abi: PositionContractAbi,
  },
};

// Helper functions
export const contractConfig = {
  /**
   * Get contract address for a specific network and contract type
   */
  getAddress: (networkId: number): Address | null => {
    return (
      PositionContractAddress[
        networkId as keyof typeof PositionContractAddress
      ] || null
    );
  },
};

// Environment-specific configuration
export const getContractConfig = () => {
  const environment = import.meta.env.VITE_ENVIRONMENT || "development";

  if (environment === "production") {
    return {
      defaultNetwork: NETWORKS.SEPOLIA,
      supportedNetworks: [NETWORKS.SEPOLIA],
    };
  } else {
    return {
      defaultNetwork: NETWORKS.SEPOLIA,
      supportedNetworks: [NETWORKS.SEPOLIA],
    };
  }
};

// Export default configuration
const defaultConfig = {
  NETWORKS,
  PositionContractConfig,
  contractConfig,
  getContractConfig,
};

// Helper functions for contract interactions

/**
 * Convert a decimal amount to a 6-decimal bigint representation
 * @param amount - The amount as a string or number
 * @returns bigint representing the amount with 6 decimals
 * @example
 * formatTo6Decimals("100.5") // returns 100500000n
 */
export const formatTo6Decimals = (amount: string | number): bigint => {
  const amountStr = typeof amount === "number" ? amount.toString() : amount;
  try {
    return parseUnits(amountStr, 6);
  } catch (error) {
    throw new Error(
      `Failed to format amount to 6 decimals: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

/**
 * Convert a 6-decimal bigint back to a decimal string
 * @param value - The bigint value with 6 decimals
 * @returns string representation of the decimal value
 * @example
 * formatFrom6Decimals(100500000n) // returns "100.5"
 */
export const formatFrom6Decimals = (value: bigint | string): string => {
  const bigintValue = typeof value === "string" ? BigInt(value) : value;
  const divisor = BigInt(10 ** 6);
  const wholePart = bigintValue / divisor;
  const fractionalPart = bigintValue % divisor;
  
  if (fractionalPart === 0n) {
    return wholePart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(6, "0");
  return `${wholePart}.${fractionalStr.replace(/0+$/, "")}`;
};

export default defaultConfig;
