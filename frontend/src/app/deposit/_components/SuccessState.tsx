import React, { useEffect, useState } from 'react';

interface SuccessStateProps {
  onViewDashboard: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({ onViewDashboard }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="relative">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <span className="text-2xl">
                  {['🎉', '✨', '🎊', '💫', '🌟', '⭐'][Math.floor(Math.random() * 6)]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-success mb-2">
              Success!
            </h1>
            <p className="text-lg opacity-70">
              Liquidity deposited successfully!
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-xl p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="opacity-70">Transaction Hash:</span>
                <span className="font-mono text-sm">
                  0x1234...5678
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-70">Status:</span>
                <span className="badge badge-success">Confirmed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-70">Gas Used:</span>
                <span className="font-semibold">0.023 ETH</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">What's Next?</h3>
            <div className="space-y-2 text-sm opacity-70">
              <div className="flex items-center gap-2">
                <span>🔄</span>
                <span>Your funds are being allocated across chains</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📈</span>
                <span>Yield generation starts immediately</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔄</span>
                <span>Auto-rebalancing every 24 hours</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onViewDashboard}
              className="btn btn-primary btn-lg w-full"
            >
              View on Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline w-full"
            >
              Make Another Deposit
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-3 bg-info/10 rounded-lg border border-info/20">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-info">💡</span>
              <span className="text-info">
                You can track your portfolio performance and manage allocations on the dashboard
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
