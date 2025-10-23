import React from 'react';

interface SimulationPreviewProps {
  data: {
    amount: string;
    token: string;
    chain: string;
    projectedAllocation: { [chain: string]: number };
    gasEstimate: number;
    bridgePath: string[];
  };
  onConfirm: () => void;
}

const CHAIN_INFO = {
  base: { name: 'Base', icon: '🔵', color: 'text-blue-500' },
  arbitrum: { name: 'Arbitrum', icon: '🔴', color: 'text-red-500' },
  polygon: { name: 'Polygon', icon: '🟣', color: 'text-purple-500' },
  ethereum: { name: 'Ethereum', icon: '⚫', color: 'text-gray-500' },
};

export const SimulationPreview: React.FC<SimulationPreviewProps> = ({ data, onConfirm }) => {
  const totalAmount = parseFloat(data.amount);
  const isAutoAllocation = data.chain === 'auto';

  const calculateAllocationAmount = (percentage: number) => {
    return (totalAmount * percentage / 100).toFixed(2);
  };

  const getChainIcon = (chainId: string) => {
    return CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.icon || '🔗';
  };

  const getChainName = (chainId: string) => {
    return CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.name || chainId;
  };

  const getChainColor = (chainId: string) => {
    return CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.color || 'text-gray-500';
  };

  return (
    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-base-300/50">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔮</span>
        <h2 className="text-2xl font-bold">Simulation Preview</h2>
      </div>

      <div className="space-y-6">
        {/* Deposit Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
          <h3 className="font-bold text-lg mb-3">Deposit Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-70">Amount</div>
              <div className="font-bold text-lg">{data.amount} {data.token}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Strategy</div>
              <div className="font-bold text-lg">
                {isAutoAllocation ? 'Auto-Allocation' : 'Single Chain'}
              </div>
            </div>
          </div>
        </div>

        {/* Projected Allocation */}
        <div>
          <h3 className="font-bold text-lg mb-4">Projected Allocation</h3>
          <div className="space-y-3">
            {Object.entries(data.projectedAllocation).map(([chainId, percentage]) => (
              <div key={chainId} className="flex items-center gap-4 p-3 bg-base-200/50 rounded-lg">
                <span className="text-2xl">{getChainIcon(chainId)}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{getChainName(chainId)}</span>
                    <span className={`font-bold ${getChainColor(chainId)}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm opacity-70">
                    <span>{calculateAllocationAmount(percentage)} {data.token}</span>
                    <span>~{percentage * 0.08 + 6.5}% APY</span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gas Estimate */}
        <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span>⛽</span>
            Gas Estimate
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-70">Estimated Gas</div>
              <div className="font-bold text-lg">{data.gasEstimate} ETH</div>
            </div>
            <div>
              <div className="text-sm opacity-70">USD Value</div>
              <div className="font-bold text-lg">~${(data.gasEstimate * 2500).toFixed(2)}</div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-warning/20 rounded-lg">
            <div className="text-sm font-medium text-warning">
              💡 Gas costs are optimized through L2 chains and batch transactions
            </div>
          </div>
        </div>

        {/* Bridge Path */}
        {isAutoAllocation && (
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>🌉</span>
              Bridge Path
            </h3>
            <div className="flex items-center gap-2 p-3 bg-base-200/50 rounded-lg">
              {data.bridgePath.map((chainId, index) => (
                <React.Fragment key={chainId}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getChainIcon(chainId)}</span>
                    <span className="font-medium">{getChainName(chainId)}</span>
                  </div>
                  {index < data.bridgePath.length - 1 && (
                    <span className="text-primary">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-2 text-sm opacity-70">
              Your funds will be automatically bridged and distributed across chains
            </div>
          </div>
        )}

        {/* Expected Returns */}
        <div className="bg-success/10 rounded-xl p-4 border border-success/20">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span>📈</span>
            Expected Returns
          </h3>
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

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="btn btn-primary btn-lg w-full"
        >
          Confirm Deposit
        </button>
      </div>
    </div>
  );
};
