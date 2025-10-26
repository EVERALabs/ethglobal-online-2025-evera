import React from "react";
import { useNavigate } from "react-router-dom";
import { type User } from "../../../context/AuthContext";

interface QuickActionsProps {
  user: User;
}

export const QuickActions: React.FC<QuickActionsProps> = () => {
  const navigate = useNavigate();

  const handleDeposit = () => {
    navigate('/deposit');
  };

  const handleWithdraw = () => {
    // In real app, this would open a withdraw modal
    console.log("Open withdraw modal");
  };

  const handleRebalance = () => {
    // In real app, this would trigger a rebalance
    console.log("Trigger rebalance");
  };

  const handleEmergencyWithdraw = () => {
    // In real app, this would trigger emergency withdrawal
    console.log("Emergency withdraw");
  };

  return (
    <div className="card bg-white shadow-xl border border-gray-200">
      <div className="card-body p-6">
        <h3 className="card-title text-xl mb-6">Quick Actions</h3>
        
        {/* Primary Actions */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleDeposit}
            className="btn btn-primary btn-lg flex items-center gap-5"
          >
            <div className="text-2xl">💰</div>
            <div className="text-left">
              <div className="font-semibold">Deposit More</div>
            </div>
          </button>
          
          <button
            onClick={handleWithdraw}
            className="btn btn-primary btn-lg flex items-center gap-3"
          >
            <div className="text-2xl">💸</div>
            <div className="text-left">
              <div className="font-semibold">Withdraw</div>
            </div>
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleRebalance}
            className="btn btn-outline btn-info flex items-center gap-3"
          >
            <div className="text-xl">⚡</div>
            <div className="text-left">
              <div className="font-semibold">Trigger Rebalance</div>
            </div>
          </button>
          
          <button
            onClick={handleEmergencyWithdraw}
            className="btn btn-outline btn-error flex items-center gap-3"
          >
            <div className="text-xl">🚨</div>
            <div className="text-left">
              <div className="font-semibold">Emergency Withdraw</div>
            </div>
          </button>
        </div>

        {/* Action Stats */}
        <div className="divider"></div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success">$125,420</div>
            <div className="text-sm opacity-70">Available to Deposit</div>
          </div>
          <div>
            <div className="text-lg font-bold text-info">4</div>
            <div className="text-sm opacity-70">Active Chains</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">2h</div>
            <div className="text-sm opacity-70">Last Rebalance</div>
          </div>
        </div>
      </div>
    </div>
  );
};
