import React, { useState } from "react";

interface RebalanceEntry {
  id: string;
  timestamp: Date;
  action: "manual" | "ai_recommended" | "auto";
  result: "success" | "partial" | "failed";
  txHash: string;
  gasUsed: string;
  moves: Array<{
    from: string;
    to: string;
    amount: string;
    percentage: number;
  }>;
  impact: {
    apyChange: number;
    riskChange: "low" | "medium" | "high";
    volumeChange: number;
  };
  notes?: string;
}

export const RebalanceLog: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "success" | "partial" | "failed">("all");

  // Mock data - in real app, this would come from API
  const rebalanceHistory: RebalanceEntry[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      action: "ai_recommended",
      result: "success",
      txHash: "0x1234...5678",
      gasUsed: "0.0234 ETH",
      moves: [
        { from: "Arbitrum", to: "Base", amount: "$5,400", percentage: 15 },
        { from: "Ethereum", to: "Polygon", amount: "$2,200", percentage: 5 }
      ],
      impact: {
        apyChange: 1.2,
        riskChange: "low",
        volumeChange: 8.5
      },
      notes: "AI recommendation applied successfully"
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      action: "manual",
      result: "success",
      txHash: "0xabcd...efgh",
      gasUsed: "0.0189 ETH",
      moves: [
        { from: "Polygon", to: "Base", amount: "$3,100", percentage: 8 }
      ],
      impact: {
        apyChange: 0.8,
        riskChange: "low",
        volumeChange: 3.2
      }
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      action: "auto",
      result: "partial",
      txHash: "0x9876...5432",
      gasUsed: "0.0156 ETH",
      moves: [
        { from: "Ethereum", to: "Arbitrum", amount: "$1,800", percentage: 4 }
      ],
      impact: {
        apyChange: 0.3,
        riskChange: "low",
        volumeChange: 1.8
      },
      notes: "Partial execution due to gas price spike"
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      action: "manual",
      result: "failed",
      txHash: "0x0000...0000",
      gasUsed: "0.0000 ETH",
      moves: [
        { from: "Base", to: "Ethereum", amount: "$4,200", percentage: 12 }
      ],
      impact: {
        apyChange: 0,
        riskChange: "low",
        volumeChange: 0
      },
      notes: "Transaction failed due to insufficient gas"
    }
  ];

  const getResultColor = (result: string) => {
    switch (result) {
      case "success": return "text-success bg-success/10 border-success/20";
      case "partial": return "text-warning bg-warning/10 border-warning/20";
      case "failed": return "text-error bg-error/10 border-error/20";
      default: return "text-base-content bg-base-200";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "manual": return "👤";
      case "ai_recommended": return "🤖";
      case "auto": return "⚡";
      default: return "❓";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-success";
      case "medium": return "text-warning";
      case "high": return "text-error";
      default: return "text-base-content";
    }
  };

  const filteredHistory = filter === "all" 
    ? rebalanceHistory 
    : rebalanceHistory.filter(entry => entry.result === filter);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="card bg-white shadow-xl border border-gray-200">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="card-title text-xl text-primary">
            📋 Rebalance Log
          </h3>
          <div className="flex gap-2">
            <select
              style={{ backgroundColor: 'white', color: 'black' }}
              className="select select-bordered select-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Results</option>
              <option value="success">Success</option>
              <option value="partial">Partial</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-white rounded-lg p-4">
            <div className="stat-title text-sm">Total Rebalances</div>
            <div className="stat-value text-2xl text-primary">{rebalanceHistory.length}</div>
          </div>
          <div className="stat bg-white rounded-lg p-4">
            <div className="stat-title text-sm">Success Rate</div>
            <div className="stat-value text-2xl text-success">
              {Math.round((rebalanceHistory.filter(e => e.result === 'success').length / rebalanceHistory.length) * 100)}%
            </div>
          </div>
          <div className="stat bg-white rounded-lg p-4">
            <div className="stat-title text-sm">Avg Gas Used</div>
            <div className="stat-value text-2xl text-info">
              {rebalanceHistory
                .filter(e => e.result !== 'failed')
                .reduce((sum, e) => sum + parseFloat(e.gasUsed), 0) / 
                rebalanceHistory.filter(e => e.result !== 'failed').length || 0
              } ETH
            </div>
          </div>
          <div className="stat bg-white rounded-lg p-4">
            <div className="stat-title text-sm">Last Rebalance</div>
            <div className="stat-value text-2xl text-warning">
              {formatTimeAgo(rebalanceHistory[0].timestamp)}
            </div>
          </div>
        </div>

        {/* Log Entries */}
        <div className="space-y-3">
          {filteredHistory.map((entry) => (
            <div
              key={entry.id}
              className={`card bg-white border-2 transition-all duration-200 cursor-pointer ${
                selectedEntry === entry.id 
                  ? 'border-primary shadow-lg' 
                  : 'border-transparent hover:border-primary/30'
              }`}
              onClick={() => setSelectedEntry(
                selectedEntry === entry.id ? null : entry.id
              )}
            >
              <div className="card-body p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getActionIcon(entry.action)}</div>
                    <div>
                      <div className="font-semibold capitalize">
                        {entry.action.replace('_', ' ')} Rebalance
                      </div>
                      <div className="text-sm opacity-70">
                        {entry.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`badge ${getResultColor(entry.result)}`}>
                      {entry.result.toUpperCase()}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatTimeAgo(entry.timestamp)}
                      </div>
                      <div className="text-xs opacity-70">
                        {entry.gasUsed}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-sm font-bold text-primary">
                      {entry.moves.length}
                    </div>
                    <div className="text-xs opacity-70">Moves</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className={`text-sm font-bold ${
                      entry.impact.apyChange >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {entry.impact.apyChange >= 0 ? '+' : ''}{entry.impact.apyChange}%
                    </div>
                    <div className="text-xs opacity-70">APY Change</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className={`text-sm font-bold ${getRiskColor(entry.impact.riskChange)}`}>
                      {entry.impact.riskChange.toUpperCase()}
                    </div>
                    <div className="text-xs opacity-70">Risk</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-sm font-bold text-info">
                      {entry.impact.volumeChange}%
                    </div>
                    <div className="text-xs opacity-70">Volume Change</div>
                  </div>
                </div>

                {selectedEntry === entry.id && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    {/* Detailed Moves */}
                    <div>
                      <h5 className="font-semibold mb-2 text-primary">Moves Executed:</h5>
                      <div className="space-y-2">
                        {entry.moves.map((move, moveIndex) => (
                          <div key={moveIndex} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="badge badge-outline">
                                {move.from} → {move.to}
                              </div>
                              <div className="font-bold text-primary">
                                {move.percentage}%
                              </div>
                            </div>
                            <div className="text-sm font-medium">
                              {move.amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div>
                      <h5 className="font-semibold mb-2 text-info">Transaction Details:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-sm opacity-70">Transaction Hash</div>
                          <div className="font-mono text-sm break-all">
                            {entry.txHash}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-sm opacity-70">Gas Used</div>
                          <div className="font-semibold">{entry.gasUsed}</div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {entry.notes && (
                      <div>
                        <h5 className="font-semibold mb-2 text-warning">Notes:</h5>
                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-sm">{entry.notes}</div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button className="btn btn-outline btn-sm">
                        View on Explorer
                      </button>
                      <button className="btn btn-outline btn-sm">
                        Copy Hash
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <button className="btn btn-outline btn-sm">
            Load More History
          </button>
        </div>
      </div>
    </div>
  );
};
