import React from "react";

interface ChainData {
  chain: string;
  allocation: number;
  volume: number;
  color: string;
  icon: string;
}

interface PortfolioChartProps {
  className?: string;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ className = "" }) => {
  // Mock data - in real app, this would come from API
  const chainData: ChainData[] = [
    {
      chain: "Ethereum",
      allocation: 35.2,
      volume: 44148.18,
      color: "#627EEA",
      icon: "⟠",
    },
    {
      chain: "Arbitrum",
      allocation: 28.7,
      volume: 36000.68,
      color: "#28A0F0",
      icon: "🔷",
    },
    {
      chain: "Polygon",
      allocation: 22.1,
      volume: 27717.93,
      color: "#8247E5",
      icon: "⬟",
    },
    {
      chain: "Base",
      allocation: 14.0,
      volume: 17553.71,
      color: "#0052FF",
      icon: "🔵",
    },
  ];

  const totalValue = chainData.reduce((sum, chain) => sum + chain.volume, 0);

  // Calculate cumulative percentage for pie chart segments

  return (
    <div className={`card bg-white shadow-xl border border-gray-200 ${className}`}>
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="card-title text-xl">Portfolio Distribution</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-success">
              ${totalValue.toLocaleString()}
            </div>
            <div className="text-sm opacity-70">Total Value</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart Visualization */}
          <div className="flex items-center justify-center hover:">
            <div className="relative w-48 h-48">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {chainData.map((chain, index) => {
                  const radius = 40;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = circumference;
                  const strokeDashoffset = circumference - (chain.allocation / 100) * circumference;
                  
                  return (
                    <circle 
                      key={index}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={chain.color}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 hover:stroke-width-10 hover:stroke-primary"
                      style={{
                        strokeDashoffset: strokeDashoffset,
                      }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {chainData.length}
                  </div>
                  <div className="text-sm opacity-70">Chains</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chain Details */}
          <div className="space-y-4">
            {chainData.map((chain, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: chain.color }}
                  ></div>
                  <div className="text-lg">{chain.icon}</div>
                  <div>
                    <div className="font-semibold">{chain.chain}</div>
                    <div className="text-sm opacity-70">
                      ${chain.volume.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">
                    {chain.allocation}%
                  </div>
                  <div className="text-sm opacity-70">Allocation</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="divider"></div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-info">
              {chainData.length}
            </div>
            <div className="text-sm opacity-70">Active Chains</div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">
              {chainData.reduce((sum, chain) => sum + chain.allocation, 0).toFixed(1)}%
            </div>
            <div className="text-sm opacity-70">Total Allocation</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {Math.max(...chainData.map(c => c.allocation)).toFixed(1)}%
            </div>
            <div className="text-sm opacity-70">Max Single Chain</div>
          </div>
        </div>
      </div>
    </div>
  );
};
