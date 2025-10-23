import React, { useState, useEffect } from "react";

interface ChainAllocation {
  chain: string;
  current: number;
  target: number;
  color: string;
  icon: string;
  max: number;
  min: number;
}

export const ManualOverride: React.FC = () => {
  const [allocations, setAllocations] = useState<ChainAllocation[]>([
    {
      chain: "Ethereum",
      current: 35.2,
      target: 35.2,
      color: "#627EEA",
      icon: "⟠",
      max: 50,
      min: 10
    },
    {
      chain: "Arbitrum",
      current: 28.7,
      target: 28.7,
      color: "#28A0F0",
      icon: "🔷",
      max: 40,
      min: 5
    },
    {
      chain: "Polygon",
      current: 22.1,
      target: 22.1,
      color: "#8247E5",
      icon: "⬟",
      max: 35,
      min: 5
    },
    {
      chain: "Base",
      current: 14.0,
      target: 14.0,
      color: "#0052FF",
      icon: "🔵",
      max: 30,
      min: 5
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [totalAllocation, setTotalAllocation] = useState(100);

  useEffect(() => {
    const total = allocations.reduce((sum, chain) => sum + chain.target, 0);
    setTotalAllocation(total);
  }, [allocations]);

  const handleSliderChange = (index: number, value: number) => {
    const newAllocations = [...allocations];
    newAllocations[index].target = Math.max(newAllocations[index].min, Math.min(newAllocations[index].max, value));
    setAllocations(newAllocations);
  };

  const handleInputChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    handleSliderChange(index, numValue);
  };

  const resetToCurrent = () => {
    const resetAllocations = allocations.map(chain => ({
      ...chain,
      target: chain.current
    }));
    setAllocations(resetAllocations);
  };

  const applyRecommended = () => {
    // Apply the primary AI recommendation
    const recommendedAllocations = allocations.map(chain => {
      switch (chain.chain) {
        case "Arbitrum":
          return { ...chain, target: 13.7 }; // -15%
        case "Base":
          return { ...chain, target: 29.0 }; // +15%
        default:
          return { ...chain, target: chain.current };
      }
    });
    setAllocations(recommendedAllocations);
  };

  const getTotalStatus = () => {
    if (Math.abs(totalAllocation - 100) < 0.1) {
      return { color: "text-success", bg: "bg-success/10", border: "border-success/20" };
    } else if (Math.abs(totalAllocation - 100) < 5) {
      return { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" };
    } else {
      return { color: "text-error", bg: "bg-error/10", border: "border-error/20" };
    }
  };

  const totalStatus = getTotalStatus();

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="card-title text-xl text-primary">
            ⚙️ Manual Override
          </h3>
          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${isEditing ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Total Allocation Status */}
        <div className={`alert ${totalStatus.bg} ${totalStatus.border} border mb-6`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span className="font-semibold">Total Allocation:</span>
            </div>
            <div className={`text-xl font-bold ${totalStatus.color}`}>
              {totalAllocation.toFixed(1)}%
            </div>
          </div>
          {Math.abs(totalAllocation - 100) >= 0.1 && (
            <div className="text-sm opacity-70 mt-1">
              {totalAllocation > 100 ? 'Over-allocated' : 'Under-allocated'} by {Math.abs(totalAllocation - 100).toFixed(1)}%
            </div>
          )}
        </div>

        {/* Chain Allocation Controls */}
        <div className="space-y-4">
          {allocations.map((chain, index) => (
            <div key={chain.chain} className="p-4 bg-base-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: chain.color }}
                  ></div>
                  <div className="text-lg">{chain.icon}</div>
                  <div>
                    <div className="font-semibold">{chain.chain}</div>
                    <div className="text-sm opacity-70">
                      Current: {chain.current}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="input input-bordered input-sm w-20"
                        value={chain.target.toFixed(1)}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        min={chain.min}
                        max={chain.max}
                        step="0.1"
                      />
                      <span className="text-sm opacity-70">%</span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        {chain.target}%
                      </div>
                      <div className="text-sm opacity-70">
                        {chain.target > chain.current ? '+' : ''}{(chain.target - chain.current).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <input
                    type="range"
                    min={chain.min}
                    max={chain.max}
                    value={chain.target}
                    onChange={(e) => handleSliderChange(index, parseFloat(e.target.value))}
                    className="range range-primary range-sm"
                    step="0.1"
                  />
                  <div className="flex justify-between text-xs opacity-70">
                    <span>Min: {chain.min}%</span>
                    <span>Max: {chain.max}%</span>
                  </div>
                </div>
              )}

              {/* Change Indicator */}
              {Math.abs(chain.target - chain.current) > 0.1 && (
                <div className={`mt-2 p-2 rounded ${
                  chain.target > chain.current 
                    ? 'bg-success/10 text-success border border-success/20' 
                    : 'bg-error/10 text-error border border-error/20'
                }`}>
                  <div className="text-sm font-medium">
                    {chain.target > chain.current ? '↗️ Increase' : '↘️ Decrease'}: 
                    {Math.abs(chain.target - chain.current).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="divider"></div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm flex-1"
              disabled={Math.abs(totalAllocation - 100) >= 0.1}
            >
              Apply Manual Settings
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={applyRecommended}
            >
              Use AI Recommendation
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-ghost btn-sm flex-1"
              onClick={resetToCurrent}
            >
              Reset to Current
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const balanced = allocations.map(chain => ({
                  ...chain,
                  target: 100 / allocations.length
                }));
                setAllocations(balanced);
              }}
            >
              Equal Distribution
            </button>
          </div>
        </div>

        {/* Validation Messages */}
        {Math.abs(totalAllocation - 100) >= 0.1 && (
          <div className="alert alert-warning mt-4">
            <span>⚠️</span>
            <span>
              Total allocation must equal 100%. Current total: {totalAllocation.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
