import React, { useState, useEffect } from 'react';
import type { PoolData } from '../index';
import { usePositionContract } from '../../../hooks/usePosition';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits, type Address, maxUint256 } from 'viem';
import { ERC20ABI } from '../../../lib/contracts/abi/ERC20';

interface DepositModalProps {
  pool: PoolData;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ pool, onClose }) => {
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [needsApproval0, setNeedsApproval0] = useState(false);
  const [needsApproval1, setNeedsApproval1] = useState(false);

  const { address } = useAccount();
  const {
    useMint: mintPosition,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    contractAddress,
  } = usePositionContract();

  // Token addresses (these should come from pool data in production)
  const token0Address = pool.tokenAddresses?.token0 as Address;
  const token1Address = pool.tokenAddresses?.token1 as Address;

  const {
    writeContractAsync: writeContractERC20Async,
    data: approvalHash,
  } = useWriteContract();

  const { isLoading: isApprovalConfirming } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  // Read token0 balance and allowance
  const { data: token0Balance } = useReadContract({
    address: token0Address,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!token0Address,
    },
  });

  const { data: allowance0, refetch: refetchAllowance0 } = useReadContract({
    address: token0Address,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: address && contractAddress ? [address, contractAddress] : undefined,
    query: {
      enabled: !!address && !!contractAddress && !!token0Address,
    },
  });

  // Read token1 balance and allowance
  const { data: token1Balance } = useReadContract({
    address: token1Address,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!token1Address,
    },
  });

  const { data: allowance1, refetch: refetchAllowance1 } = useReadContract({
    address: token1Address,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: address && contractAddress ? [address, contractAddress] : undefined,
    query: {
      enabled: !!address && !!contractAddress && !!token1Address,
    },
  });

  // Check if approvals are needed
  useEffect(() => {
    if (amount0 && allowance0 !== undefined && contractAddress) {
      const amountInWei = parseUnits(amount0, 18);
      const isMaxApproval = allowance0 >= maxUint256 - BigInt(1000);
      setNeedsApproval0(!isMaxApproval && allowance0 < amountInWei);
    }
  }, [amount0, allowance0, contractAddress]);

  useEffect(() => {
    if (amount1 && allowance1 !== undefined && contractAddress) {
      const amountInWei = parseUnits(amount1, 18);
      const isMaxApproval = allowance1 >= maxUint256 - BigInt(1000);
      setNeedsApproval1(!isMaxApproval && allowance1 < amountInWei);
    }
  }, [amount1, allowance1, contractAddress]);

  const handleApprove = async (tokenAddress: Address, isToken0: boolean) => {
    if (!contractAddress) return;

    try {
      await writeContractERC20Async({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [contractAddress, maxUint256],
      });

      // Refetch allowance after approval
      setTimeout(() => {
        if (isToken0) {
          refetchAllowance0();
        } else {
          refetchAllowance1();
        }
      }, 2000);
    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    }
  };

  const handleDeposit = async () => {
    if (!amount0 || !amount1) {
      alert('Please fill in both token amounts');
      return;
    }

    if (!address) {
      alert('Wallet not connected');
      return;
    }

    if (!pool.poolAddress) {
      alert('Pool address not configured');
      return;
    }

    if (needsApproval0) {
      await handleApprove(token0Address, true);
      return;
    }

    if (needsApproval1) {
      await handleApprove(token1Address, false);
      return;
    }

    setIsProcessing(true);

    try {
      const amount0Desired = parseUnits(amount0, 18);
      const amount1Desired = parseUnits(amount1, 18);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now

      await mintPosition(
        {
          owner: address,
          token0: token0Address,
          token1: token1Address,
          fee: pool.fee || 3000,
          amount0Desired,
          amount1Desired,
          deadline,
        },
        0, // type_ - rebalance type
        pool.poolAddress as Address
      );
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('Deposit failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isConfirmed && hash) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isConfirmed, hash, onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Deposit to {pool.pair.token0}/{pool.pair.token1}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success Message */}
        {isConfirmed && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg">
            <p className="text-green-400 text-center font-semibold">
              ✓ Deposit successful!
            </p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Token 0 Input */}
          <div>
            <label className="block text-slate-300 mb-2">
              {pool.pair.token0} Amount
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={amount0}
                onChange={(e) => setAmount0(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {token0Balance && (
                <div className="text-xs text-slate-400 mt-1">
                  Balance: {formatUnits(token0Balance, 18)} {pool.pair.token0}
                </div>
              )}
            </div>
          </div>

          {/* Token 1 Input */}
          <div>
            <label className="block text-slate-300 mb-2">
              {pool.pair.token1} Amount
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {token1Balance && (
                <div className="text-xs text-slate-400 mt-1">
                  Balance: {formatUnits(token1Balance, 18)} {pool.pair.token1}
                </div>
              )}
            </div>
          </div>

          {/* Pool Info */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">APY</span>
              <span className="text-green-400 font-semibold">{pool.apy}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pool TVL</span>
              <span className="text-white font-semibold">{pool.tvl}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-all"
              disabled={isProcessing || isPending || isConfirming}
            >
              Cancel
            </button>
            <button
              onClick={handleDeposit}
              disabled={
                !amount0 ||
                !amount1 ||
                isProcessing ||
                isPending ||
                isConfirming ||
                isApprovalConfirming ||
                isConfirmed
              }
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(() => {
                if (isConfirmed) return 'Success!';
                if (isPending || isConfirming || isApprovalConfirming) {
                  return (
                    <span className="flex items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing...
                    </span>
                  );
                }
                if (needsApproval0) return `Approve ${pool.pair.token0}`;
                if (needsApproval1) return `Approve ${pool.pair.token1}`;
                return 'Deposit';
              })()}
            </button>
          </div>

          {/* Transaction Hash */}
          {hash && (
            <div className="text-xs text-slate-400 text-center mt-2">
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 underline"
              >
                View on Explorer →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

