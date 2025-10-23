import React, { useState } from 'react';

interface StrategyParams {
  rebalanceThreshold: number;
  minLiquidityPerChain: number;
  maxSlippage: number;
  gasPriceMultiplier: number;
}

interface StrategyParametersProps {
  params: StrategyParams;
  onChange: (params: StrategyParams) => void;
}

export const StrategyParameters: React.FC<StrategyParametersProps> = ({
  params,
  onChange,
}) => {
  const [localParams, setLocalParams] = useState<StrategyParams>(params);

  const handleParamChange = (key: keyof StrategyParams, value: number) => {
    const newParams = { ...localParams, [key]: value };
    setLocalParams(newParams);
    onChange(newParams);
  };

  const resetToDefaults = () => {
    const defaults: StrategyParams = {
      rebalanceThreshold: 5.0,
      minLiquidityPerChain: 10000,
      maxSlippage: 0.5,
      gasPriceMultiplier: 1.2,
    };
    setLocalParams(defaults);
    onChange(defaults);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">Strategy Parameters</h2>
            <p className="text-sm opacity-70">Configure rebalancing and liquidity thresholds</p>
          </div>
        </div>
        <button
          onClick={resetToDefaults}
          className="btn btn-outline btn-sm"
        >
          Reset Defaults
        </button>
      </div>

      <div className="space-y-6">
        {/* Rebalance Threshold */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Rebalance Threshold (%)</span>
            <span className="label-text-alt text-primary font-mono">
              {localParams.rebalanceThreshold}%
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={localParams.rebalanceThreshold}
            onChange={(e) => handleParamChange('rebalanceThreshold', parseFloat(e.target.value))}
            className="range range-primary range-sm"
          />
          <div className="flex justify-between text-xs opacity-70 px-2">
            <span>1%</span>
            <span>10%</span>
            <span>20%</span>
          </div>
          <div className="label">
            <span className="label-text-alt opacity-70">
              Triggers rebalancing when allocation deviates by this amount
            </span>
          </div>
        </div>

        {/* Minimum Liquidity Per Chain */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Minimum Liquidity Per Chain (USD)</span>
            <span className="label-text-alt text-primary font-mono">
              ${localParams.minLiquidityPerChain.toLocaleString()}
            </span>
          </label>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={localParams.minLiquidityPerChain}
            onChange={(e) => handleParamChange('minLiquidityPerChain', parseInt(e.target.value))}
            className="range range-primary range-sm"
          />
          <div className="flex justify-between text-xs opacity-70 px-2">
            <span>$1K</span>
            <span>$50K</span>
            <span>$100K</span>
          </div>
          <div className="label">
            <span className="label-text-alt opacity-70">
              Minimum amount to maintain on each active chain
            </span>
          </div>
        </div>

        {/* Max Slippage */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Maximum Slippage (%)</span>
            <span className="label-text-alt text-primary font-mono">
              {localParams.maxSlippage}%
            </span>
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={localParams.maxSlippage}
            onChange={(e) => handleParamChange('maxSlippage', parseFloat(e.target.value))}
            className="range range-primary range-sm"
          />
          <div className="flex justify-between text-xs opacity-70 px-2">
            <span>0.1%</span>
            <span>1.0%</span>
            <span>2.0%</span>
          </div>
          <div className="label">
            <span className="label-text-alt opacity-70">
              Maximum acceptable slippage for swaps and bridges
            </span>
          </div>
        </div>

        {/* Gas Price Multiplier */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Gas Price Multiplier</span>
            <span className="label-text-alt text-primary font-mono">
              {localParams.gasPriceMultiplier}x
            </span>
          </label>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={localParams.gasPriceMultiplier}
            onChange={(e) => handleParamChange('gasPriceMultiplier', parseFloat(e.target.value))}
            className="range range-primary range-sm"
          />
          <div className="flex justify-between text-xs opacity-70 px-2">
            <span>1.0x</span>
            <span>2.0x</span>
            <span>3.0x</span>
          </div>
          <div className="label">
            <span className="label-text-alt opacity-70">
              Multiplier for gas price estimation to ensure transaction inclusion
            </span>
          </div>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="mt-6 p-4 bg-white rounded-lg">
        <h3 className="font-semibold mb-2 text-sm opacity-70">Current Configuration</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span>Rebalance:</span>
            <span className="font-mono">{localParams.rebalanceThreshold}%</span>
          </div>
          <div className="flex justify-between">
            <span>Min Liquidity:</span>
            <span className="font-mono">${localParams.minLiquidityPerChain.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Max Slippage:</span>
            <span className="font-mono">{localParams.maxSlippage}%</span>
          </div>
          <div className="flex justify-between">
            <span>Gas Multiplier:</span>
            <span className="font-mono">{localParams.gasPriceMultiplier}x</span>
          </div>
        </div>
      </div>
    </div>
  );
};
