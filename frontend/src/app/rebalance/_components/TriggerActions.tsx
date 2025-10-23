import React, { useState } from "react";

interface SimulationResult {
  estimatedGas: string;
  estimatedTime: string;
  impact: string;
  newAllocation: Record<string, number>;
  riskAssessment: {
    level: "low" | "medium" | "high";
    factors: string[];
  };
  expectedOutcome: {
    apyChange: number;
    volumeChange: number;
    costBenefit: number;
  };
}

interface TriggerActionsProps {
  onSimulate: () => void;
  onExecute: () => void;
  isSimulating: boolean;
  simulationResult: SimulationResult | null;
}

export const TriggerActions: React.FC<TriggerActionsProps> = ({
  onSimulate,
  onExecute,
  isSimulating,
  simulationResult
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await onExecute();
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Execution failed:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-success bg-success/10 border-success/20";
      case "medium": return "text-warning bg-warning/10 border-warning/20";
      case "high": return "text-error bg-error/10 border-error/20";
      default: return "text-base-content bg-base-200";
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-6">
        <h3 className="card-title text-xl text-primary mb-6">
          ⚡ Trigger Actions
        </h3>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            className={`btn btn-primary btn-lg w-full ${
              isSimulating ? 'loading' : ''
            }`}
            onClick={onSimulate}
            disabled={isSimulating}
          >
            {isSimulating ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Simulating...
              </>
            ) : (
              <>
                🔮 Simulate Rebalance
              </>
            )}
          </button>

          <button
            className={`btn btn-success btn-lg w-full ${
              isExecuting ? 'loading' : ''
            }`}
            onClick={() => setShowConfirmModal(true)}
            disabled={!simulationResult || isExecuting}
          >
            {isExecuting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Executing...
              </>
            ) : (
              <>
                🚀 Execute Now
              </>
            )}
          </button>
        </div>

        {/* Simulation Results */}
        {simulationResult && (
          <div className="mt-6 space-y-4">
            <div className="divider"></div>
            <h4 className="font-semibold text-lg text-primary">Simulation Results</h4>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-base-200 rounded-lg text-center">
                <div className="text-sm opacity-70">Estimated Gas</div>
                <div className="font-bold text-info">{simulationResult.estimatedGas}</div>
              </div>
              <div className="p-3 bg-base-200 rounded-lg text-center">
                <div className="text-sm opacity-70">Estimated Time</div>
                <div className="font-bold text-warning">{simulationResult.estimatedTime}</div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className={`alert ${getRiskColor(simulationResult.riskAssessment.level)} border`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {simulationResult.riskAssessment.level === 'low' ? '✅' : 
                   simulationResult.riskAssessment.level === 'medium' ? '⚠️' : '🚨'}
                </span>
                <div>
                  <div className="font-semibold">
                    {simulationResult.riskAssessment.level.toUpperCase()} RISK
                  </div>
                  <div className="text-sm opacity-70">
                    {simulationResult.riskAssessment.factors.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Outcome */}
            <div className="p-4 bg-base-200 rounded-lg">
              <h5 className="font-semibold mb-3 text-primary">Expected Outcome</h5>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">APY Change</span>
                  <span className={`font-bold ${
                    simulationResult.expectedOutcome.apyChange >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {simulationResult.expectedOutcome.apyChange >= 0 ? '+' : ''}
                    {simulationResult.expectedOutcome.apyChange}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">Volume Change</span>
                  <span className={`font-bold ${
                    simulationResult.expectedOutcome.volumeChange >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {simulationResult.expectedOutcome.volumeChange >= 0 ? '+' : ''}
                    {simulationResult.expectedOutcome.volumeChange}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">Cost/Benefit Ratio</span>
                  <span className={`font-bold ${
                    simulationResult.expectedOutcome.costBenefit >= 1 ? 'text-success' : 'text-warning'
                  }`}>
                    {simulationResult.expectedOutcome.costBenefit.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            {/* New Allocation Preview */}
            <div className="p-4 bg-base-200 rounded-lg">
              <h5 className="font-semibold mb-3 text-primary">New Allocation</h5>
              <div className="space-y-2">
                {Object.entries(simulationResult.newAllocation).map(([chain, percentage]) => (
                  <div key={chain} className="flex justify-between items-center">
                    <span className="text-sm">{chain}</span>
                    <span className="font-bold text-primary">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg text-error mb-4">
                ⚠️ Confirm Rebalance Execution
              </h3>
              
              <div className="space-y-4">
                <div className="alert alert-warning">
                  <span>⚠️</span>
                  <span>
                    This action will execute the rebalance on-chain. 
                    Gas fees will be charged and the transaction cannot be undone.
                  </span>
                </div>

                {simulationResult && (
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Execution Summary:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Estimated Gas: {simulationResult.estimatedGas}</li>
                      <li>• Estimated Time: {simulationResult.estimatedTime}</li>
                      <li>• Risk Level: {simulationResult.riskAssessment.level.toUpperCase()}</li>
                      <li>• Expected APY Change: {simulationResult.expectedOutcome.apyChange >= 0 ? '+' : ''}{simulationResult.expectedOutcome.apyChange}%</li>
                    </ul>
                  </div>
                )}

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">I understand the risks and costs</span>
                    <input type="checkbox" className="checkbox checkbox-primary" />
                  </label>
                </div>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleExecute}
                  disabled={isExecuting}
                >
                  {isExecuting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Executing...
                    </>
                  ) : (
                    'Execute Rebalance'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicators */}
        <div className="divider"></div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>System Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-70">Last check:</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
