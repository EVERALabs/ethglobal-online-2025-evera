import React, { useState } from 'react';

interface SettingsData {
  strategyParams: {
    rebalanceThreshold: number;
    minLiquidityPerChain: number;
    maxSlippage: number;
    gasPriceMultiplier: number;
  };
  chainWhitelist: {
    [chainId: string]: boolean;
  };
}

interface SaveChangesModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  changes: SettingsData;
}

export const SaveChangesModal: React.FC<SaveChangesModalProps> = ({
  onConfirm,
  onCancel,
  changes,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'review' | 'confirming' | 'success'>('review');

  const handleConfirm = async () => {
    setIsProcessing(true);
    setCurrentStep('confirming');
    
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCurrentStep('success');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onConfirm();
  };

  const getActiveChains = () => {
    return Object.entries(changes.chainWhitelist)
      .filter(([_, isActive]) => isActive)
      .map(([chainId, _]) => {
        const chainNames: { [key: string]: string } = {
          '1': 'Ethereum',
          '8453': 'Base',
          '42161': 'Arbitrum',
          '10': 'Optimism',
          '137': 'Polygon',
          '56': 'BSC',
          '43114': 'Avalanche',
        };
        return chainNames[chainId] || `Chain ${chainId}`;
      });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (currentStep === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Settings Updated!</h2>
          <p className="opacity-70 mb-6">
            Your protocol settings have been successfully updated and are now active.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-70">Transaction Hash:</span>
              <span className="font-mono">0x742d...8b6</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Gas Used:</span>
              <span>245,000</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Block:</span>
              <span>19,234,567</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content">Confirm Settings Update</h2>
              <p className="text-sm opacity-70">Review changes before submitting transaction</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isProcessing}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {currentStep === 'review' && (
          <>
            {/* Changes Summary */}
            <div className="space-y-6">
              {/* Strategy Parameters */}
              <div className="p-4 bg-base-200 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  Strategy Parameters
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-70">Rebalance Threshold:</span>
                    <span className="font-mono">{changes.strategyParams.rebalanceThreshold}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Min Liquidity:</span>
                    <span className="font-mono">${changes.strategyParams.minLiquidityPerChain.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Max Slippage:</span>
                    <span className="font-mono">{changes.strategyParams.maxSlippage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Gas Multiplier:</span>
                    <span className="font-mono">{changes.strategyParams.gasPriceMultiplier}x</span>
                  </div>
                </div>
              </div>

              {/* Chain Whitelist */}
              <div className="p-4 bg-base-200 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Active Chains
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getActiveChains().map((chain, index) => (
                    <span key={index} className="badge badge-primary badge-sm">
                      {chain}
                    </span>
                  ))}
                </div>
                <p className="text-xs opacity-70 mt-2">
                  {getActiveChains().length} chains will receive liquidity allocations
                </p>
              </div>

              {/* Transaction Details */}
              <div className="p-4 bg-base-200 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Transaction Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-70">Contract:</span>
                    <span className="font-mono">{formatAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Method:</span>
                    <span>updateProtocolSettings</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Estimated Gas:</span>
                    <span>~245,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Gas Price:</span>
                    <span>20 gwei</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-warning mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-semibold text-warning mb-1">Important Notice</h4>
                  <p className="text-sm opacity-90">
                    These changes will affect the entire protocol. Please ensure you have reviewed all parameters carefully. 
                    Changes will take effect immediately after transaction confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6">
              <button
                onClick={onCancel}
                className="btn btn-outline"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="btn btn-primary"
                disabled={isProcessing}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Confirm & Submit
              </button>
            </div>
          </>
        )}

        {currentStep === 'confirming' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Processing Transaction</h2>
            <p className="opacity-70 mb-6">
              Please confirm the transaction in your wallet and wait for confirmation...
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-70">Status:</span>
                <span className="text-primary">Pending</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Network:</span>
                <span>Ethereum Mainnet</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
