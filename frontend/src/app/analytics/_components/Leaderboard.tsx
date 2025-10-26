import React from 'react';

interface LeaderboardProps {
  timeframe: '24h' | '7d' | '30d';
}

interface ChainPerformance {
  name: string;
  symbol: string;
  tvl: number;
  volume: number;
  apy: number;
  change: number;
  color: string;
  icon: string;
}

interface PoolPerformance {
  name: string;
  chain: string;
  tvl: number;
  volume: number;
  apy: number;
  users: number;
  color: string;
}

const getChainData = (timeframe: '24h' | '7d' | '30d'): ChainPerformance[] => {
  const baseData = [
    {
      name: 'Base',
      symbol: 'BASE',
      tvl: 52000,
      volume: 15420,
      apy: 8.7,
      change: 12.4,
      color: 'bg-blue-600',
      icon: '🔵',
    },
    {
      name: 'Arbitrum',
      symbol: 'ARB',
      tvl: 45000,
      volume: 12850,
      apy: 7.9,
      change: 8.7,
      color: 'bg-blue-500',
      icon: '🔷',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      tvl: 135000,
      volume: 45200,
      apy: 6.2,
      change: 5.3,
      color: 'bg-gray-600',
      icon: '⚫',
    },
    {
      name: 'Polygon',
      symbol: 'MATIC',
      tvl: 29000,
      volume: 8750,
      apy: 9.1,
      change: 15.2,
      color: 'bg-purple-600',
      icon: '🟣',
    },
    {
      name: 'Optimism',
      symbol: 'OP',
      tvl: 18000,
      volume: 5200,
      apy: 8.3,
      change: 18.9,
      color: 'bg-red-600',
      icon: '🔴',
    },
  ];

  // Adjust data based on timeframe
  const multiplier = timeframe === '24h' ? 0.3 : timeframe === '7d' ? 1 : 3;
  return baseData.map(chain => ({
    ...chain,
    tvl: chain.tvl * multiplier,
    volume: chain.volume * multiplier,
    change: chain.change * (timeframe === '24h' ? 0.5 : timeframe === '7d' ? 1 : 1.5),
  }));
};

const getPoolData = (timeframe: '24h' | '7d' | '30d'): PoolPerformance[] => {
  const baseData = [
    {
      name: 'USDC/USDT Pool',
      chain: 'Base',
      tvl: 25000,
      volume: 8500,
      apy: 12.4,
      users: 1247,
      color: 'bg-green-600',
    },
    {
      name: 'ETH/WETH Pool',
      chain: 'Arbitrum',
      tvl: 18000,
      volume: 6200,
      apy: 9.8,
      users: 892,
      color: 'bg-blue-600',
    },
    {
      name: 'DAI/USDC Pool',
      chain: 'Ethereum',
      tvl: 35000,
      volume: 12000,
      apy: 7.2,
      users: 2156,
      color: 'bg-gray-600',
    },
    {
      name: 'MATIC/USDC Pool',
      chain: 'Polygon',
      tvl: 12000,
      volume: 3800,
      apy: 11.7,
      users: 634,
      color: 'bg-purple-600',
    },
    {
      name: 'OP/USDC Pool',
      chain: 'Optimism',
      tvl: 8500,
      volume: 2400,
      apy: 13.1,
      users: 423,
      color: 'bg-red-600',
    },
  ];

  // Adjust data based on timeframe
  const multiplier = timeframe === '24h' ? 0.3 : timeframe === '7d' ? 1 : 3;
  return baseData.map(pool => ({
    ...pool,
    tvl: pool.tvl * multiplier,
    volume: pool.volume * multiplier,
    users: Math.round(pool.users * multiplier),
  }));
};

const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const formatCount = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ timeframe }) => {
  const chainData = getChainData(timeframe);
  const poolData = getPoolData(timeframe);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Top Performing Chains */}
      <div className="card bg-white shadow-xl border border-gray-200">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Top Performing Chains</h3>
              <p className="text-sm opacity-70">By TVL and volume</p>
            </div>
            <div className="text-sm opacity-70">
              {timeframe.toUpperCase()}
            </div>
          </div>

          <div className="space-y-4">
            {chainData.map((chain, index) => (
              <div
                key={chain.name}
                className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{chain.icon}</div>
                    <div>
                      <div className="font-semibold">{chain.name}</div>
                      <div className="text-sm opacity-70">{chain.symbol}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold">{formatValue(chain.tvl)}</div>
                    <div className="text-xs opacity-70">TVL</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatValue(chain.volume)}</div>
                    <div className="text-xs opacity-70">Volume</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{chain.apy}%</div>
                    <div className="text-xs opacity-70">APY</div>
                  </div>
                  <div className={`text-right ${chain.change > 0 ? 'text-success' : 'text-error'}`}>
                    <div className="font-semibold">
                      {chain.change > 0 ? '+' : ''}{chain.change.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-70">Change</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Active Pools */}
      <div className="card bg-white shadow-xl border border-gray-200">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Most Active Pools</h3>
              <p className="text-sm opacity-70">By users and volume</p>
            </div>
            <div className="text-sm opacity-70">
              {timeframe.toUpperCase()}
            </div>
          </div>

          <div className="space-y-4">
            {poolData.map((pool, index) => (
              <div
                key={pool.name}
                className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{pool.name}</div>
                    <div className="text-sm opacity-70">{pool.chain}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold">{formatValue(pool.tvl)}</div>
                    <div className="text-xs opacity-70">TVL</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatValue(pool.volume)}</div>
                    <div className="text-xs opacity-70">Volume</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{pool.apy}%</div>
                    <div className="text-xs opacity-70">APY</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCount(pool.users)}</div>
                    <div className="text-xs opacity-70">Users</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
