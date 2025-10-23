import React from 'react';

export const Integrations: React.FC = () => {
  const integrations = [
    {
      name: 'PayPal',
      description: 'PYUSD stablecoin integration for seamless fiat on-ramps',
      logo: '💳',
      category: 'Payment',
      status: 'active',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'LayerZero',
      description: 'Omnichain interoperability protocol for cross-chain messaging',
      logo: '🌐',
      category: 'Bridge',
      status: 'active',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'Axelar',
      description: 'Universal cross-chain communication network',
      logo: '⚡',
      category: 'Bridge',
      status: 'active',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'SolHedge APIs',
      description: 'Advanced yield farming and liquidity analytics',
      logo: '📊',
      category: 'Analytics',
      status: 'active',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Chainlink',
      description: 'Decentralized oracle network for price feeds',
      logo: '🔗',
      category: 'Oracle',
      status: 'active',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: '1inch',
      description: 'DEX aggregator for optimal swap routing',
      logo: '🔄',
      category: 'DEX',
      status: 'active',
      color: 'from-pink-500 to-purple-500'
    },
    {
      name: 'Uniswap V3',
      description: 'Concentrated liquidity AMM protocol',
      logo: '🦄',
      category: 'DEX',
      status: 'active',
      color: 'from-red-500 to-pink-500'
    },
    {
      name: 'Aave',
      description: 'Decentralized lending and borrowing protocol',
      logo: '🏦',
      category: 'Lending',
      status: 'active',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const categories = ['All', 'Payment', 'Bridge', 'Analytics', 'Oracle', 'DEX', 'Lending'];

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Integrations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built on top of the most trusted protocols and infrastructure in DeFi
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2.5 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((integration) => (
            <div 
              key={integration.name}
              className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Logo */}
              <div className={`w-16 h-16 bg-gradient-to-br ${integration.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {integration.logo}
              </div>

              {/* Name and Category */}
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {integration.name}
                </h3>
                <div className="inline-block px-3 py-1 bg-blue-50 rounded-full text-xs text-blue-700 font-medium border border-blue-200">
                  {integration.category}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {integration.description}
              </p>

              {/* Status */}
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700 text-sm font-medium">
                  {integration.status === 'active' ? 'Active' : 'Coming Soon'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Benefits */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-3">Why These Integrations Matter</h3>
            <p className="text-blue-100 text-lg">Seamless interoperability for maximum efficiency</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-3xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Reduced Gas Costs</h4>
              <p className="text-blue-100 text-sm leading-relaxed">Optimized routing through multiple protocols reduces transaction fees by up to 40%</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-3xl">🔄</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Cross-Chain Liquidity</h4>
              <p className="text-blue-100 text-sm leading-relaxed">Access to liquidity pools across all major Layer 2 networks and sidechains</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-3xl">📈</span>
              </div>
              <h4 className="text-xl font-semibold mb-3">Enhanced Yields</h4>
              <p className="text-blue-100 text-sm leading-relaxed">AI-powered yield optimization across multiple protocols and chains</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
