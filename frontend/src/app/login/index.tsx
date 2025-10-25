import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWeb3 } from "../../hooks/useWeb3";
import { AUTH_PROVIDERS } from "../../const/auth";
import { ROLES, type Role } from "../../const/roles";
import { generateId } from "../../lib/utils";
import { LoginForm } from "./_components/LoginForm";

const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const { connect, isConnecting, address, isConnected } = useWeb3();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  // Handle successful wallet connection
  useEffect(() => {
    if (isConnected && address && pendingRole) {
      const user = {
        id: generateId(),
        address: address,
        email: `user@rainbow.com`,
        name: `Rainbow User`,
        role: pendingRole as Role,
        avatar: `https://ui-avatars.com/api/?name=Rainbow&background=random`,
      };

      login(user);
      setPendingRole(null);
      setIsLoading(false);
    }
  }, [isConnected, address, pendingRole, login]);

  // Reset loading state if connection fails or is cancelled
  useEffect(() => {
    if (!isConnecting && !isConnected && pendingRole) {
      setIsLoading(false);
      setPendingRole(null);
    }
  }, [isConnecting, isConnected, pendingRole]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  const handleConnect = async (demoRole: string = ROLES.USER) => {
    setIsLoading(true);
    setPendingRole(demoRole);

    try {
      // Connect to Rainbow wallet
      await connect(AUTH_PROVIDERS.RAINBOW);
      console.log("Wallet connection initiated...");
      // Connection success will be handled by useEffect when isConnected becomes true
    } catch (error) {
      console.error("Login failed:", error);
      setPendingRole(null);
      // Don't re-throw here, just handle it gracefully
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/purel-logo.png" alt="PureL Logo" className="h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Connect your wallet to continue</p>
          </div>

          {/* Login Form with Demo Roles */}
          <LoginForm
            onConnect={handleConnect}
            isLoading={isLoading || isConnecting}
          />
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">
            Rainbow Wallet Setup
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Install Rainbow Wallet browser extension</p>
            <p>• Make sure you have some ETH for transactions</p>
            <p>• Connect to supported networks (Ethereum, Polygon, etc.)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            By connecting, you agree to our{" "}
            <button className="text-blue-600 hover:text-blue-700 underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-blue-600 hover:text-blue-700 underline">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
