import React, { useState } from "react";

interface RebalanceRecommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number;
  expectedGain: number;
  moves: Array<{
    from: string;
    to: string;
    percentage: number;
    reason: string;
  }>;
  riskFactors: string[];
}

export const RecommendedRebalance: React.FC = () => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  // Mock AI recommendations - in real app, this would come from API
  const recommendations: RebalanceRecommendation[] = [
    {
      id: "primary",
      title: "Volume Shift Optimization",
      description: "Move 15% from Arbitrum → Base (volume shift +22%)",
      impact: "high",
      confidence: 87,
      expectedGain: 2.3,
      moves: [
        {
          from: "Arbitrum",
          to: "Base",
          percentage: 15,
          reason: "Base showing 22% volume increase, higher APY potential"
        }
      ],
      riskFactors: ["Gas costs on L1", "Temporary liquidity impact"]
    },
    {
      id: "secondary",
      title: "APY Rebalancing",
      description: "Optimize for higher yield chains",
      impact: "medium",
      confidence: 72,
      expectedGain: 1.1,
      moves: [
        {
          from: "Polygon",
          to: "Base",
          percentage: 8,
          reason: "Base APY 10.5% vs Polygon 7.8%"
        },
        {
          from: "Ethereum",
          to: "Arbitrum",
          percentage: 5,
          reason: "Arbitrum APY 9.1% vs Ethereum 8.2%"
        }
      ],
      riskFactors: ["Yield volatility", "Chain stability"]
    },
    {
      id: "conservative",
      title: "Risk-Adjusted Rebalance",
      description: "Minor adjustments for optimal risk/return",
      impact: "low",
      confidence: 94,
      expectedGain: 0.6,
      moves: [
        {
          from: "Ethereum",
          to: "Base",
          percentage: 3,
          reason: "Gradual shift to higher yield"
        }
      ],
      riskFactors: ["Minimal risk"]
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-error bg-error/10 border-error/20";
      case "medium": return "text-warning bg-warning/10 border-warning/20";
      case "low": return "text-success bg-success/10 border-success/20";
      default: return "text-black bg-white";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-success";
    if (confidence >= 60) return "text-warning";
    return "text-error";
  };

  return (
    <div className="card bg-white shadow-xl border border-gray-200">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="card-title text-xl text-primary">
            🤖 AI Recommended Rebalance
          </h3>
          <div className="badge badge-primary badge-lg">
            Live Analysis
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`card bg-white border-2 transition-all duration-200 cursor-pointer ${
                selectedRecommendation === rec.id 
                  ? 'border-primary shadow-lg' 
                  : 'border-transparent hover:border-primary/30'
              }`}
              onClick={() => setSelectedRecommendation(
                selectedRecommendation === rec.id ? null : rec.id
              )}
            >
              <div className="card-body p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">{rec.title}</h4>
                    <p className="text-sm opacity-70 mb-2">{rec.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`badge ${getImpactColor(rec.impact)}`}>
                      {rec.impact.toUpperCase()} IMPACT
                    </div>
                    <div className={`text-sm font-bold ${getConfidenceColor(rec.confidence)}`}>
                      {rec.confidence}% confidence
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-lg font-bold text-success">
                      +{rec.expectedGain}%
                    </div>
                    <div className="text-xs opacity-70">Expected Gain</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-lg font-bold text-info">
                      {rec.moves.length}
                    </div>
                    <div className="text-xs opacity-70">Moves</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <div className="text-lg font-bold text-warning">
                      {rec.riskFactors.length}
                    </div>
                    <div className="text-xs opacity-70">Risk Factors</div>
                  </div>
                </div>

                {selectedRecommendation === rec.id && (
                  <div className="space-y-4 pt-4 border-t border-base-300">
                    {/* Detailed Moves */}
                    <div>
                      <h5 className="font-semibold mb-2 text-primary">Proposed Moves:</h5>
                      <div className="space-y-2">
                        {rec.moves.map((move, moveIndex) => (
                          <div key={moveIndex} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="badge badge-outline">
                                {move.from} → {move.to}
                              </div>
                              <div className="font-bold text-primary">
                                {move.percentage}%
                              </div>
                            </div>
                            <div className="text-sm opacity-70 text-right max-w-xs">
                              {move.reason}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                      <h5 className="font-semibold mb-2 text-warning">Risk Factors:</h5>
                      <div className="flex flex-wrap gap-2">
                        {rec.riskFactors.map((risk, riskIndex) => (
                          <div key={riskIndex} className="badge badge-warning badge-outline">
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button className="btn btn-primary btn-sm flex-1">
                        Apply This Recommendation
                      </button>
                      <button className="btn btn-outline btn-sm">
                        Simulate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Analysis Footer */}
        <div className="divider"></div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>AI analysis updated 2 minutes ago</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-70">Based on:</span>
            <div className="flex gap-2">
              <div className="badge badge-outline badge-sm">Volume Data</div>
              <div className="badge badge-outline badge-sm">APY Trends</div>
              <div className="badge badge-outline badge-sm">Gas Costs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
