import React, {
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AUTH_PROVIDERS, type AuthProvider } from "../const/auth";
import { Web3Context, type Web3ContextType } from "./Web3ContextDefinition";

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<AuthProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Load provider from environment or localStorage
    const envProvider = import.meta.env.VITE_AUTH_PROVIDER as AuthProvider;
    const storedProvider = localStorage.getItem(
      "evera_auth_provider"
    ) as AuthProvider;

    if (envProvider && Object.values(AUTH_PROVIDERS).includes(envProvider)) {
      setProvider(envProvider);
    } else if (
      storedProvider &&
      Object.values(AUTH_PROVIDERS).includes(storedProvider)
    ) {
      setProvider(storedProvider);
    } else {
      // Default to Rainbow if no provider is set
      setProvider(AUTH_PROVIDERS.RAINBOW);
    }
  }, []);

  const connect = async (selectedProvider: AuthProvider) => {
    setIsConnecting(true);
    try {
      // Here you would implement the actual connection logic for each provider
      switch (selectedProvider) {
        case AUTH_PROVIDERS.RAINBOW:
          await connectRainbow();
          console.log("Connected with Rainbow Wallet!");
          break;
        case AUTH_PROVIDERS.PRIVY:
          // Disabled for now
          throw new Error("Privy is temporarily disabled");
        case AUTH_PROVIDERS.XELLAR:
          // Disabled for now
          throw new Error("Xellar is temporarily disabled");
        default:
          throw new Error(`Unsupported provider: ${selectedProvider}`);
      }

      setProvider(selectedProvider);
      setIsConnected(true);
      localStorage.setItem("evera_auth_provider", selectedProvider);
    } catch (error) {
      console.error("Failed to connect:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectRainbow = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          console.log("Connected to Rainbow Wallet:", accounts[0]);
          return accounts[0];
        } else {
          throw new Error("No accounts found");
        }
      } catch (error) {
        console.error("Error connecting to Rainbow Wallet:", error);
        throw error;
      }
    } else {
      throw new Error(
        "Rainbow Wallet not found. Please install Rainbow Wallet extension."
      );
    }
  };

  const disconnect = async () => {
    try {
      // Implement disconnect logic for each provider
      setIsConnected(false);
      setProvider(null);
      localStorage.removeItem("evera_auth_provider");
    } catch (error) {
      console.error("Failed to disconnect:", error);
      throw error;
    }
  };

  const switchProvider = async (newProvider: AuthProvider) => {
    await disconnect();
    await connect(newProvider);
  };

  const value: Web3ContextType = {
    provider,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    switchProvider,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

