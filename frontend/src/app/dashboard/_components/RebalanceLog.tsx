import React from "react";

interface RebalanceEntry {
  id: string;
  timestamp: Date;
  percentageMoved: number;
  fromChain: string;
  toChain: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  txHash?: string;
}

interface RebalanceLogProps {
  className?: string;
}

export const RebalanceLog: React.FC<RebalanceLogProps> = ({ className = "" }) => {
  // Mock data - in real app, this would come from API
  const rebalanceEntries: RebalanceEntry[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      percentageMoved: 5.2,
      fromChain: "Ethereum",
      toChain: "Arbitrum",
      amount: 6521.84,
      status: "completed",
      txHash: "0x1234...5678",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      percentageMoved: 3.1,
      fromChain: "Polygon",
      toChain: "Base",
      amount: 3888.92,
      status: "completed",
      txHash: "0xabcd...efgh",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      percentageMoved: 2.8,
      fromChain: "Arbitrum",
      toChain: "Ethereum",
      amount: 3511.76,
      status: "completed",
      txHash: "0x9876...5432",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      percentageMoved: 4.5,
      fromChain: "Base",
      toChain: "Polygon",
      amount: 5642.33,
      status: "completed",
      txHash: "0x5678...9abc",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      percentageMoved: 1.9,
      fromChain: "Ethereum",
      toChain: "Base",
      amount: 2383.45,
      status: "completed",
      txHash: "0xdef0...1234",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <div className="badge badge-success badge-sm">Completed</div>;
      case "pending":
        return <div className="badge badge-warning badge-sm">Pending</div>;
      case "failed":
        return <div className="badge badge-error badge-sm">Failed</div>;
      default:
        return <div className="badge badge-ghost badge-sm">Unknown</div>;
    }
  };

  const getChainIcon = (chain: string) => {
    switch (chain.toLowerCase()) {
      case "ethereum":
        return "⟠";
      case "arbitrum":
        return "🔷";
      case "polygon":
        return "⬟";
      case "base":
        return "🔵";
      default:
        return "🔗";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className={`card bg-base-100 shadow-xl border border-base-300 ${className}`}>
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="card-title text-xl">Recent Rebalance Log</h3>
          <div className="text-sm opacity-70">
            Last 7 days
          </div>
        </div>

        <div className="space-y-4">
          {rebalanceEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-2xl">{getChainIcon(entry.fromChain)}</div>
                  <div className="text-xs opacity-70">From</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-lg">→</div>
                  <div className="text-xs opacity-70">
                    {entry.percentageMoved}%
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-2xl">{getChainIcon(entry.toChain)}</div>
                  <div className="text-xs opacity-70">To</div>
                </div>
                
                <div className="ml-4">
                  <div className="font-semibold">
                    {entry.fromChain} → {entry.toChain}
                  </div>
                  <div className="text-sm opacity-70">
                    ${entry.amount.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {entry.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="text-xs opacity-70">
                    {formatTimeAgo(entry.timestamp)}
                  </div>
                </div>
                
                {getStatusBadge(entry.status)}
                
                {entry.txHash && (
                  <button className="btn btn-ghost btn-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="divider"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">
              {rebalanceEntries.length}
            </div>
            <div className="text-sm opacity-70">Total Rebalances</div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">
              {rebalanceEntries.filter(e => e.status === "completed").length}
            </div>
            <div className="text-sm opacity-70">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-info">
              {(rebalanceEntries.reduce((sum, entry) => sum + entry.percentageMoved, 0) / rebalanceEntries.length).toFixed(1)}%
            </div>
            <div className="text-sm opacity-70">Avg Movement</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              ${rebalanceEntries.reduce((sum, entry) => sum + entry.amount, 0).toLocaleString()}
            </div>
            <div className="text-sm opacity-70">Total Moved</div>
          </div>
        </div>
      </div>
    </div>
  );
};
