import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../hooks/useWeb3';
import { ROLES } from '../../const/roles';
import { KPICards } from './_components/KPICards';
import { ChainLiquidityChart } from './_components/ChainLiquidityChart';
import { VolumeRebalanceChart } from './_components/VolumeRebalanceChart';
import { Leaderboard } from './_components/Leaderboard';
import { FilterControls } from './_components/FilterControls';
import { ExportData } from './_components/ExportData';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { provider, isConnected } = useWeb3();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [selectedChains, setSelectedChains] = useState<string[]>(['base', 'arbitrum']);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="opacity-70">You need to be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  📈 Analytics Dashboard
                </h1>
                <p className="text-lg opacity-70 mt-2">
                  Chain volumes, historical yields, and user growth insights
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className={`badge badge-lg ${user.role === ROLES.ADMIN ? 'badge-error' : user.role === ROLES.USER ? 'badge-primary' : 'badge-secondary'}`}>
                  {user.role}
                </div>
                {provider && (
                  <div className="badge badge-lg badge-accent">
                    {provider}
                  </div>
                )}
                <div className={`badge badge-lg ${isConnected ? 'badge-success' : 'badge-warning'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="px-2">
            <FilterControls 
              selectedTimeframe={selectedTimeframe}
              setSelectedTimeframe={setSelectedTimeframe}
              selectedChains={selectedChains}
              setSelectedChains={setSelectedChains}
            />
          </div>

          {/* KPIs Overview */}
          <div className="px-2">
            <KPICards timeframe={selectedTimeframe} />
          </div>

          {/* Charts Section */}
          <div className="px-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ChainLiquidityChart 
                timeframe={selectedTimeframe} 
                selectedChains={selectedChains}
              />
              <VolumeRebalanceChart 
                timeframe={selectedTimeframe}
                selectedChains={selectedChains}
              />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="px-2">
            <Leaderboard timeframe={selectedTimeframe} />
          </div>

          {/* Export Data */}
          <div className="px-2">
            <ExportData 
              timeframe={selectedTimeframe}
              selectedChains={selectedChains}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
