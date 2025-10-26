import React from 'react';

interface ChainLiquidityChartProps {
  timeframe: '24h' | '7d' | '30d';
  selectedChains: string[];
}

interface LiquidityData {
  timestamp: string;
  base: number;
  arbitrum: number;
  polygon: number;
  ethereum: number;
  optimism: number;
  avalanche: number;
}

const generateMockData = (timeframe: '24h' | '7d' | '30d'): LiquidityData[] => {
  const dataPoints = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
  const data: LiquidityData[] = [];
  
  const baseValues = [45000, 47000, 46000, 48000, 49000, 50000, 52000];
  const arbitrumValues = [38000, 40000, 39000, 41000, 42000, 43000, 45000];
  const polygonValues = [25000, 26000, 25500, 27000, 27500, 28000, 29000];
  const ethereumValues = [120000, 125000, 123000, 128000, 130000, 132000, 135000];
  const optimismValues = [15000, 16000, 15500, 16500, 17000, 17500, 18000];
  const avalancheValues = [8000, 8500, 8200, 8800, 9000, 9200, 9500];

  for (let i = 0; i < dataPoints; i++) {
    const baseIndex = i % baseValues.length;
    const date = new Date();
    date.setHours(date.getHours() - (dataPoints - i) * (timeframe === '24h' ? 1 : timeframe === '7d' ? 24 : 24));
    
    data.push({
      timestamp: date.toISOString(),
      base: baseValues[baseIndex] + Math.random() * 2000 - 1000,
      arbitrum: arbitrumValues[baseIndex] + Math.random() * 2000 - 1000,
      polygon: polygonValues[baseIndex] + Math.random() * 1000 - 500,
      ethereum: ethereumValues[baseIndex] + Math.random() * 5000 - 2500,
      optimism: optimismValues[baseIndex] + Math.random() * 1000 - 500,
      avalanche: avalancheValues[baseIndex] + Math.random() * 500 - 250,
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

const chainColors = {
  base: '#0052ff',
  arbitrum: '#28a0f0',
  polygon: '#8247e5',
  ethereum: '#627eea',
  optimism: '#ff0420',
  avalanche: '#e84142',
};

export const ChainLiquidityChart: React.FC<ChainLiquidityChartProps> = ({
  timeframe,
  selectedChains,
}) => {
  const data = generateMockData(timeframe);
  const maxValue = Math.max(...data.flatMap(d => 
    selectedChains.map(chain => d[chain as keyof LiquidityData] as number)
  ));

  return (
    <div className="card bg-white shadow-xl border border-gray-200">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Chain Liquidity Trends</h3>
            <p className="text-sm opacity-70">Total value locked across chains</p>
          </div>
          <div className="text-sm opacity-70">
            {timeframe.toUpperCase()} • {selectedChains.length} chains
          </div>
        </div>

      {/* Chart Area */}
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
              <text
                x="-10"
                y={200 * ratio + 4}
                fill="#9ca3af"
                fontSize="10"
                textAnchor="end"
              >
                {formatValue(maxValue * (1 - ratio))}
              </text>
            </g>
          ))}

          {/* Data lines for selected chains */}
          {selectedChains.map((chain) => {
            const points = data.map((d, index) => {
              const x = (index / (data.length - 1)) * 800;
              const y = 200 - ((d[chain as keyof LiquidityData] as number) / maxValue) * 200;
              return `${x},${y}`;
            }).join(' ');

            return (
              <g key={chain}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={chainColors[chain as keyof typeof chainColors]}
                  strokeWidth="2"
                  opacity="0.8"
                />
                {/* Data points */}
                {data.map((d, index) => {
                  const x = (index / (data.length - 1)) * 800;
                  const y = 200 - ((d[chain as keyof LiquidityData] as number) / maxValue) * 200;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={chainColors[chain as keyof typeof chainColors]}
                      opacity="0.9"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {selectedChains.map((chain) => (
            <div key={chain} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: chainColors[chain as keyof typeof chainColors] }}
              />
              <span className="text-sm capitalize">{chain}</span>
              <span className="text-sm opacity-70">
                {formatValue(data[data.length - 1][chain as keyof LiquidityData] as number)}
              </span>
            </div>
          ))}
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
