import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CurrentAllocationOverview } from "./_components/CurrentAllocationOverview";
import { RecommendedRebalance } from "./_components/RecommendedRebalance";
import { ManualOverride } from "./_components/ManualOverride";
import { RebalanceLog } from "./_components/RebalanceLog";
import { TriggerActions } from "./_components/TriggerActions";

const RebalancePage: React.FC = () => {
  const { user } = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="opacity-70">You need to be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  const handleSimulate = async () => {
    setIsSimulating(true);
    // Simulate API call
    setTimeout(() => {
      setSimulationResult({
        estimatedGas: "0.0234 ETH",
        estimatedTime: "2-3 minutes",
        impact: "Low risk",
        newAllocation: {
          Ethereum: 32.2,
          Arbitrum: 13.7,
          Polygon: 22.1,
          Base: 32.0
        },
        riskAssessment: {
          level: "low" as const,
          factors: ["Gas costs on L1", "Temporary liquidity impact"]
        },
        expectedOutcome: {
          apyChange: 1.2,
          volumeChange: 8.5,
          costBenefit: 2.3
        }
      });
      setIsSimulating(false);
    }, 2000);
  };

  const handleExecute = async () => {
    // Execute rebalance logic
    console.log("Executing rebalance...");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  🔁 Liquidity Rebalancing
                </h1>
                <p className="text-lg opacity-70 mt-2">
                  Manage and trigger liquidity rebalancing across chains
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className={`badge badge-lg ${user?.role === 'admin' ? 'badge-error' : 'badge-primary'}`}>
                  {user?.role === 'admin' ? 'Admin Access' : 'Advanced User'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="px-2">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              {/* Left Column - Current State */}
              <div className="xl:col-span-2 space-y-6">
                <CurrentAllocationOverview />
                <RecommendedRebalance />
              </div>

              {/* Right Column - Controls & Log */}
              <div className="space-y-6">
                <ManualOverride />
                <TriggerActions 
                  onSimulate={handleSimulate}
                  onExecute={handleExecute}
                  isSimulating={isSimulating}
                  simulationResult={simulationResult}
                />
              </div>
            </div>
          </div>

          {/* Bottom Section - Log */}
          <div className="px-2">
            <RebalanceLog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebalancePage;
