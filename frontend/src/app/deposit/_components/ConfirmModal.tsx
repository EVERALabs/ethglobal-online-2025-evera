import React, { useState } from 'react';

interface ConfirmModalProps {
  data: {
    amount: string;
    token: string;
    chain: string;
    projectedAllocation: { [chain: string]: number };
    gasEstimate: number;
    bridgePath: string[];
  };
  isProcessing: boolean;
  onCancel: () => void;
  createPosition: (amount: string) => Promise<void>;
  transactionHash?: string;
  isConfirmed?: boolean;
}

const CHAIN_INFO = {
  base: { name: 'Base', icon: '🔵' },
  arbitrum: { name: 'Arbitrum', icon: '🔴' },
  polygon: { name: 'Polygon', icon: '🟣' },
  ethereum: { name: 'Ethereum', icon: '⚫' },
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  data,
  isProcessing,
  onCancel,
  createPosition,
  transactionHash,
  isConfirmed,
}) => {
  const [isLocalProcessing, setIsLocalProcessing] = useState(false);
  const totalAmount = parseFloat(data.amount);
  const isAutoAllocation = data.chain === 'auto';

  const isActuallyProcessing = isProcessing || isLocalProcessing;
  const showTransactionDetails = transactionHash && !isConfirmed;

  const getChainIcon = (chainId: string) => {
    return CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.icon || '🔗';
  };

  const getChainName = (chainId: string) => {
    return CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.name || chainId;
  };

  const calculateAllocationAmount = (percentage: number) => {
    return (totalAmount * percentage / 100).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔍</span>
            <h2 className="text-2xl font-bold">Review Deposit</h2>
          </div>

          <div className="space-y-6">
            {/* Transaction Summary */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
              <h3 className="font-bold text-lg mb-3">Transaction Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-70">Deposit Amount</div>
                  <div className="font-bold text-xl">{data.amount} {data.token}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Strategy</div>
                  <div className="font-bold text-lg">
                    {isAutoAllocation ? 'Auto-Allocation' : 'Single Chain'}
                  </div>
                </div>
              </div>
            </div>

            {/* Allocation Breakdown */}
            <div>
              <h3 className="font-bold text-lg mb-3">Allocation Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(data.projectedAllocation).map(([chainId, percentage]) => (
                  <div key={chainId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getChainIcon(chainId)}</span>
                      <span className="font-semibold">{getChainName(chainId)}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{percentage}%</div>
                      <div className="text-sm opacity-70">
                        {calculateAllocationAmount(percentage)} {data.token}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
              <h3 className="font-bold text-lg mb-3">Cost Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gas Fee</span>
                  <span className="font-semibold">{data.gasEstimate} ETH (~${(data.gasEstimate * 2500).toFixed(2)})</span>
                </div>
                <div className="flex justify-between">
                  <span>Bridge Fee</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Protocol Fee</span>
                  <span className="font-semibold">0.1% (${(totalAmount * 0.001).toFixed(2)})</span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Cost</span>
                  <span>${(data.gasEstimate * 2500 + totalAmount * 0.001).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bridge Path (if auto allocation) */}
            {isAutoAllocation && (
              <div>
                <h3 className="font-bold text-lg mb-3">Bridge Path</h3>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                  {data.bridgePath.map((chainId, index) => (
                    <React.Fragment key={chainId}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getChainIcon(chainId)}</span>
                        <span className="font-medium">{getChainName(chainId)}</span>
                      </div>
                      {index < data.bridgePath.length - 1 && (
                        <span className="text-primary">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Returns */}
            <div className="bg-success/10 rounded-xl p-4 border border-success/20">
              <h3 className="font-bold text-lg mb-3">Expected Returns</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm opacity-70">Daily</div>
                  <div className="font-bold text-success">
                    +${(totalAmount * 0.0002).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Monthly</div>
                  <div className="font-bold text-success">
                    +${(totalAmount * 0.006).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Annual</div>
                  <div className="font-bold text-success">
                    +${(totalAmount * 0.08).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Status (when processing) */}
            {showTransactionDetails && (
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <span className="text-primary text-xl">⏳</span>
                  <div>
                    <div className="font-semibold text-primary mb-1">Transaction Submitted</div>
                    <div className="text-sm opacity-70 mb-3">
                      Your transaction has been submitted and is being processed. Please wait for confirmation.
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm opacity-70">Transaction Hash:</span>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm text-primary hover:text-primary/80 underline"
                        >
                          {`${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`}
                        </a>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-70">Status:</span>
                        <span className="badge badge-warning">Confirming</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warning (only show when not processing) */}
            {!showTransactionDetails && (
              <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                <div className="flex items-start gap-3">
                  <span className="text-warning text-xl">⚠️</span>
                  <div>
                    <div className="font-semibold text-warning mb-1">Important Notice</div>
                    <div className="text-sm opacity-70">
                      This transaction cannot be undone. Your funds will be automatically allocated
                      across chains and may take a few minutes to complete. You can withdraw at any time.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isActuallyProcessing}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (isActuallyProcessing) return; // Prevent multiple clicks

                  setIsLocalProcessing(true);
                  try {
                    await createPosition(data.amount);
                    // Don't call onConfirm() here - let parent handle the flow
                  } catch (error) {
                    console.error('Deposit failed:', error);
                    alert('Deposit failed. Please try again.');
                    setIsLocalProcessing(false); // Reset on error
                  }
                }}
                disabled={isActuallyProcessing}
                className="btn btn-primary flex-1"
              >
                {isActuallyProcessing ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {isLocalProcessing ? 'Signing Transaction...' : 'Processing...'}
                  </>
                ) : (
                  'Confirm Deposit'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
