import React, { useState } from 'react';
import type { PoolData } from '../index';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';

interface PoolCardProps {
  pool: PoolData;
}

export const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleDeposit = () => {
    if (pool.isUnderMaintenance) return;
    setShowDepositModal(true);
  };

  const handleWithdraw = () => {
    if (pool.isUnderMaintenance) return;
    setShowWithdrawModal(true);
  };

  return (
    <>
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
        {/* Pool Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Token Icons */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {pool.pair.icon0}
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg -ml-3">
                {pool.pair.icon1}
              </div>
            </div>
            
            {/* Pool Name */}
            <div>
              <h3 className="text-xl font-bold text-white">
                {pool.pair.token0}/{pool.pair.token1}
              </h3>
              <p className="text-sm text-slate-400">{pool.protocolType}</p>
            </div>
          </div>

          {/* Protocol Badge */}
          <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
            {pool.protocol}
          </div>
        </div>

        {/* Pool Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-slate-400 text-sm mb-1">24h Volume</p>
            <p className="text-white font-semibold">{pool.volume24h}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">APY</p>
            <p className="text-green-400 font-semibold">{pool.apy}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">TVL</p>
            <p className="text-white font-semibold">{pool.tvl}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Price</p>
            <p className="text-white font-semibold">{pool.price}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {pool.isUnderMaintenance ? (
          <div className="flex items-center justify-center gap-2 py-3 text-yellow-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-medium">Under Maintenance</span>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDeposit}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Deposit
            </button>
            <button
              onClick={handleWithdraw}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Withdraw
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDepositModal && (
        <DepositModal
          pool={pool}
          onClose={() => setShowDepositModal(false)}
        />
      )}
      {showWithdrawModal && (
        <WithdrawModal
          pool={pool}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
    </>
  );
};

