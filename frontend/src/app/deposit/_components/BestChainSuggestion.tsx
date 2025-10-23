import React from 'react';

interface ChainYield {
  chain: string;
  name: string;
  icon: string;
  apy: number;
  volume: string;
  gasCost: string;
  color: string;
}

const CHAIN_YIELDS: ChainYield[] = [
  {
    chain: 'base',
    name: 'Base',
    icon: '🔵',
    apy: 8.2,
    volume: '$2.4M',
    gasCost: '$0.12',
    color: 'text-blue-500'
  },
  {
    chain: 'arbitrum',
    name: 'Arbitrum',
    icon: '🔴',
    apy: 7.8,
    volume: '$1.8M',
    gasCost: '$0.08',
    color: 'text-red-500'
  },
  {
    chain: 'polygon',
    name: 'Polygon',
    icon: '🟣',
    apy: 7.5,
    volume: '$1.2M',
    gasCost: '$0.05',
    color: 'text-purple-500'
  },
  {
    chain: 'ethereum',
    name: 'Ethereum',
    icon: '⚫',
    apy: 6.9,
    volume: '$3.1M',
    gasCost: '$2.50',
    color: 'text-gray-500'
  }
];

export const BestChainSuggestion: React.FC = () => {
  const bestChain = CHAIN_YIELDS[0]; // Base has the highest APY

  return (
    <div className="space-y-6">
      {/* Best Chain Recommendation */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎯</span>
          <h3 className="text-xl font-bold text-primary">Best Chain Suggestion</h3>
        </div>
        
        <div className="bg-base-100/80 rounded-xl p-4 border border-primary/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{bestChain.icon}</span>
            <div>
              <div className="font-bold text-lg">{bestChain.name} Chain</div>
              <div className="text-sm opacity-70">Based on current volume</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="opacity-70">Best Yield:</span>
              <span className="font-bold text-success text-lg">+{bestChain.apy}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">24h Volume:</span>
              <span className="font-semibold">{bestChain.volume}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">Gas Cost:</span>
              <span className="font-semibold">{bestChain.gasCost}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
          <div className="flex items-center gap-2">
            <span className="text-info">💡</span>
            <span className="text-sm font-medium text-info">
              Auto-allocation will distribute your deposit across multiple chains for optimal yield
            </span>
          </div>
        </div>
      </div>

      {/* Chain Comparison */}
      <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-base-300/50">
        <h3 className="text-xl font-bold mb-4">Chain Comparison</h3>
        
        <div className="space-y-3">
          {CHAIN_YIELDS.map((chain, index) => (
            <div
              key={chain.chain}
              className={`p-3 rounded-lg border transition-all ${
                index === 0
                  ? 'border-primary bg-primary/5'
                  : 'border-base-300 hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{chain.icon}</span>
                  <div>
                    <div className="font-semibold">{chain.name}</div>
                    <div className="text-sm opacity-70">
                      Vol: {chain.volume} • Gas: {chain.gasCost}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${chain.color}`}>
                    {chain.apy}% APY
                  </div>
                  {index === 0 && (
                    <div className="badge badge-success badge-sm">Best</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-base-300/50">
        <h3 className="text-xl font-bold mb-4">Market Insights</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
            <span className="text-success">📈</span>
            <div>
              <div className="font-semibold text-success">High Volume Period</div>
              <div className="text-sm opacity-70">Base chain showing 15% higher volume than usual</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
            <span className="text-warning">⛽</span>
            <div>
              <div className="font-semibold text-warning">Gas Optimization</div>
              <div className="text-sm opacity-70">L2 chains offer 95% lower gas costs</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-info/10 rounded-lg border border-info/20">
            <span className="text-info">🔄</span>
            <div>
              <div className="font-semibold text-info">Auto-Rebalancing</div>
              <div className="text-sm opacity-70">Portfolio rebalances every 24h for optimal yield</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
