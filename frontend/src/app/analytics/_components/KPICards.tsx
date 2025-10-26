import React from 'react';

interface KPICardsProps {
  timeframe: '24h' | '7d' | '30d';
}

interface KPIData {
  tvl: {
    value: number;
    change: number;
    changeType: 'positive' | 'negative';
  };
  volume: {
    value: number;
    change: number;
    changeType: 'positive' | 'negative';
  };
  activeUsers: {
    value: number;
    change: number;
    changeType: 'positive' | 'negative';
  };
  rebalances: {
    value: number;
    change: number;
    changeType: 'positive' | 'negative';
  };
}

const getKPIData = (timeframe: '24h' | '7d' | '30d'): KPIData => {
  const data = {
    '24h': {
      tvl: { value: 125420.50, change: 2.3, changeType: 'positive' as const },
      volume: { value: 2847.32, change: 5.7, changeType: 'positive' as const },
      activeUsers: { value: 1247, change: 12.4, changeType: 'positive' as const },
      rebalances: { value: 89, change: -3.2, changeType: 'negative' as const },
    },
    '7d': {
      tvl: { value: 125420.50, change: 8.7, changeType: 'positive' as const },
      volume: { value: 19847.32, change: 15.2, changeType: 'positive' as const },
      activeUsers: { value: 3247, change: 18.9, changeType: 'positive' as const },
      rebalances: { value: 567, change: 7.3, changeType: 'positive' as const },
    },
    '30d': {
      tvl: { value: 125420.50, change: 24.1, changeType: 'positive' as const },
      volume: { value: 78447.32, change: 32.5, changeType: 'positive' as const },
      activeUsers: { value: 8247, change: 28.7, changeType: 'positive' as const },
      rebalances: { value: 2134, change: 19.4, changeType: 'positive' as const },
    },
  };
  
  return data[timeframe];
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num.toFixed(2)}`;
};

const formatCount = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const KPICards: React.FC<KPICardsProps> = ({ timeframe }) => {
  const data = getKPIData(timeframe);

  const kpiItems = [
    {
      title: 'Total Value Locked',
      value: formatNumber(data.tvl.value),
      change: data.tvl.change,
      changeType: data.tvl.changeType,
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Daily Volume',
      value: formatNumber(data.volume.value),
      change: data.volume.change,
      changeType: data.volume.changeType,
      icon: '📊',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Users',
      value: formatCount(data.activeUsers.value),
      change: data.activeUsers.change,
      changeType: data.activeUsers.changeType,
      icon: '👥',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Rebalances',
      value: formatCount(data.rebalances.value),
      change: data.rebalances.change,
      changeType: data.rebalances.changeType,
      icon: '⚖️',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiItems.map((item, index) => (
        <div
          key={index}
          className="card bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
        >
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">{item.icon}</div>
              <div className={`badge badge-sm ${
                item.changeType === 'positive' 
                  ? 'badge-success' 
                  : 'badge-error'
              }`}>
                {item.changeType === 'positive' ? '↗' : '↘'} {Math.abs(item.change)}%
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium opacity-70 uppercase tracking-wide">
                {item.title}
              </h3>
              <div className="text-2xl font-bold">
                {item.value}
              </div>
              <div className="text-xs opacity-50">
                {timeframe} change
              </div>
            </div>
            
            <div className={`mt-4 h-1 bg-gradient-to-r ${item.color} rounded-full opacity-60`} />
          </div>
        </div>
      ))}
    </div>
  );
};
