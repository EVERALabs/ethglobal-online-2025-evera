import React from 'react';

export const AboutPureL: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-primary font-bold mb-4 text-base-content">
          About Pure-L
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body p-6">
              <h3 className="card-title text-xl font-primary mb-4">Our Origin</h3>
              <p className="text-base-content/70 font-secondary leading-relaxed mb-4">
                Pure-L was born from the need to solve one of DeFi's most pressing challenges: 
                inefficient cross-chain liquidity management. As the multi-chain ecosystem exploded, 
                users found themselves manually managing positions across dozens of chains, 
                missing opportunities and paying excessive gas fees.
              </p>
              <p className="text-base-content/70 font-secondary leading-relaxed">
                Our team recognized that the future of DeFi lies in seamless, automated 
                cross-chain operations that work behind the scenes to maximize user returns 
                while minimizing complexity.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body p-6">
              <h3 className="card-title text-xl font-primary mb-4">Our Vision</h3>
              <p className="text-base-content/70 font-secondary leading-relaxed mb-4">
                We envision a world where DeFi users can deploy capital across any chain 
                without worrying about manual rebalancing, gas optimization, or yield maximization. 
                Pure-L serves as the intelligent layer that makes this vision a reality.
              </p>
              <p className="text-base-content/70 font-secondary leading-relaxed">
                Our goal is to become the standard infrastructure for cross-chain liquidity 
                management, enabling protocols and users to focus on what matters most: 
                building and growing the decentralized economy.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Elements */}
        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl border border-primary/20">
            <div className="card-body p-6">
              <h3 className="card-title text-xl mb-6 text-primary">Connection to SolHedge</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-content text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-2">Shared Infrastructure</h4>
                    <p className="text-base-content/70 text-sm">
                      Built on SolHedge's proven cross-chain infrastructure and security models
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary-content text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-2">Complementary Services</h4>
                    <p className="text-base-content/70 text-sm">
                      Pure-L focuses on liquidity management while SolHedge provides broader DeFi services
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-accent-content text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content mb-2">Ecosystem Synergy</h4>
                    <p className="text-base-content/70 text-sm">
                      Together, we create a comprehensive DeFi ecosystem for cross-chain operations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">$2.4M</div>
                <div className="text-sm text-base-content/70">Total Value Locked</div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body p-4 text-center">
                <div className="text-2xl font-bold text-secondary mb-1">4</div>
                <div className="text-sm text-base-content/70">Supported Chains</div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">847</div>
                <div className="text-sm text-base-content/70">Daily Rebalances</div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body p-4 text-center">
                <div className="text-2xl font-bold text-success mb-1">99.9%</div>
                <div className="text-sm text-base-content/70">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
