import React, { useState } from 'react';
import type { PoolData } from '../index';
import { usePositionContract } from '../../../hooks/usePosition';

interface WithdrawModalProps {
  pool: PoolData;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ pool, onClose }) => {
  const [tokenId, setTokenId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { rebalance, isPending, isConfirming, isConfirmed, hash } = usePositionContract();

  const handleWithdraw = async () => {
    if (!tokenId) {
      alert('Please enter a position token ID');
      return;
    }

    setIsProcessing(true);

    try {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
      await rebalance(
        1, // type_ - withdraw type (you may need to adjust this based on your contract)
        BigInt(tokenId),
        deadline
      );
    } catch (error) {
      console.error('Withdraw failed:', error);
      alert('Withdraw failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
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
            Withdraw from {pool.pair.token0}/{pool.pair.token1}
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
              ✓ Withdrawal successful!
            </p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Position Token ID Input */}
          <div>
            <label htmlFor="tokenId" className="block text-slate-300 mb-2">
              Position NFT Token ID
            </label>
            <input
              id="tokenId"
              type="number"
              placeholder="Enter your position token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-400 mt-2">
              Enter the NFT token ID of your position to withdraw
            </p>
          </div>

          {/* Pool Info */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pool</span>
              <span className="text-white font-semibold">
                {pool.pair.token0}/{pool.pair.token1}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Current APY</span>
              <span className="text-green-400 font-semibold">{pool.apy}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
            <p className="text-yellow-400 text-sm">
              ⚠️ Withdrawing will remove your liquidity from this pool and you will stop earning rewards.
            </p>
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
              onClick={handleWithdraw}
              disabled={
                !tokenId ||
                isProcessing ||
                isPending ||
                isConfirming ||
                isConfirmed
              }
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(() => {
                if (isConfirmed) return 'Success!';
                if (isPending || isConfirming) {
                  return (
                    <span className="flex items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing...
                    </span>
                  );
                }
                return 'Withdraw';
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

