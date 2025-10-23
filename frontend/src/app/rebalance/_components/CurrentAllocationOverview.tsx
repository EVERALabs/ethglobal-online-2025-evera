import React from "react";

interface ChainData {
  chain: string;
  currentAllocation: number;
  volume: number;
  color: string;
  icon: string;
  apy: number;
  trend: number;
}

export const CurrentAllocationOverview: React.FC = () => {
  // Mock data - in real app, this would come from API
  const chainData: ChainData[] = [
    {
      chain: "Ethereum",
      currentAllocation: 35.2,
      volume: 44148.18,
      color: "#627EEA",
      icon: "⟠",
      apy: 8.2,
      trend: 2.3
    },
    {
      chain: "Arbitrum",
      currentAllocation: 28.7,
      volume: 36000.68,
      color: "#28A0F0",
      icon: "🔷",
      apy: 9.1,
      trend: -1.2
    },
    {
      chain: "Polygon",
      currentAllocation: 22.1,
      volume: 27717.93,
      color: "#8247E5",
      icon: "⬟",
      apy: 7.8,
      trend: 0.8
    },
    {
      chain: "Base",
      currentAllocation: 14.0,
      volume: 17553.71,
      color: "#0052FF",
      icon: "🔵",
      apy: 10.5,
      trend: 3.1
    },
  ];

  const totalValue = chainData.reduce((sum, chain) => sum + chain.volume, 0);
  const weightedAPY = chainData.reduce((sum, chain) => 
    sum + (chain.apy * chain.currentAllocation / 100), 0
  );

  // Calculate cumulative percentage for pie chart segments
  let cumulativePercentage = 0;

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="card-title text-xl text-primary">
            📊 Current Allocation Overview
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-success">
              ${totalValue.toLocaleString()}
            </div>
            <div className="text-sm opacity-70">Total Value</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Pie Chart Visualization */}
          <div className="flex items-center justify-center">
            <div className="relative w-56 h-56">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {chainData.map((chain, index) => {
                  const radius = 42;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = circumference;
                  const strokeDashoffset = circumference - (chain.currentAllocation / 100) * circumference;
                  
                  cumulativePercentage += chain.currentAllocation;
                  
                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={chain.color}
                      strokeWidth="6"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 hover:stroke-width-8 cursor-pointer"
                      style={{
                        strokeDashoffset: strokeDashoffset,
                      }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {weightedAPY.toFixed(1)}%
                  </div>
                  <div className="text-sm opacity-70">Weighted APY</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Chain Details */}
          <div className="space-y-3">
            {chainData.map((chain, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-all duration-200 border border-transparent hover:border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-5 h-5 rounded-full shadow-sm"
                    style={{ backgroundColor: chain.color }}
                  ></div>
                  <div className="text-xl">{chain.icon}</div>
                  <div>
                    <div className="font-semibold text-lg">{chain.chain}</div>
                    <div className="text-sm opacity-70">
                      ${chain.volume.toLocaleString()} • {chain.apy}% APY
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary text-lg">
                    {chain.currentAllocation}%
                  </div>
                  <div className={`text-sm font-medium ${
                    chain.trend >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {chain.trend >= 0 ? '+' : ''}{chain.trend}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="divider"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-base-200 rounded-lg">
            <div className="text-xl font-bold text-info">
              {chainData.length}
            </div>
            <div className="text-sm opacity-70">Active Chains</div>
          </div>
          <div className="p-3 bg-base-200 rounded-lg">
            <div className="text-xl font-bold text-success">
              {chainData.reduce((sum, chain) => sum + chain.currentAllocation, 0).toFixed(1)}%
            </div>
            <div className="text-sm opacity-70">Total Allocation</div>
          </div>
          <div className="p-3 bg-base-200 rounded-lg">
            <div className="text-xl font-bold text-warning">
              {Math.max(...chainData.map(c => c.currentAllocation)).toFixed(1)}%
            </div>
            <div className="text-sm opacity-70">Max Single Chain</div>
          </div>
          <div className="p-3 bg-base-200 rounded-lg">
            <div className="text-xl font-bold text-primary">
              {weightedAPY.toFixed(1)}%
            </div>
            <div className="text-sm opacity-70">Weighted APY</div>
          </div>
        </div>
      </div>
    </div>
  );
};
