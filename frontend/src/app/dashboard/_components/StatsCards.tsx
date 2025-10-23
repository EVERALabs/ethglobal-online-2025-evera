import React from "react";


export const StatsCards: React.FC = () => {
  // Mock data - in real app, this would come from API
  const portfolioStats = {
    totalDeposited: 125420.50,
    currentAPY: 8.7,
    activeChains: 4,
    lastRebalance: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  };

  const stats = [
    {
      title: "Total Deposited Value",
      value: `$${portfolioStats.totalDeposited.toLocaleString()}`,
      desc: "Across all chains",
      icon: "💰",
      color: "text-success",
      trend: "+2.3%",
      trendColor: "text-success",
    },
    {
      title: "Current APY",
      value: `${portfolioStats.currentAPY}%`,
      desc: "Weighted average",
      icon: "📈",
      color: "text-primary",
      trend: "+0.5%",
      trendColor: "text-success",
    },
    {
      title: "Active Chains",
      value: portfolioStats.activeChains.toString(),
      desc: "Deployed liquidity",
      icon: "🔗",
      color: "text-info",
      trend: "2 new",
      trendColor: "text-info",
    },
    {
      title: "Last Rebalance",
      value: portfolioStats.lastRebalance.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      desc: portfolioStats.lastRebalance.toLocaleDateString(),
      icon: "⚡",
      color: "text-warning",
      trend: "2h ago",
      trendColor: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="stat bg-white shadow-xl rounded-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="stat-figure">
            <div className={`text-4xl ${stat.color}`}>{stat.icon}</div>
          </div>
          <div className="stat-title text-sm font-medium opacity-70 mb-2 text-gray-900">{stat.title}</div>
          <div className={`stat-value text-3xl font-bold ${stat.color} mb-2 text-gray-900`}>{stat.value}</div>
          <div className="stat-desc flex items-center justify-between">
            <span className="text-sm opacity-70 text-gray-900">{stat.desc}</span>
            {/* <span className={`text-xs font-medium px-2 py-1 rounded-full bg-opacity-20 ${stat.trendColor} ${stat.trendColor === 'text-success' ? 'bg-success' : stat.trendColor === 'text-warning' ? 'bg-warning' : 'bg-info'}`}>
              {stat.trend}
            </span> */}
          </div>
        </div>
      ))}
    </div>
  );
};
