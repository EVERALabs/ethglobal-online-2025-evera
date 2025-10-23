import React from "react";
import { useNavigate } from "react-router-dom";

interface ChainAllocation {
  id: string;
  chain: string;
  allocation: number;
  volume: number;
  apy: number;
  color: string;
  icon: string;
  status: "active" | "pending" | "inactive";
}

interface ChainAllocationTableProps {
  className?: string;
}

export const ChainAllocationTable: React.FC<ChainAllocationTableProps> = ({ 
  className = "" 
}) => {
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const chainAllocations: ChainAllocation[] = [
    {
      id: "eth",
      chain: "Ethereum",
      allocation: 35.2,
      volume: 44148.18,
      apy: 9.2,
      color: "#627EEA",
      icon: "⟠",
      status: "active",
    },
    {
      id: "arb",
      chain: "Arbitrum",
      allocation: 28.7,
      volume: 36000.68,
      apy: 8.5,
      color: "#28A0F0",
      icon: "🔷",
      status: "active",
    },
    {
      id: "poly",
      chain: "Polygon",
      allocation: 22.1,
      volume: 27717.93,
      apy: 7.8,
      color: "#8247E5",
      icon: "⬟",
      status: "active",
    },
    {
      id: "base",
      chain: "Base",
      allocation: 14.0,
      volume: 17553.71,
      apy: 8.9,
      color: "#0052FF",
      icon: "🔵",
      status: "active",
    },
  ];

  const handleWithdraw = (chainId: string) => {
    // In real app, this would open a withdrawal modal
    console.log(`Withdraw from ${chainId}`);
  };

  const handleAdd = (chainId: string) => {
    // In real app, this would open an add liquidity modal
    console.log(`Add to ${chainId}`);
  };

  const handleViewDetails = () => {
    // Navigate to vault detail page with vault ID 1 (main vault)
    navigate('/vault/1');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <div className="badge badge-success badge-sm">Active</div>;
      case "pending":
        return <div className="badge badge-warning badge-sm">Pending</div>;
      case "inactive":
        return <div className="badge badge-error badge-sm">Inactive</div>;
      default:
        return <div className="badge badge-ghost badge-sm">Unknown</div>;
    }
  };

  return (
    <div className={`card bg-white shadow-xl border border-gray-200 ${className}`}>
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="card-title text-xl">Chain Allocation</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm opacity-70">
              Total: ${chainAllocations.reduce((sum, chain) => sum + chain.volume, 0).toLocaleString()}
            </div>
            <button
              onClick={handleViewDetails}
              className="btn btn-primary btn-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left">Chain</th>
                <th className="text-right">Allocation</th>
                <th className="text-right">Volume</th>
                <th className="text-right">APY</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chainAllocations.map((chain) => (
                <tr key={chain.id} className="hover:bg-gray-100">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: chain.color }}
                      ></div>
                      <div className="text-lg">{chain.icon}</div>
                      <div>
                        <div className="font-semibold">{chain.chain}</div>
                        <div className="text-sm opacity-70 capitalize">
                          {chain.status}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="font-bold text-primary">
                      {chain.allocation}%
                    </div>
                    <div className="text-sm opacity-70">
                      {chain.allocation > 30 ? "High" : chain.allocation > 20 ? "Medium" : "Low"}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="font-semibold">
                      ${chain.volume.toLocaleString()}
                    </div>
                    <div className="text-sm opacity-70">
                      {((chain.volume / chainAllocations.reduce((sum, c) => sum + c.volume, 0)) * 100).toFixed(1)}% of total
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="font-bold text-success">
                      {chain.apy}%
                    </div>
                    <div className="text-sm opacity-70">
                      {chain.apy > 8.5 ? "High yield" : "Standard"}
                    </div>
                  </td>
                  <td className="text-center">
                    {getStatusBadge(chain.status)}
                  </td>
                  <td className="text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="btn btn-outline btn-sm btn-primary"
                        onClick={() => handleAdd(chain.id)}
                        disabled={chain.status !== "active"}
                      >
                        Add
                      </button>
                      <button
                        className="btn btn-outline btn-sm btn-secondary"
                        onClick={() => handleWithdraw(chain.id)}
                        disabled={chain.status !== "active"}
                      >
                        Withdraw
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="divider"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-info">
              {chainAllocations.length}
            </div>
            <div className="text-sm opacity-70">Total Chains</div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">
              {(chainAllocations.reduce((sum, chain) => sum + chain.apy, 0) / chainAllocations.length).toFixed(1)}%
            </div>
            <div className="text-sm opacity-70">Avg APY</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {Math.max(...chainAllocations.map(c => c.allocation)).toFixed(1)}%
            </div>
            <div className="text-sm opacity-70">Max Allocation</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              {chainAllocations.filter(c => c.status === "active").length}
            </div>
            <div className="text-sm opacity-70">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};
