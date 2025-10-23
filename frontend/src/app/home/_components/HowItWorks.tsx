import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Deposit",
      description: "Deposit your assets into our smart contracts across multiple chains",
      icon: "💳",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02", 
      title: "Detect Volume",
      description: "Our AI algorithms monitor trading volume and liquidity across all supported chains",
      icon: "📊",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      title: "Rebalance",
      description: "Automatically rebalance your liquidity to chains with the highest yields and lowest fees",
      icon: "⚡",
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "04",
      title: "Earn",
      description: "Maximize your returns while minimizing gas costs and slippage across all positions",
      icon: "💰",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, automated liquidity management across multiple chains in just four steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0"></div>
              )}
              
              <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-lg font-semibold text-gray-700">
            <span>Ready to get started?</span>
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <span className="text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
              Launch App
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
