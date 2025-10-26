import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../hooks/useWeb3';
import { PoolCard } from './_components/PoolCard';
import { FilterButtons } from './_components/FilterButtons';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export interface PoolData {
  id: string;
  pair: {
    token0: string;
    token1: string;
    icon0: string;
    icon1: string;
  };
  protocol: string;
  protocolType: string;
  volume24h: string;
  apy: string;
  tvl: string;
  price: string;
  isUnderMaintenance?: boolean;
  tokenAddresses?: {
    token0: string;
    token1: string;
  };
  poolAddress?: string;
  fee?: number;
}

const MOCK_POOLS: PoolData[] = [
  {
    id: '1',
    pair: {
      token0: 'SOL',
      token1: 'USDC',
      icon0: '◎',
      icon1: '$',
    },
    protocol: 'Meteora',
    protocolType: 'Meteora DLMM',
    volume24h: '$947.03K',
    apy: '18.59%',
    tvl: '$3.86M',
    price: '$195.47',
    tokenAddresses: {
      token0: '0x0000000000000000000000000000000000000000',
      token1: '0x0000000000000000000000000000000000000000',
    },
    poolAddress: '0x0000000000000000000000000000000000000000',
    fee: 3000,
  },
  {
    id: '2',
    pair: {
      token0: 'WBTC',
      token1: 'USDC',
      icon0: '₿',
      icon1: '$',
    },
    protocol: 'Meteora',
    protocolType: 'Meteora DLMM',
    volume24h: '$5.24K',
    apy: '6.47%',
    tvl: '$9.12K',
    price: '$112.41K',
    isUnderMaintenance: true,
    tokenAddresses: {
      token0: '0x0000000000000000000000000000000000000000',
      token1: '0x0000000000000000000000000000000000000000',
    },
    poolAddress: '0x0000000000000000000000000000000000000000',
    fee: 3000,
  },
  {
    id: '3',
    pair: {
      token0: 'cBTC',
      token1: 'USDC',
      icon0: '₿',
      icon1: '$',
    },
    protocol: 'Meteora',
    protocolType: 'Meteora DLMM',
    volume24h: '$4.96K',
    apy: '6.02%',
    tvl: '$59.30K',
    price: '$112.66K',
    isUnderMaintenance: true,
    tokenAddresses: {
      token0: '0x0000000000000000000000000000000000000000',
      token1: '0x0000000000000000000000000000000000000000',
    },
    poolAddress: '0x0000000000000000000000000000000000000000',
    fee: 3000,
  },
  {
    id: '4',
    pair: {
      token0: 'WETH',
      token1: 'USDC',
      icon0: 'Ξ',
      icon1: '$',
    },
    protocol: 'Meteora',
    protocolType: 'Meteora DLMM',
    volume24h: '$213.63',
    apy: '2.92%',
    tvl: '$2.62K',
    price: '$3.99K',
    tokenAddresses: {
      token0: '0x0000000000000000000000000000000000000000',
      token1: '0x0000000000000000000000000000000000000000',
    },
    poolAddress: '0x0000000000000000000000000000000000000000',
    fee: 3000,
  },
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Pools' },
  { id: 'shedge', label: 'SHEDGE' },
  { id: 'sol', label: 'SOL' },
  { id: 'wbtc', label: 'WBTC' },
  { id: 'weth', label: 'WETH' },
];

const LiquidityPoolsPage: React.FC = () => {
  const { user } = useAuth();
  const { isConnected } = useWeb3();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredPools = MOCK_POOLS.filter((pool) => {
    if (selectedFilter === 'all') return true;
    const token0Lower = pool.pair.token0.toLowerCase();
    const token1Lower = pool.pair.token1.toLowerCase();
    const filterLower = selectedFilter.toLowerCase();
    return token0Lower.includes(filterLower) || token1Lower.includes(filterLower);
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="opacity-70">
            You need to be logged in to view liquidity pools.
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="opacity-70 mb-4">
            Please connect your wallet to access liquidity pools.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Liquidity Pools
            </h1>
            <p className="text-lg text-slate-300">
              Explore and manage your liquidity pools
            </p>
          </div>

          {/* Filter Buttons */}
          <FilterButtons
            options={FILTER_OPTIONS}
            selected={selectedFilter}
            onSelect={setSelectedFilter}
          />

          {/* Pool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredPools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>

          {/* Empty State */}
          {filteredPools.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg">
                No pools found for the selected filter.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiquidityPoolsPage;

