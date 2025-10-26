import React from "react";

export const SupportedChains: React.FC = () => {
  const chains = [
    {
      name: "Sepolia Testnet",
      logo: "🔷",
      color: "from-blue-500 to-blue-600",
      tvl: "$1.2M",
      yield: "8.5%",
      status: "active",
    },
    {
      name: "Hedera Testnet",
      logo: "🟢",
      color: "from-green-500 to-emerald-500",
      tvl: "$800K",
      yield: "9.2%",
      status: "active",
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Supported Chains
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seamlessly manage liquidity across the most popular Layer 2 networks
            and emerging chains
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {chains.map((chain) => (
            <div
              key={chain.name}
              className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                chain.status === "active"
                  ? "border-gray-100 hover:border-gray-200"
                  : "border-gray-200 opacity-75"
              } group`}
            >
              {/* Status Badge */}
              <div className="absolute -top-2 -right-2">
                {chain.status === "active" ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                )}
              </div>

              {/* Chain Logo */}
              <div
                className={`w-16 h-16 bg-gradient-to-br ${chain.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
              >
                {chain.logo}
              </div>

              {/* Chain Name */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {chain.name}
              </h3>

              {/* Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">TVL</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {chain.tvl}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">APY</span>
                  <span className="text-sm font-semibold text-green-600">
                    {chain.yield}
                  </span>
                </div>
              </div>

              {/* Coming Soon Overlay */}
              {chain.status === "coming-soon" && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-orange-500 font-semibold">
                      Coming Soon
                    </div>
                    <div className="text-xs text-gray-500">Q2 2024</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">6</div>
              <div className="text-blue-100">Active Chains</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$3.6M</div>
              <div className="text-blue-100">Total TVL</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">13.4%</div>
              <div className="text-blue-100">Average APY</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
