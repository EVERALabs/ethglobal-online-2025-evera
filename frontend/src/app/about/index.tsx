import React from "react";
import { Layout } from "../../components/Layout";
import { AboutPureL } from "./_components/AboutPureL";
import { HowItWorksDiagram } from "./_components/HowItWorksDiagram";
import { SupportedChainsTokens } from "./_components/SupportedChainsTokens";
import { TeamSection } from "./_components/TeamSection";
import { DocumentationLinks } from "./_components/DocumentationLinks";

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-base-200/30">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-8">
            {/* Page Header */}
            <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
              <div className="text-center">
                <div className="mb-6">
                  <img src="/purel-logo.png" alt="Pure-L Logo" className="h-16 mx-auto mb-4" />
                </div>
                <h1 className="text-4xl font-primary font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                  About Pure-L
                </h1>
                <p className="text-lg font-secondary opacity-70 max-w-3xl mx-auto">
                  Learn about our mission to revolutionize cross-chain liquidity management 
                  and our connection to the SolHedge ecosystem.
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-2">
              <div className="space-y-16">
                <AboutPureL />
                <HowItWorksDiagram />
                <SupportedChainsTokens />
                <TeamSection />
                <DocumentationLinks />
              </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl shadow-xl p-8 border border-primary/20">
              <div className="text-center">
                <h2 className="text-3xl font-primary font-bold mb-4 text-primary">
                  Ready to Get Started?
                </h2>
                <p className="text-lg font-secondary opacity-70 mb-8 max-w-2xl mx-auto">
                  Join the future of automated cross-chain liquidity management
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/dashboard"
                    className="btn btn-primary btn-lg px-8 py-3 text-lg font-primary font-semibold"
                  >
                    Launch App
                  </a>
                  <a
                    href="https://github.com/pure-l"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-lg px-8 py-3 text-lg font-primary font-semibold"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
