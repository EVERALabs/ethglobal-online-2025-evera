import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../hooks/useWeb3';
import { VaultHeader } from './_components/VaultHeader';
import { PerformanceMetrics } from './_components/PerformanceMetrics';
import { HistoryChart } from './_components/HistoryChart';
import { ActionButtons } from './_components/ActionButtons';
import { TransactionLog } from './_components/TransactionLog';

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
  transactions: {
    id: string;
    type: 'deposit' | 'withdraw' | 'rebalance' | 'yield';
    amount: number;
    timestamp: number;
    chainId: string;
    txHash: string;
    status: 'pending' | 'confirmed' | 'failed';
  }[];
}

const VaultDetailPage: React.FC = () => {
  const { vaultId } = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected } = useWeb3();
  const [vaultData, setVaultData] = useState<VaultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching vault data
    const fetchVaultData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, fetch from API
      const mockVaultData: VaultData = {
        id: vaultId || '1',
        name: 'PYUSD-MultiChain-Vault',
        token: {
          symbol: 'PYUSD',
          name: 'PayPal USD',
          icon: '💰'
        },
        currentValue: 125430.67,
        lifetimeYield: 12430.67,
        chainDistribution: {
          '1': { name: 'Ethereum', percentage: 35.2, value: 44151.2 },
          '8453': { name: 'Base', percentage: 28.7, value: 35998.6 },
          '42161': { name: 'Arbitrum', percentage: 20.1, value: 25211.6 },
          '10': { name: 'Optimism', percentage: 16.0, value: 20069.3 }
        },
        history: [
          { timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, value: 100000 },
          { timestamp: Date.now() - 25 * 24 * 60 * 60 * 1000, value: 102500, rebalance: true },
          { timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000, value: 108750 },
          { timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000, value: 112000, rebalance: true },
          { timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, value: 118500 },
          { timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, value: 121200, rebalance: true },
          { timestamp: Date.now(), value: 125430.67 }
        ],
        transactions: [
          {
            id: '1',
            type: 'deposit',
            amount: 100000,
            timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
            chainId: '1',
            txHash: '0x1234...5678',
            status: 'confirmed'
          },
          {
            id: '2',
            type: 'rebalance',
            amount: 0,
            timestamp: Date.now() - 25 * 24 * 60 * 60 * 1000,
            chainId: '1',
            txHash: '0x2345...6789',
            status: 'confirmed'
          },
          {
            id: '3',
            type: 'yield',
            amount: 2500,
            timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000,
            chainId: '8453',
            txHash: '0x3456...7890',
            status: 'confirmed'
          },
          {
            id: '4',
            type: 'rebalance',
            amount: 0,
            timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
            chainId: '42161',
            txHash: '0x4567...8901',
            status: 'confirmed'
          },
          {
            id: '5',
            type: 'yield',
            amount: 3200,
            timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
            chainId: '10',
            txHash: '0x5678...9012',
            status: 'confirmed'
          },
          {
            id: '6',
            type: 'rebalance',
            amount: 0,
            timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
            chainId: '1',
            txHash: '0x6789...0123',
            status: 'confirmed'
          }
        ]
      };
      
      setVaultData(mockVaultData);
      setLoading(false);
    };

    if (vaultId) {
      fetchVaultData();
    }
  }, [vaultId]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="opacity-70">You need to be logged in to view vault details.</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="opacity-70">Please connect your wallet to view vault details.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-lg opacity-70">Loading vault details...</p>
        </div>
      </div>
    );
  }

  if (!vaultData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vault Not Found</h2>
          <p className="opacity-70 mb-4">The requested vault could not be found.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-8">
          {/* Back Button */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-ghost btn-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <div className="badge badge-primary badge-lg">
              Vault ID: {vaultData.id}
            </div>
          </div>

          {/* Vault Header */}
          <VaultHeader vault={vaultData} />

          {/* Performance Metrics */}
          <div className="px-2">
            <PerformanceMetrics vault={vaultData} />
          </div>

          {/* Main Content Grid */}
          <div className="px-2">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* History Chart - Takes 2 columns */}
              <div className="xl:col-span-2">
                <HistoryChart vault={vaultData} />
              </div>

              {/* Action Buttons - Takes 1 column */}
              <div className="xl:col-span-1">
                <ActionButtons vault={vaultData} />
              </div>
            </div>
          </div>

          {/* Transaction Log */}
          <div className="px-2">
            <TransactionLog transactions={vaultData.transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDetailPage;
