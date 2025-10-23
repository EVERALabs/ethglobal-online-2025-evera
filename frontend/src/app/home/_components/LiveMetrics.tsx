import React, { useState, useEffect } from 'react';

export const LiveMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    tvl: 2400000,
    rebalances: 847,
    topChain: 'Base',
    avgYield: 12.4,
    gasSaved: 15600,
    activeUsers: 1247
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        rebalances: prev.rebalances + Math.floor(Math.random() * 3),
        tvl: prev.tvl + Math.floor(Math.random() * 10000),
        avgYield: prev.avgYield + (Math.random() - 0.5) * 0.1
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString()}`;
  };

  const metricCards = [
    {
      title: "Total TVL",
      value: formatCurrency(metrics.tvl),
      change: "+12.4%",
      changeType: "positive",
      icon: "💎",
      description: "Across all chains"
    },
    {
      title: "Rebalances Today",
      value: metrics.rebalances.toLocaleString(),
      change: "+23",
      changeType: "positive", 
      icon: "⚡",
      description: "Last 24 hours"
    },
    {
      title: "Top Performing Chain",
      value: metrics.topChain,
      change: "15.2% APY",
      changeType: "positive",
      icon: "🚀",
      description: "Highest yield"
    },
    {
      title: "Average Yield",
      value: `${metrics.avgYield.toFixed(1)}%`,
      change: "+0.3%",
      changeType: "positive",
      icon: "📈",
      description: "Weighted average"
    },
    {
      title: "Gas Saved",
      value: formatNumber(metrics.gasSaved),
      change: "$1,200",
      changeType: "positive",
      icon: "⛽",
      description: "This week"
    },
    {
      title: "Active Users",
      value: metrics.activeUsers.toLocaleString(),
      change: "+89",
      changeType: "positive",
      icon: "👥",
      description: "Currently online"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Live Metrics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time data from our cross-chain liquidity management platform
          </p>
          <div className="inline-flex items-center mt-4 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-green-700 text-sm font-medium">Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricCards.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{metric.icon}</div>
                <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  metric.changeType === 'positive' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {metric.change}
                </div>
              </div>
              
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-500">
                  {metric.description}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-700">
                {metric.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Chain Performance Chart Placeholder */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Chain Performance</h3>
            <p className="text-gray-600">Yield comparison across supported networks</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Base', 'Arbitrum', 'Ethereum', 'Optimism', 'Polygon', 'Linea'].map((chain, index) => (
              <div key={chain} className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-3 mx-auto border-2 border-blue-200 shadow-sm">
                  <span className="text-blue-600 font-bold text-sm">{chain.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="text-gray-900 font-semibold">{chain}</div>
                <div className="text-green-600 text-sm font-medium">{12.4 + (index * 0.8)}% APY</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
