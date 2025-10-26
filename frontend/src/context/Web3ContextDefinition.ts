import { createContext } from "react";
import type { AuthProvider } from "../const/auth";

export interface Web3ContextType {
  provider: AuthProvider | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (provider: AuthProvider) => Promise<void>;
  disconnect: () => Promise<void>;
  switchProvider: (provider: AuthProvider) => Promise<void>;
  address?: string;
}

export const Web3Context = createContext<Web3ContextType | undefined>(
  undefined
);
