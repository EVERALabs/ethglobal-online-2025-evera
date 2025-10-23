import React from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "./_components/HeroSection";
import { HowItWorks } from "./_components/HowItWorks";
import { LiveMetrics } from "./_components/LiveMetrics";
import { SupportedChains } from "./_components/SupportedChains";
import { Integrations } from "./_components/Integrations";
import { Layout } from "../../components/Layout";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-0">
        <HeroSection />
        <HowItWorks />
        <LiveMetrics />
        <SupportedChains />
        <Integrations />
        
        {/* Final CTA Section */}
        <div className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Start Rebalancing Today
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of users maximizing their DeFi yields across multiple chains
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/dashboard" 
                className="px-12 py-4 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
              >
                Launch App →
              </Link>
              <a
                href="https://docs.pure-l.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-4 text-lg font-semibold bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Read Documentation
              </a>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>No KYC Required</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Audited Smart Contracts</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
