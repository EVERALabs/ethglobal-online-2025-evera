import React from "react";

export const SupportedChainsTokens: React.FC = () => {
  const chains = [
    {
      name: "Sepolia Testnet",
      logo: "🔷",
      description: "Ethereum testnet for development and testing",
      tvl: "$1.2M",
      yield: "8.5%",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Hedera Testnet",
      logo: "🟢",
      description: "Fast, secure, and fair distributed ledger",
      tvl: "$800K",
      yield: "9.2%",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const tokens = [
    {
      name: "PYUSD",
      symbol: "PYUSD",
      description: "PayPal USD stablecoin",
      logo: "💵",
      color: "from-green-500 to-green-600",
    },
    {
      name: "USDC",
      symbol: "USDC",
      description: "USD Coin stablecoin",
      logo: "🪙",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "USDT",
      symbol: "USDT",
      description: "Tether USD stablecoin",
      logo: "💰",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      name: "WETH",
      symbol: "WETH",
      description: "Wrapped Ethereum",
      logo: "⚡",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
          Supported Chains & Tokens
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4"></div>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          We support the most popular and liquid chains and tokens in the
          ecosystem, with plans to expand to additional networks based on
          community demand.
        </p>
      </div>

      {/* Supported Chains */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold text-center mb-8 text-slate-900">
          Supported Chains
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chains.map((chain, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${chain.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}
                >
                  {chain.logo}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  {chain.name}
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  {chain.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">TVL:</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {chain.tvl}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Avg Yield:</span>
                    <span className="text-sm font-semibold text-green-600">
                      {chain.yield}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Tokens */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold text-center mb-8 text-slate-900">
          Supported Tokens
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokens.map((token, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${token.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}
                >
                  {token.logo}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">
                  {token.name}
                </h4>
                <p className="text-sm text-slate-500 mb-3">{token.symbol}</p>
                <p className="text-sm text-slate-600">{token.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chain Comparison Table */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <h3 className="text-2xl font-bold text-center mb-8 text-slate-900">
          Chain Performance Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Chain
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  TVL
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Avg Yield
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Gas Cost
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Speed
                </th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-4 px-4 font-medium text-slate-900">
                  Sepolia Testnet
                </td>
                <td className="py-4 px-4 text-slate-600">$1.2M</td>
                <td className="py-4 px-4 text-green-600 font-semibold">8.5%</td>
                <td className="py-4 px-4 text-slate-600">$0.15</td>
                <td className="py-4 px-4 text-slate-600">12s</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-slate-900">
                  Hedera Testnet
                </td>
                <td className="py-4 px-4 text-slate-600">$800K</td>
                <td className="py-4 px-4 text-green-600 font-semibold">9.2%</td>
                <td className="py-4 px-4 text-slate-600">$0.001</td>
                <td className="py-4 px-4 text-slate-600">3s</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Mainnet Support Coming Soon
          </h3>
          <p className="text-slate-600 mb-6">
            We're currently operating on testnets for development and testing.
            Mainnet support for Ethereum and Hedera will be available soon. Join
            our community to stay updated on the mainnet launch!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Ethereum Mainnet
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Hedera Mainnet
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
