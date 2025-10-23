import React from 'react';

interface VaultData {
  id: string;
  name: string;
  token: {
    symbol: string;
    name: string;
    icon: string;
  };
  currentValue: number;
  lifetimeYield: number;
  chainDistribution: {
    [chainId: string]: {
      name: string;
      percentage: number;
      value: number;
    };
  };
}

interface VaultHeaderProps {
  vault: VaultData;
}

export const VaultHeader: React.FC<VaultHeaderProps> = ({ vault }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section - Token Info */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-3xl">
              {vault.token.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {vault.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-semibold text-base-content/80">
                  {vault.token.symbol}
                </span>
                <span className="text-sm text-base-content/60">
                  {vault.token.name}
                </span>
                <div className="badge badge-success badge-sm">
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Key Metrics */}
        <div className="flex flex-wrap gap-2">
          <div className="badge badge-success badge-lg">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {formatCurrency(vault.currentValue)}
          </div>
          <div className="badge badge-primary badge-lg">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {formatCurrency(vault.lifetimeYield)} Yield
          </div>
          <div className="badge badge-secondary badge-lg">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
            {Object.keys(vault.chainDistribution).length} Chains
          </div>
        </div>
      </div>

      {/* Chain Distribution Preview */}
      <div className="mt-6 pt-6 border-t border-base-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Chain Distribution</h3>
          <div className="text-sm text-base-content/60">
            {Object.keys(vault.chainDistribution).length} chains
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(vault.chainDistribution).map(([chainId, chain]) => (
            <div key={chainId} className="flex items-center gap-2 bg-base-200 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium">{chain.name}</span>
              <span className="text-xs text-base-content/60">
                {formatPercentage(chain.percentage)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
