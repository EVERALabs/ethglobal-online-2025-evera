import React from 'react';

interface VolumeRebalanceChartProps {
  timeframe: '24h' | '7d' | '30d';
  selectedChains: string[];
}

interface VolumeRebalanceData {
  timestamp: string;
  volume: number;
  rebalances: number;
}

const generateMockData = (timeframe: '24h' | '7d' | '30d'): VolumeRebalanceData[] => {
  const dataPoints = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
  const data: VolumeRebalanceData[] = [];
  
  const baseVolume = [2000, 2500, 1800, 3200, 2800, 3500, 4000];
  const baseRebalances = [12, 15, 8, 20, 18, 25, 30];

  for (let i = 0; i < dataPoints; i++) {
    const baseIndex = i % baseVolume.length;
    const date = new Date();
    date.setHours(date.getHours() - (dataPoints - i) * (timeframe === '24h' ? 1 : timeframe === '7d' ? 24 : 24));
    
    data.push({
      timestamp: date.toISOString(),
      volume: baseVolume[baseIndex] + Math.random() * 1000 - 500,
      rebalances: baseRebalances[baseIndex] + Math.floor(Math.random() * 10 - 5),
    });
  }
  
  return data;
};

const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const formatTimestamp = (timestamp: string, timeframe: '24h' | '7d' | '30d'): string => {
  const date = new Date(timestamp);
  if (timeframe === '24h') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (timeframe === '7d') {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export const VolumeRebalanceChart: React.FC<VolumeRebalanceChartProps> = ({
  timeframe,
  selectedChains,
}) => {
  const data = generateMockData(timeframe);
  const maxVolume = Math.max(...data.map(d => d.volume));
  const maxRebalances = Math.max(...data.map(d => d.rebalances));

  return (
    <div className="card bg-white shadow-xl border border-gray-200">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Volume vs Rebalance Frequency</h3>
            <p className="text-sm opacity-70">Trading activity correlation</p>
          </div>
          <div className="text-sm opacity-70">
            {timeframe.toUpperCase()} • {selectedChains.length} chains
          </div>
        </div>

      {/* Dual Y-axis Chart */}
      <div className="relative h-64 mb-4">
        <svg className="w-full h-full" viewBox="0 0 800 200">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <g key={index}>
              <line
                x1="0"
                y1={200 * ratio}
                x2="800"
                y2={200 * ratio}
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>
          ))}

          {/* Volume bars */}
          {data.map((d, index) => {
            const x = (index / (data.length - 1)) * 800;
            const barWidth = 800 / data.length * 0.6;
            const barHeight = (d.volume / maxVolume) * 200 * 0.8;
            const y = 200 - barHeight;
            
            return (
              <rect
                key={`volume-${index}`}
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3b82f6"
                opacity="0.6"
              />
            );
          })}

          {/* Rebalance line */}
          <polyline
            points={data.map((d, index) => {
              const x = (index / (data.length - 1)) * 800;
              const y = 200 - ((d.rebalances / maxRebalances) * 200 * 0.8);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            opacity="0.9"
          />

          {/* Rebalance points */}
          {data.map((d, index) => {
            const x = (index / (data.length - 1)) * 800;
            const y = 200 - ((d.rebalances / maxRebalances) * 200 * 0.8);
            return (
              <circle
                key={`rebalance-${index}`}
                cx={x}
                cy={y}
                r="3"
                fill="#ef4444"
                opacity="0.9"
              />
            );
          })}
        </svg>
      </div>

        {/* Y-axis labels */}
        <div className="flex justify-between mb-4">
          <div className="text-xs opacity-70">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded opacity-60" />
              Volume (USD)
            </div>
            <div className="text-right">
              {formatValue(maxVolume)}
            </div>
          </div>
          <div className="text-xs opacity-70">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              Rebalances
            </div>
            <div className="text-right">
              {maxRebalances}
            </div>
          </div>
        </div>

        {/* Legend and stats */}
        <div className="flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded opacity-60" />
              <span className="text-sm">Volume</span>
              <span className="text-sm opacity-70">
                {formatValue(data.reduce((sum, d) => sum + d.volume, 0) / data.length)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm">Rebalances</span>
              <span className="text-sm opacity-70">
                {Math.round(data.reduce((sum, d) => sum + d.rebalances, 0) / data.length)}
              </span>
            </div>
          </div>
          
          <div className="text-xs opacity-70">
            Correlation: <span className="text-success">+0.73</span>
          </div>
        </div>

        {/* Time axis */}
        <div className="flex justify-between mt-4 text-xs opacity-70">
          <span>{formatTimestamp(data[0].timestamp, timeframe)}</span>
          <span>{formatTimestamp(data[data.length - 1].timestamp, timeframe)}</span>
        </div>
      </div>
    </div>
  );
};
