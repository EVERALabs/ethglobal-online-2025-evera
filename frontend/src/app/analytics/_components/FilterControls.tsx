import React from 'react';

interface FilterControlsProps {
  selectedTimeframe: '24h' | '7d' | '30d';
  setSelectedTimeframe: (timeframe: '24h' | '7d' | '30d') => void;
  selectedChains: string[];
  setSelectedChains: (chains: string[]) => void;
}

const CHAIN_OPTIONS = [
  { id: 'base', name: 'Base', color: 'bg-blue-600' },
  { id: 'arbitrum', name: 'Arbitrum', color: 'bg-blue-500' },
  { id: 'polygon', name: 'Polygon', color: 'bg-purple-600' },
  { id: 'ethereum', name: 'Ethereum', color: 'bg-gray-600' },
  { id: 'optimism', name: 'Optimism', color: 'bg-red-600' },
  { id: 'avalanche', name: 'Avalanche', color: 'bg-red-500' },
];

const TIMEFRAME_OPTIONS = [
  { id: '24h', name: '24 Hours', description: 'Last 24 hours' },
  { id: '7d', name: '7 Days', description: 'Last 7 days' },
  { id: '30d', name: '30 Days', description: 'Last 30 days' },
];

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedTimeframe,
  setSelectedTimeframe,
  selectedChains,
  setSelectedChains,
}) => {
  const handleChainToggle = (chainId: string) => {
    if (selectedChains.includes(chainId)) {
      setSelectedChains(selectedChains.filter(id => id !== chainId));
    } else {
      setSelectedChains([...selectedChains, chainId]);
    }
  };

  const handleSelectAllChains = () => {
    setSelectedChains(CHAIN_OPTIONS.map(chain => chain.id));
  };

  const handleClearAllChains = () => {
    setSelectedChains([]);
  };

  return (
    <div className="card bg-white shadow-xl border border-gray-200">
      <div className="card-body p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Timeframe Selection */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Time Period</h3>
            <div className="flex gap-2">
              {TIMEFRAME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedTimeframe(option.id as '24h' | '7d' | '30d')}
                  className={`btn btn-sm ${
                    selectedTimeframe === option.id
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
            <p className="text-xs opacity-70 mt-2">
              {TIMEFRAME_OPTIONS.find(opt => opt.id === selectedTimeframe)?.description}
            </p>
          </div>

          {/* Chain Selection */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Compare Chains</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAllChains}
                  className="btn btn-xs btn-outline"
                >
                  Select All
                </button>
                <button
                  onClick={handleClearAllChains}
                  className="btn btn-xs btn-outline"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {CHAIN_OPTIONS.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleChainToggle(chain.id)}
                  className={`btn btn-sm ${
                    selectedChains.includes(chain.id)
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${chain.color}`} />
                  {chain.name}
                  {selectedChains.includes(chain.id) && (
                    <span className="text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
            
            <p className="text-xs opacity-70 mt-2">
              {selectedChains.length === 0 
                ? 'Select chains to compare' 
                : `${selectedChains.length} chain${selectedChains.length > 1 ? 's' : ''} selected`
              }
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-base-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                {selectedChains.length}
              </div>
              <div className="text-xs opacity-70">Chains</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {selectedTimeframe}
              </div>
              <div className="text-xs opacity-70">Period</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {selectedChains.length > 0 ? 'Live' : '--'}
              </div>
              <div className="text-xs opacity-70">Status</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs opacity-70">Updated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
