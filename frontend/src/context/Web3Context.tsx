import React, { useEffect, useCallback, type ReactNode, useMemo } from "react";
import { useAccount, useConnectorClient, useDisconnect } from "wagmi";
import { AUTH_PROVIDERS, type AuthProvider } from "../const/auth";
import { Web3Context, type Web3ContextType } from "./Web3ContextDefinition";

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  // Wagmi automatically tracks connection status
  const { address, isConnected: wagmiIsConnected, isConnecting } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { data: connectorClient } = useConnectorClient(); // Check for client/provider existence

  // 💡 Provider state is now less relevant as RainbowKit is the primary method
  const provider: AuthProvider = AUTH_PROVIDERS.RAINBOW;

  // Cleanup/Side effects (e.g., local storage)
  useEffect(() => {
    // Store/Clear provider preference based on connection status
    if (wagmiIsConnected) {
      localStorage.setItem("evera_auth_provider", AUTH_PROVIDERS.RAINBOW);
    } else {
      localStorage.removeItem("evera_auth_provider");
    }
  }, [wagmiIsConnected]);

  // Use wagmi's disconnect directly
  const disconnect = useCallback(async () => {
    try {
      wagmiDisconnect();
      console.log("Disconnected from wallet");
      // Note: localStorage is cleared in the useEffect above
    } catch (error) {
      console.error("Failed to disconnect:", error);
      throw error;
    }
  }, [wagmiDisconnect]);

  // 💡 Connect is handled by the RainbowKit ConnectButton component.
  // 💡 switchProvider is also handled by RainbowKit's modal (Switch Wallet/Networks)
  const connectPlaceholder = useCallback(() => {
    // Direct connection logic is removed. Instruct the user to use the button.
    console.warn("Use the RainbowKit ConnectButton for wallet connection.");
    // You could throw an error or open the modal here if needed,
    // but it's cleaner to rely on the UI component.
    throw new Error(
      "Wallet connection is handled via the RainbowKit ConnectButton component."
    );
  }, []);

  const value: Web3ContextType = useMemo(
    () => ({
      provider,
      isConnected: wagmiIsConnected,
      isConnecting: isConnecting, // Use wagmi's isConnecting
      connect: connectPlaceholder, // Placeholder function
      disconnect,
      switchProvider: connectPlaceholder, // Placeholder function
      address,
      // Optional: Check if a provider/signer is actually available
      isProviderAvailable: !!connectorClient,
    }),
    [
      provider,
      wagmiIsConnected,
      isConnecting,
      address,
      disconnect,
      connectorClient,
    ]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
