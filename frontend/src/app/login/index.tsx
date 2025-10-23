import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWeb3 } from "../../hooks/useWeb3";
import { AUTH_PROVIDERS, type AuthProvider } from "../../const/auth";
import { ROLES } from "../../const/roles";
import { generateId } from "../../lib/utils";
import { AuthProviderSelector } from "./_components/AuthProviderSelector";
import { LoginForm } from "./_components/LoginForm";

const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const { connect, isConnecting } = useWeb3();
  const location = useLocation();
  const [selectedProvider, setSelectedProvider] = useState<AuthProvider>(
    AUTH_PROVIDERS.PRIVY
  );
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  const handleConnect = async (
    provider: string,
    demoRole: string = ROLES.USER
  ) => {
    setIsLoading(true);
    try {
      // Connect to Web3 provider
      await connect(provider as any);

      // Simulate authentication - in real app, this would come from the provider
      const mockUser = {
        id: generateId(),
        address: "0x742d35Cc6634C0532925a3b8D0C4E5e3d2c0b98e",
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        role: demoRole as any,
        avatar: `https://ui-avatars.com/api/?name=${provider}&background=random`,
      };

      login(mockUser);
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error - show toast, etc.
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Connect your wallet to continue</p>
          </div>

          {/* Auth Provider Selector */}
          <div className="mb-6">
            <AuthProviderSelector
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Choose your role</span>
            </div>
          </div>

          {/* Login Form with Demo Roles */}
          <LoginForm
            onConnect={handleConnect}
            selectedProvider={selectedProvider}
            isLoading={isLoading || isConnecting}
          />
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">Demo Information</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• This is a demo implementation</p>
            <p>• Real wallet integration requires proper setup</p>
            <p>• Environment variables needed for production</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            By connecting, you agree to our{' '}
            <button className="text-blue-600 hover:text-blue-700 underline">
              Terms of Service
            </button>{' '}
            and{' '}
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
