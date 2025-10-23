import React from "react";
import { AUTH_PROVIDERS, type AuthProvider } from "../../../const/auth";

interface AuthProviderSelectorProps {
  selectedProvider: AuthProvider;
  onProviderChange: (provider: AuthProvider) => void;
}

export const AuthProviderSelector: React.FC<AuthProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
}) => {
  const providers = [
    {
      id: AUTH_PROVIDERS.RAINBOW,
      name: "Rainbow Wallet",
      description: "Connect with Rainbow Wallet",
      icon: "🌈",
      color: "border-secondary",
    },
    // Temporarily disabled providers
    // {
    //   id: AUTH_PROVIDERS.PRIVY,
    //   name: "Privy",
    //   description: "Easy Web3 authentication (Coming Soon)",
    //   icon: "🔐",
    //   color: "border-primary",
    //   disabled: true,
    // },
    // {
    //   id: AUTH_PROVIDERS.XELLAR,
    //   name: "Xellar",
    //   description: "Xellar wallet integration (Coming Soon)",
    //   icon: "⭐",
    //   color: "border-accent",
    //   disabled: true,
    // },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-gray-700">Select Provider</h3>
      <div className="grid grid-cols-1 gap-3">
        {providers.map((provider) => (
          <label
            key={provider.id}
            className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:shadow-md ${
              selectedProvider === provider.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="provider"
              value={provider.id}
              checked={selectedProvider === provider.id}
              onChange={(e) => onProviderChange(e.target.value as AuthProvider)}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              <div className="text-2xl">{provider.icon}</div>
              <div className="flex-1">
                <div className={`font-semibold ${selectedProvider === provider.id ? 'text-blue-900' : 'text-gray-900'}`}>
                  {provider.name}
                </div>
                <div className="text-sm text-gray-600">{provider.description}</div>
              </div>
              {selectedProvider === provider.id && (
                <div className="text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
