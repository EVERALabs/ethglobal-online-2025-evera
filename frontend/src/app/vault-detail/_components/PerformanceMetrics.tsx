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

interface PerformanceMetricsProps {
  vault: VaultData;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ vault }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  // Calculate additional metrics
  const totalChains = Object.keys(vault.chainDistribution).length;
  const maxChainPercentage = Math.max(...Object.values(vault.chainDistribution).map(c => c.percentage));
  const minChainPercentage = Math.min(...Object.values(vault.chainDistribution).map(c => c.percentage));
  const rebalanceEfficiency = 100 - (maxChainPercentage - minChainPercentage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Current Value Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="badge badge-success badge-sm">Live</div>
        </div>
        <div className="text-2xl font-bold text-success mb-1">
          {formatCurrency(vault.currentValue)}
        </div>
        <div className="text-sm text-base-content/60 mb-2">Current Value</div>
        <div className="text-xs text-success">
          +2.4% from last rebalance
        </div>
        </div>
      </div>

      {/* Lifetime Yield Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="badge badge-primary badge-sm">APY</div>
          </div>
          <div className="text-2xl font-bold text-primary mb-1">
            {formatCurrency(vault.lifetimeYield)}
          </div>
          <div className="text-sm text-base-content/60 mb-2">Lifetime Yield</div>
          <div className="text-xs text-primary">
            {formatPercentage((vault.lifetimeYield / (vault.currentValue - vault.lifetimeYield)) * 100)} total return
          </div>
        </div>
      </div>

      {/* Chain Distribution Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
            <div className="badge badge-secondary badge-sm">Multi-Chain</div>
          </div>
          <div className="text-2xl font-bold text-secondary mb-1">
            {totalChains}
          </div>
          <div className="text-sm text-base-content/60 mb-2">Active Chains</div>
          <div className="text-xs text-secondary">
            {formatPercentage(rebalanceEfficiency)} efficiency
          </div>
        </div>
      </div>

      {/* Risk Metrics Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="badge badge-warning badge-sm">Risk</div>
          </div>
          <div className="text-2xl font-bold text-warning mb-1">
            Low
          </div>
          <div className="text-sm text-base-content/60 mb-2">Risk Level</div>
          <div className="text-xs text-warning">
            Diversified across {totalChains} chains
          </div>
        </div>
      </div>
    </div>
  );
};
