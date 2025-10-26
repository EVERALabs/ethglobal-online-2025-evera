import React, { useState } from "react";

interface ChainWhitelistProps {
  whitelist: { [chainId: string]: boolean };
  onChange: (whitelist: { [chainId: string]: boolean }) => void;
}

interface ChainInfo {
  id: string;
  name: string;
  symbol: string;
  color: string;
  tvl: string;
  fees: string;
  status: "active" | "maintenance" | "deprecated";
}

const CHAIN_DATA: ChainInfo[] = [
  {
    id: "11155111",
    name: "Sepolia Testnet",
    symbol: "ETH",
    color: "bg-blue-600",
    tvl: "$1.2M",
    fees: "Medium",
    status: "active",
  },
  {
    id: "296",
    name: "Hedera Testnet",
    symbol: "HBAR",
    color: "bg-green-500",
    tvl: "$800K",
    fees: "Very Low",
    status: "active",
  },
];

export const ChainWhitelist: React.FC<ChainWhitelistProps> = ({
  whitelist,
  onChange,
}) => {
  const [localWhitelist, setLocalWhitelist] = useState<{
    [chainId: string]: boolean;
  }>(whitelist);

  const handleToggleChain = (chainId: string) => {
    const newWhitelist = {
      ...localWhitelist,
      [chainId]: !localWhitelist[chainId],
    };
    setLocalWhitelist(newWhitelist);
    onChange(newWhitelist);
  };

  const handleSelectAll = () => {
    const newWhitelist: { [chainId: string]: boolean } = {};
    CHAIN_DATA.forEach((chain) => {
      newWhitelist[chain.id] = true;
    });
    setLocalWhitelist(newWhitelist);
    onChange(newWhitelist);
  };

  const handleDeselectAll = () => {
    const newWhitelist: { [chainId: string]: boolean } = {};
    CHAIN_DATA.forEach((chain) => {
      newWhitelist[chain.id] = false;
    });
    setLocalWhitelist(newWhitelist);
    onChange(newWhitelist);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="badge badge-success badge-sm">Active</span>;
      case "maintenance":
        return (
          <span className="badge badge-warning badge-sm">Maintenance</span>
        );
      case "deprecated":
        return <span className="badge badge-error badge-sm">Deprecated</span>;
      default:
        return <span className="badge badge-neutral badge-sm">Unknown</span>;
    }
  };

  const getFeeBadge = (fees: string) => {
    switch (fees) {
      case "Very Low":
        return <span className="badge badge-success badge-sm">Very Low</span>;
      case "Low":
        return <span className="badge badge-info badge-sm">Low</span>;
      case "High":
        return <span className="badge badge-warning badge-sm">High</span>;
      default:
        return <span className="badge badge-neutral badge-sm">{fees}</span>;
    }
  };

  const activeChains = Object.values(localWhitelist).filter(Boolean).length;
  const totalChains = CHAIN_DATA.length;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">Chain Whitelist</h2>
            <p className="text-sm opacity-70">
              Manage active chains for liquidity distribution
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="badge badge-primary badge-lg">
            {activeChains}/{totalChains} Active
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSelectAll}
            className="btn btn-sm btn-outline btn-success"
          >
            Select All
          </button>
          <button
            onClick={handleDeselectAll}
            className="btn btn-sm btn-outline btn-error"
          >
            Deselect All
          </button>
        </div>
        <div className="text-sm opacity-70">
          Active chains will receive liquidity allocations
        </div>
      </div>

      {/* Chain List */}
      <div className="space-y-3">
        {CHAIN_DATA.map((chain) => (
          <div
            key={chain.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              localWhitelist[chain.id]
                ? "border-primary bg-primary/5"
                : "border-base-300 bg-base-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Chain Toggle */}
                <input
                  type="checkbox"
                  checked={localWhitelist[chain.id]}
                  onChange={() => handleToggleChain(chain.id)}
                  className="toggle toggle-primary toggle-sm"
                  disabled={chain.status === "deprecated"}
                />

                {/* Chain Info */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full ${chain.color} flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold ">
                      {chain.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-black">{chain.name}</h3>
                      {getStatusBadge(chain.status)}
                    </div>
                    <p className="text-sm opacity-70">Chain ID: {chain.id}</p>
                  </div>
                </div>
              </div>

              {/* Chain Metrics */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-base-content">
                    {chain.tvl}
                  </div>
                  <div className="text-xs opacity-70">TVL</div>
                </div>
                <div className="text-right">{getFeeBadge(chain.fees)}</div>
                <div className="text-right">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      localWhitelist[chain.id] ? "bg-success" : "bg-base-300"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Chain Description */}
            {chain.status === "deprecated" && (
              <div className="mt-3 p-2 bg-error/10 rounded text-sm text-error">
                <svg
                  className="w-4 h-4 inline mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                This chain is deprecated and will be removed in future updates
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-white rounded-lg">
        <h3 className="font-semibold mb-2 text-sm opacity-70">
          Active Chains Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="opacity-70">Total Active:</span>
            <span className="font-semibold ml-2">{activeChains}</span>
          </div>
          <div>
            <span className="opacity-70">Total TVL:</span>
            <span className="font-semibold ml-2">$5.3B</span>
          </div>
        </div>
      </div>
    </div>
  );
};
