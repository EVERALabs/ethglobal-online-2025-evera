import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useWeb3 } from "../../hooks/useWeb3";
import { formatAddress } from "../../lib/utils";
import { StatsCards } from "./_components/StatsCards";
import { QuickActions } from "./_components/QuickActions";
import { PortfolioChart } from "./_components/PortfolioChart";
import { ChainAllocationTable } from "./_components/ChainAllocationTable";
import { RebalanceLog } from "./_components/RebalanceLog";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { isConnected, disconnect } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (isConnected) {
        await disconnect(); // Wallet disconnect (RainbowKit adapter's signOut is often tied to this)
      }
      logout(); // App session logout
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      navigate("/");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="opacity-70">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-primary font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Portfolio Dashboard
                </h1>
                <p className="text-lg font-secondary opacity-70 mt-2">
                  Welcome back, {user.name || formatAddress(user.address || "")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ConnectButton />

                {/* // logout button shoule be here */}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline bg-red-500 text-white"
                >
                  Logout
                </button>

                {/* back to homepage button */}
                <button
                  onClick={() => navigate("/")}
                  className="btn btn-primary"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>

          {/* Top Summary Cards */}
          <div className="px-2">
            <StatsCards />
          </div>

          {/* Portfolio Chart and Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <PortfolioChart />
            </div>
            <div>
              <QuickActions user={user} />
            </div>
          </div>

          {/* Chain Allocation Table */}
          <div className="px-2">
            <ChainAllocationTable />
          </div>

          {/* Rebalance Log and Account Info */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <RebalanceLog />
            </div>

            <div className="space-y-6">
              {/* Portfolio Summary */}
              <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl border border-primary/20">
                <div className="card-body p-6">
                  <h3 className="card-title text-xl font-primary mb-4 text-primary">
                    Portfolio Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-primary/20">
                      <span className="opacity-70 font-secondary font-medium">
                        Total Value:
                      </span>
                      <span className="font-secondary font-bold text-success text-lg">
                        $125,420.50
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/20">
                      <span className="opacity-70 font-secondary font-medium">
                        24h Change:
                      </span>
                      <span className="font-secondary font-bold text-success">
                        +2.3%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-primary/20">
                      <span className="opacity-70 font-secondary font-medium">
                        Active Chains:
                      </span>
                      <span className="font-secondary font-bold text-info">
                        4
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="opacity-70 font-secondary font-medium">
                        Avg APY:
                      </span>
                      <span className="font-secondary font-bold text-primary">
                        8.7%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
