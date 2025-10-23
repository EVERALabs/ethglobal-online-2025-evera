import React, { useState } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'rebalance' | 'yield';
  amount: number;
  timestamp: number;
  chainId: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface TransactionLogProps {
  transactions: Transaction[];
}

export const TransactionLog: React.FC<TransactionLogProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw' | 'rebalance' | 'yield'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getChainName = (chainId: string) => {
    const chains: { [key: string]: string } = {
      '1': 'Ethereum',
      '8453': 'Base',
      '42161': 'Arbitrum',
      '10': 'Optimism',
      '137': 'Polygon',
      '56': 'BSC',
      '43114': 'Avalanche',
    };
    return chains[chainId] || `Chain ${chainId}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'withdraw':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4-4m4 4l-4 4" />
          </svg>
        );
      case 'rebalance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'yield':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-success';
      case 'withdraw':
        return 'text-error';
      case 'rebalance':
        return 'text-warning';
      case 'yield':
        return 'text-primary';
      default:
        return 'text-base-content';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(tx => filter === 'all' || tx.type === filter)
    .sort((a, b) => {
      return sortBy === 'newest' 
        ? b.timestamp - a.timestamp 
        : a.timestamp - b.timestamp;
    });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">Transaction History</h3>
          <p className="text-sm text-base-content/60">
            All blockchain transactions for this vault
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="select select-bordered select-sm"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdraw">Withdrawals</option>
            <option value="rebalance">Rebalances</option>
            <option value="yield">Yield</option>
          </select>
          
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="select select-bordered select-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-base-content/40 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-base-content/60">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
            >
              {/* Transaction Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTransactionColor(tx.type)} bg-base-100`}>
                {getTransactionIcon(tx.type)}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold capitalize">{tx.type}</span>
                  <div className={`badge badge-sm ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-base-content/60">
                  <span>{formatDate(tx.timestamp)}</span>
                  <span>{formatTime(tx.timestamp)}</span>
                  <span>{getChainName(tx.chainId)}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <div className={`font-semibold ${getTransactionColor(tx.type)}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </div>
                <div className="text-xs text-base-content/60">
                  {tx.type === 'rebalance' ? 'Gas Only' : 'Amount'}
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(tx.txHash)}
                  className="btn btn-ghost btn-xs"
                  title="Copy transaction hash"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <div className="text-xs font-mono text-base-content/60 max-w-20 truncate">
                  {tx.txHash}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-base-300">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success">
              {transactions.filter(tx => tx.type === 'deposit').length}
            </div>
            <div className="text-xs text-base-content/60">Deposits</div>
          </div>
          <div>
            <div className="text-lg font-bold text-error">
              {transactions.filter(tx => tx.type === 'withdraw').length}
            </div>
            <div className="text-xs text-base-content/60">Withdrawals</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {transactions.filter(tx => tx.type === 'rebalance').length}
            </div>
            <div className="text-xs text-base-content/60">Rebalances</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              {transactions.filter(tx => tx.type === 'yield').length}
            </div>
            <div className="text-xs text-base-content/60">Yield Events</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
