import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type { Address, TransactionReceipt } from "viem";
import { useAccount } from "wagmi";
import {
  formatTo6Decimals,
  NETWORKS,
  PositionContractConfig,
} from "../lib/contracts/config";
import { PositionContractAbi } from "../lib/contracts/abi/abi.ts";

/**
 * Hook for interacting with the Position Contract
 * Provides a clean interface for calling contract functions
 */
export const usePositionContract = () => {
  const { address, chainId } = useAccount();
  const config = PositionContractConfig[NETWORKS.SEPOLIA]; // Default to Sepolia

  const {
    writeContract,
    data: hash,
    isPending,
    isSuccess,
    error,
    reset,
  } = useWriteContract();

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Create a new position with a specified deposit amount
   * Automatically converts the amount to 6 decimals
   *
   * @param amount - The deposit amount as a string or number (will be converted to 6 decimals)
   * @example
   * ```tsx
   * const { createPosition } = usePositionContract();
   * await createPosition("100.5"); // Deposits 100.5 tokens
   * ```
   */
  const createPosition = async (amount: string | number) => {
    try {
      // Convert amount to 6 decimals
      const amountIn6Decimals = formatTo6Decimals(amount);

      // Write to contract
      const contractAddress = config.address;

      if (!contractAddress) {
        throw new Error("Contract address not configured for this network");
      }

      if (!address) {
        throw new Error("Wallet not connected");
      }

      // Call the createPosition function
      await writeContract({
        address: contractAddress,
        abi: PositionContractAbi,
        functionName: "createPosition",
        args: [amountIn6Decimals],
        chainId: NETWORKS.SEPOLIA,
      });
    } catch (error) {
      console.error("Error creating position:", error);
      throw error;
    }
  };

  /**
   * Initialize the contract
   */
  const initialize = async () => {
    try {
      if (!config.address) {
        throw new Error("Contract address not configured for this network");
      }

      if (!address) {
        throw new Error("Wallet not connected");
      }

      await writeContract({
        address: config.address,
        abi: PositionContractAbi,
        functionName: "initialize",
        args: [],
        chainId: NETWORKS.SEPOLIA,
      });
    } catch (error) {
      console.error("Error initializing contract:", error);
      throw error;
    }
  };

  /**
   * Rebalance an existing position
   *
   * @param type_ - The rebalance type (enum)
   * @param mintTokenId - The token ID to rebalance
   * @param deadline - Transaction deadline timestamp
   */
  const rebalance = async (
    type_: number,
    mintTokenId: bigint,
    deadline: bigint
  ) => {
    try {
      if (!config.address) {
        throw new Error("Contract address not configured for this network");
      }

      if (!address) {
        throw new Error("Wallet not connected");
      }

      await writeContract({
        address: config.address,
        abi: PositionContractAbi,
        functionName: "rebalance",
        args: [type_, mintTokenId, deadline],
        chainId: NETWORKS.SEPOLIA,
      });
    } catch (error) {
      console.error("Error rebalancing position:", error);
      throw error;
    }
  };

  return {
    // Functions
    createPosition,
    initialize,
    rebalance,

    // State
    isPending,
    isConfirming,
    isConfirmed,
    isSuccess,
    hash,
    receipt,
    error,

    // Reset function to clear error state
    reset,

    // Contract info
    contractAddress: config.address,
    chainId,
    connectedAddress: address,
  };
};

/**
 * Type definitions for better TypeScript support
 */
export interface UsePositionContractReturn {
  createPosition: (amount: string | number) => Promise<void>;
  initialize: () => Promise<void>;
  rebalance: (
    type_: number,
    mintTokenId: bigint,
    deadline: bigint
  ) => Promise<void>;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  isSuccess: boolean;
  hash: Address | undefined;
  receipt: TransactionReceipt | undefined;
  error: Error | null;
  reset: () => void;
  contractAddress: Address;
  chainId: number | undefined;
  connectedAddress: Address | undefined;
}
