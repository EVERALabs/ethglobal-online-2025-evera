import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Assuming these contexts and hooks are available in the running environment
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../hooks/useWeb3";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Mock NavLink data
const navLinks = [
  // { name: "Dashboard", path: "/dashboard" },
  { name: "Deposit", path: "/deposit" },
  { name: "Liquidity Pools", path: "/liquidity-pools" },
  { name: "Analytics", path: "/analytics" },
  { name: "Rebalance", path: "/rebalance" },
  { name: "Settings", path: "/settings" },
  { name: "Docs", path: "/about" },
];

// --- Enhanced Header Component ---

export const Header = () => {
  // --- State and Hooks ---
  const { logout, isAuthenticated } = useAuth(); // Assume these are active
  const { isConnected, disconnect } = useWeb3(); // Assume these are active
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Replace currentChain state with mock network info for visual enhancement
  const [currentNetwork, setCurrentNetwork] = useState({
    name: "Sepolia",
    color: "text-blue-600",
    bg: "bg-blue-50",
  });

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Handlers ---
  const handleLogout = async () => {
    try {
      if (isConnected) {
        await disconnect(); // Wallet disconnect (RainbowKit adapter's signOut is often tied to this)
      }
      logout(); // App session logout
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      navigate("/");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const switchNetwork = () => {
    // Mock chain switch action for visual demonstration
    setCurrentNetwork((prev) =>
      prev.name === "Base"
        ? { name: "Arbitrum", color: "text-sky-600", bg: "bg-sky-50" }
        : { name: "Base", color: "text-blue-600", bg: "bg-blue-50" }
    );
  };

  // --- Render ---
  return (
    <>
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white/90 backdrop-blur-md border-b border-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 1. Logo and Title */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-extrabold text-gray-900 tracking-tight"
            >
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2-1.343 2-3 2m0-8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Pure<span className="text-blue-600">-L</span> Finance
              </span>
            </Link>

            {/* 2. Desktop Navigation Links (Centered) */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  // Adjusted styling for a cleaner, more professional look
                  className="px-3 py-2 font-medium text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* 3. Right side controls (Web3 Block) */}
            <div className="flex items-center space-x-3">
              {/* Connect Button or Auth/User Menu */}
              {isAuthenticated ? (
                // Authenticated User Menu Block
                <div className="flex items-center space-x-2 p-1 pl-3 bg-gray-100 rounded-full border border-gray-200">
                  {/* The ConnectButton (which now typically shows Address/Disconnect) */}
                  <ConnectButton />

                  {/* // button to navigate to dashboard */}
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="p-2 ml-1 text-gray-500 hover:text-blue-500 transition-colors duration-200 hidden sm:block"
                    title="Dashboard"
                  >
                    Dashboard
                  </button>

                  {/* Simple Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 ml-1 text-gray-500 hover:text-red-500 transition-colors duration-200 hidden sm:block"
                    title="Sign Out"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                // Unauthenticated: Show only ConnectButton
                <ConnectButton />
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
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
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu (Sliding Panel Mock) */}
      <div
        id="mobile-menu"
        className={`fixed top-16 right-0 w-full max-w-xs h-full bg-white shadow-xl transform transition-transform duration-300 md:hidden z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-2 border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={toggleMobileMenu} // Close menu on click
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
            >
              {link.name}
            </Link>
          ))}

          <hr className="my-2" />

          {/* Mobile Logout/Auth Info */}
          <button
            onClick={switchNetwork}
            className={`flex items-center w-full justify-start space-x-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${currentNetwork.bg} ${currentNetwork.color} border border-gray-100`}
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>Current Network: {currentNetwork.name}</span>
          </button>
        </div>
      </div>
    </>
  );
};
