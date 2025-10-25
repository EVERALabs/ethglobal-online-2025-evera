import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../hooks/useWeb3";
import { formatAddress } from "../lib/utils";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isConnected, disconnect } = useWeb3();
  const navigate = useNavigate();
  const [currentChain, setCurrentChain] = useState("Base");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");

      // First disconnect the wallet
      if (isConnected) {
        console.log("Disconnecting wallet...");
        await disconnect();
      }

      // Then logout from auth context (this clears localStorage)
      logout();

      // Navigate to home page
      navigate("/", { replace: true });

      console.log("Logout completed successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if wallet disconnect fails, still logout from auth
      logout();
      navigate("/", { replace: true });
    }
  };

  const switchChain = () => {
    // Toggle between Base and Arbitrum for demo
    setCurrentChain(currentChain === "Base" ? "Arbitrum" : "Base");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Deposit", path: "/deposit" },
    { name: "Analytics", path: "/analytics" },
    { name: "Rebalance", path: "/rebalance" },
    { name: "Settings", path: "/settings" },
    { name: "Docs", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-gray-200"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - pure-L minimal */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src="/purel-logo.png"
              alt="pure-L logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-2 font-medium text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Chain Indicator */}
            <button
              onClick={switchChain}
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 bg-blue-50 hover:bg-blue-100 border border-blue-200"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-900">
                {currentChain}
              </span>
            </button>

            {/* Wallet Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900 text-white">
                  <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">
                    {formatAddress(user.address || "")}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200"
                  title="Logout & Disconnect Wallet"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-sm font-medium hidden sm:block">
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
