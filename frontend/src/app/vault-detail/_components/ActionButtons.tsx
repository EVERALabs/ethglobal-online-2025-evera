import React, { useState } from 'react';

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
  history?: {
    timestamp: number;
    value: number;
  }[];
}

interface ActionButtonsProps {
  vault: VaultData;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ vault }) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isReinvesting, setIsReinvesting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsWithdrawing(false);
    // In real app, trigger withdrawal transaction
  };

  const handleReinvest = async () => {
    setIsReinvesting(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsReinvesting(false);
    // In real app, trigger reinvestment transaction
  };

  const handleExportData = async () => {
    setIsExporting(true);
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsExporting(false);
    
    // Create and download CSV
    const csvData = [
      ['Date', 'Value', 'Yield', 'Chain Distribution'],
      ...vault.history?.map(point => [
        new Date(point.timestamp).toISOString(),
        point.value.toString(),
        (point.value * 0.1).toString(), // Mock yield calculation
        Object.entries(vault.chainDistribution).map(([, chain]) => `${chain.name}: ${chain.percentage}%`).join('; ')
      ]) || []
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vault.name.replace(/\s+/g, '_')}_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing}
            className="w-full btn btn-outline btn-error btn-lg"
          >
            {isWithdrawing ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Withdraw Funds
              </>
            )}
          </button>

          {/* Reinvest Button */}
          <button
            onClick={handleReinvest}
            disabled={isReinvesting}
            className="w-full btn btn-primary btn-lg"
          >
            {isReinvesting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Reinvesting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reinvest Yield
              </>
            )}
          </button>

          {/* Export Data Button */}
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full btn btn-secondary btn-lg"
          >
            {isExporting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Data
              </>
            )}
          </button>
        </div>
        </div>
      </div>

      {/* Vault Info Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
        <h3 className="text-lg font-bold mb-4">Vault Information</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Vault ID</span>
            <span className="text-sm font-mono bg-base-200 px-2 py-1 rounded">
              {vault.id}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Token</span>
            <span className="text-sm font-semibold">
              {vault.token.symbol}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Available Balance</span>
            <span className="text-sm font-semibold text-success">
              {formatCurrency(vault.currentValue)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Accrued Yield</span>
            <span className="text-sm font-semibold text-primary">
              {formatCurrency(vault.lifetimeYield)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Active Chains</span>
            <span className="text-sm font-semibold">
              {Object.keys(vault.chainDistribution).length}
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* Risk Assessment Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
        <h3 className="text-lg font-bold mb-4">Risk Assessment</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Diversification</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-base-200 rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs text-success font-semibold">85%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Liquidity Risk</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-base-200 rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <span className="text-xs text-warning font-semibold">Low</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Smart Contract Risk</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-base-200 rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <span className="text-xs text-success font-semibold">Low</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Overall Risk</span>
            <div className="badge badge-success badge-sm">Low Risk</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
