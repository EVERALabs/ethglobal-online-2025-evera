import React, { useState, useEffect } from 'react';
import type { PoolData } from '../index';
import { usePositionContract } from '../../../hooks/usePosition';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits, maxUint256 } from 'viem';
import { ERC20ABI } from '../../../lib/contracts/abi/ERC20';
import { LIQUIDITY_POOL_CONFIG } from '../../../lib/contracts/liquidityPoolConfig';

interface DepositModalProps {
  pool: PoolData;
  onClose: () => void;
}

// Extract config constants
const { MOCK_USDC_ADDRESS, MOCK_ETH_ADDRESS, UNISWAP_V3_POOL_ADDRESS, MINT_PARAMS } = LIQUIDITY_POOL_CONFIG;

export const DepositModal: React.FC<DepositModalProps> = ({ pool, onClose }) => {
  // Only amount1 (mockETH amount in e6 decimals) is user input
  // amount0 (mockUSDC) is hardcoded to 1e18
  const [ethAmount, setEthAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [needsApprovalETH, setNeedsApprovalETH] = useState(false);

  const { address } = useAccount();
  const {
    useMint: mintPosition,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    contractAddress,
  } = usePositionContract();

  const {
    writeContractAsync: writeContractERC20Async,
    data: approvalHash,
  } = useWriteContract();

  const { isLoading: isApprovalConfirming } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  // Read mockETH balance and allowance (only mockETH needs user input and approval)
  const { data: ethBalance } = useReadContract({
    address: MOCK_ETH_ADDRESS,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!MOCK_ETH_ADDRESS,
    },
  });

  const { data: allowanceETH, refetch: refetchAllowanceETH } = useReadContract({
    address: MOCK_ETH_ADDRESS,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: address && contractAddress ? [address, contractAddress] : undefined,
    query: {
      enabled: !!address && !!contractAddress && !!MOCK_ETH_ADDRESS,
    },
  });

  // Check if mockETH approval is needed
  useEffect(() => {
    if (ethAmount && allowanceETH !== undefined && contractAddress) {
      // User input is in e6 decimals, need to check if approval is needed
      const amountInWei = parseUnits(ethAmount, MINT_PARAMS.AMOUNT1_DECIMALS);
      const isMaxApproval = allowanceETH >= maxUint256 - BigInt(1000);
      setNeedsApprovalETH(!isMaxApproval && allowanceETH < amountInWei);
    }
  }, [ethAmount, allowanceETH, contractAddress]);

  const handleApproveETH = async () => {
    if (!contractAddress) return;

    try {
      await writeContractERC20Async({
        address: MOCK_ETH_ADDRESS,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [contractAddress, maxUint256],
      });

      // Refetch allowance after approval
      setTimeout(() => {
        refetchAllowanceETH();
      }, 2000);
    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    }
  };

  const handleDeposit = async () => {
    if (!ethAmount) {
      alert(`Please enter mockETH amount (max ${MINT_PARAMS.MAX_AMOUNT1})`);
      return;
    }

    const ethAmountNumber = Number.parseFloat(ethAmount);
    if (ethAmountNumber <= 0 || ethAmountNumber >= MINT_PARAMS.MAX_AMOUNT1) {
      alert(`mockETH amount must be greater than 0 and less than ${MINT_PARAMS.MAX_AMOUNT1}`);
      return;
    }

    if (!address) {
      alert('Wallet not connected');
      return;
    }

    if (needsApprovalETH) {
      await handleApproveETH();
      return;
    }

    setIsProcessing(true);

    try {
      /**
       * Arguments as specified by smart contract team:
       * 1. msg.sender
       * 2. mockUSDC (token0) - hardcoded address
       * 3. mockETH (token1) - hardcoded address
       * 4. 3000 (fee) - hardcoded
       * 5. 1e18 (amount0Desired) - hardcoded for mockUSDC
       * 6. decimal e6 but below 3900e6 (amount1Desired) - user input for mockETH
       * 7. 1 (type_)
       * 8. address uniswapV3Pool
       */
      
      const amount0Desired = MINT_PARAMS.AMOUNT0_DESIRED; // 1e18 (hardcoded for mockUSDC)
      const amount1Desired = parseUnits(ethAmount, MINT_PARAMS.AMOUNT1_DECIMALS); // User input in e6 decimals for mockETH
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now

      await mintPosition(
        {
          owner: address, // 1. msg.sender
          token0: MOCK_USDC_ADDRESS, // 2. mockUSDC
          token1: MOCK_ETH_ADDRESS, // 3. mockETH
          fee: MINT_PARAMS.FEE, // 4. 3000
          amount0Desired, // 5. 1e18
          amount1Desired, // 6. < 3900e6
          deadline,
        },
        MINT_PARAMS.TYPE, // 7. 1
        UNISWAP_V3_POOL_ADDRESS // 8. uniswapV3Pool address
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
          {/* Info: mockUSDC Amount (Hardcoded - Display Only) */}
          <div>
            <label htmlFor="mockUSDCAmount" className="block text-slate-300 mb-2">
              mockUSDC Amount (Fixed)
            </label>
            <div className="relative">
              <input
                id="mockUSDCAmount"
                type="text"
                value="1e18"
                disabled
                className="w-full bg-slate-700/50 text-slate-400 rounded-lg px-4 py-3 cursor-not-allowed"
              />
              <div className="text-xs text-slate-400 mt-1">
                mockUSDC amount is fixed at 1e18 (hardcoded)
              </div>
            </div>
          </div>

          {/* User Input: mockETH Amount (in e6 decimals, < 3900) */}
          <div>
            <label htmlFor="mockETHAmount" className="block text-slate-300 mb-2">
              mockETH Amount (Max: {MINT_PARAMS.MAX_AMOUNT1})
            </label>
            <div className="relative">
              <input
                id="mockETHAmount"
                type="number"
                step="0.01"
                min="0"
                max={MINT_PARAMS.MAX_AMOUNT1 - 0.01}
                placeholder="0.00"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {ethBalance && (
                <div className="text-xs text-slate-400 mt-1">
                  Balance: {formatUnits(ethBalance, MINT_PARAMS.AMOUNT1_DECIMALS)} mockETH
                </div>
              )}
              <div className="text-xs text-yellow-400 mt-1">
                ⚠️ Must be less than {MINT_PARAMS.MAX_AMOUNT1} (will be converted to e6 decimals)
              </div>
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
                !ethAmount ||
                Number.parseFloat(ethAmount) <= 0 ||
                Number.parseFloat(ethAmount) >= MINT_PARAMS.MAX_AMOUNT1 ||
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
                if (needsApprovalETH) return 'Approve mockETH';
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

