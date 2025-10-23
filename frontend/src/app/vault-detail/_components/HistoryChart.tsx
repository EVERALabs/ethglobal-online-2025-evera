import React, { useState, useMemo } from 'react';

interface VaultData {
  id: string;
  name: string;
  token: {
    symbol: string;
    name: string;
    icon: string;
  };
  currentValue: number;
  lifetimeYield: number;
  chainDistribution: {
    [chainId: string]: {
      name: string;
      percentage: number;
      value: number;
    };
  };
  history: {
    timestamp: number;
    value: number;
    rebalance?: boolean;
  }[];
}

interface HistoryChartProps {
  vault: VaultData;
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ vault }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const now = Date.now();
    const ranges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
    };

    const cutoff = now - ranges[timeRange];
    return vault.history.filter(point => point.timestamp >= cutoff);
  }, [vault.history, timeRange]);

  // Calculate chart dimensions and scaling
  const chartHeight = 300;
  const chartWidth = 800;
  const padding = { top: 20, right: 40, bottom: 40, left: 60 };

  const minValue = Math.min(...filteredData.map(d => d.value));
  const maxValue = Math.max(...filteredData.map(d => d.value));
  const valueRange = maxValue - minValue;
  const paddingValue = valueRange * 0.1;

  const scaleX = (timestamp: number) => {
    const minTime = Math.min(...filteredData.map(d => d.timestamp));
    const maxTime = Math.max(...filteredData.map(d => d.timestamp));
    const timeRange = maxTime - minTime;
    return padding.left + ((timestamp - minTime) / timeRange) * (chartWidth - padding.left - padding.right);
  };

  const scaleY = (value: number) => {
    return padding.top + ((maxValue + paddingValue - value) / (valueRange + 2 * paddingValue)) * (chartHeight - padding.top - padding.bottom);
  };

  // Generate SVG path for the line
  const pathData = filteredData
    .map((point, index) => {
      const x = scaleX(point.timestamp);
      const y = scaleY(point.value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Generate area path for fill
  const areaData = `${pathData} L ${scaleX(filteredData[filteredData.length - 1].timestamp)} ${chartHeight - padding.bottom} L ${scaleX(filteredData[0].timestamp)} ${chartHeight - padding.bottom} Z`;

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">Value History</h3>
          <p className="text-sm text-base-content/60">
            Performance over time with rebalance events
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 text-base-content hover:bg-base-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = minValue + (maxValue - minValue) * ratio;
            const y = scaleY(value);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-base-content/60"
                >
                  {formatCurrency(value)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={areaData}
            fill="url(#gradient)"
            opacity="0.3"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />

          {/* Data points */}
          {filteredData.map((point, index) => (
            <g key={index}>
              <circle
                cx={scaleX(point.timestamp)}
                cy={scaleY(point.value)}
                r={point.rebalance ? "6" : "4"}
                fill={point.rebalance ? "currentColor" : "currentColor"}
                className={point.rebalance ? "text-warning" : "text-primary"}
                stroke="white"
                strokeWidth="2"
              />
              {point.rebalance && (
                <circle
                  cx={scaleX(point.timestamp)}
                  cy={scaleY(point.value)}
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-warning"
                  opacity="0.5"
                />
              )}
            </g>
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" className="text-primary" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
            </linearGradient>
          </defs>
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-base-content/60">Value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-base-content/60">Rebalance Event</span>
          </div>
        </div>
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-base-300">
        <div className="text-center">
          <div className="text-lg font-bold text-success">
            {formatCurrency(maxValue)}
          </div>
          <div className="text-xs text-base-content/60">Peak Value</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">
            {formatCurrency(filteredData[0]?.value || 0)}
          </div>
          <div className="text-xs text-base-content/60">Starting Value</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-secondary">
            {formatCurrency(maxValue - (filteredData[0]?.value || 0))}
          </div>
          <div className="text-xs text-base-content/60">Total Gain</div>
        </div>
      </div>
      </div>
    </div>
  );
};
