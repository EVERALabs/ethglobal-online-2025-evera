import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/90 backdrop-blur-lg border-t border-gray-200/50 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <a
            href="https://docs.pure-l.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300"
          >
            Docs
          </a>
          <a
            href="https://github.com/pure-l"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/purel_defi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300"
          >
            Twitter/X
          </a>
          <a
            href="https://discord.gg/purel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300"
          >
            Discord
          </a>
          <Link
            to="/privacy"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

        {/* Tagline with fade animation */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 animate-pulse">
            Smart liquidity, everywhere.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © 2025 pure-L by ETHGlobal Team
          </p>
        </div>
      </div>
    </footer>
  );
};
