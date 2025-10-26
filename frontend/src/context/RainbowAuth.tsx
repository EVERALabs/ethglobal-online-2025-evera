import {
  createAuthenticationAdapter,
  type AuthenticationStatus,
} from "@rainbow-me/rainbowkit";
import { createSiweMessage } from "viem/siwe";
import { AUTH_CONFIG } from "../const/auth";

// Authentication state management
const AUTH_STATE_KEY = "evera_auth_state";
const AUTH_LOADING_TIMEOUT = 30000; // 30 seconds timeout for loading state

// Set authentication state in localStorage
const setAuthState = (state: AuthenticationStatus) => {
  localStorage.setItem(AUTH_STATE_KEY, state);
  if (state === "loading") {
    // Set a timestamp to prevent infinite loading
    localStorage.setItem(`${AUTH_STATE_KEY}_timestamp`, Date.now().toString());
  } else {
    // Clear timestamp when not loading
    localStorage.removeItem(`${AUTH_STATE_KEY}_timestamp`);
  }
};

// Get authentication state from localStorage with loading timeout protection
const getAuthState = (): AuthenticationStatus => {
  const state = localStorage.getItem(AUTH_STATE_KEY) as AuthenticationStatus;

  // Check if we have a loading state that might be stuck
  if (state === "loading") {
    const timestamp = localStorage.getItem(`${AUTH_STATE_KEY}_timestamp`);
    if (timestamp) {
      const loadingTime = Date.now() - parseInt(timestamp);
      if (loadingTime > AUTH_LOADING_TIMEOUT) {
        console.warn(
          "Authentication loading state timed out, resetting to unauthenticated"
        );
        setAuthState("unauthenticated");
        return "unauthenticated";
      }
    }
  }

  return state || "unauthenticated";
};

// Clear all authentication data
const clearAuthData = () => {
  // Clear auth-specific items
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.ROLE);
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_PROVIDER);
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
  localStorage.removeItem(AUTH_STATE_KEY);
  localStorage.removeItem(`${AUTH_STATE_KEY}_timestamp`);

  // Clear wagmi/wallet connect storage
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith("wagmi") ||
        key.startsWith("walletconnect") ||
        key.startsWith("wc@2"))
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    try {
      setAuthState("loading");

      // Get the current wallet address from wagmi/RainbowKit
      const accounts = await window.ethereum?.request({
        method: "eth_accounts",
      });
      const walletAddress = accounts?.[0];

      if (!walletAddress) {
        setAuthState("unauthenticated");
        throw new Error("No wallet address found");
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/auth/nonce?walletAddress=${walletAddress}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to get nonce:", response.status, errorText);
        setAuthState("unauthenticated");

        // Provide more specific error messages
        if (response.status === 400) {
          throw new Error(
            "Invalid wallet address or server error. Please try again."
          );
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(`Failed to get nonce: ${response.status}`);
        }
      }

      const data = await response.json();

      if (!data.nonce) {
        setAuthState("unauthenticated");
        throw new Error("Invalid response: no nonce received");
      }

      console.log("Successfully received nonce for wallet:", walletAddress);
      console.log("Nonce:", data.nonce);
      return data.nonce;
    } catch (error) {
      console.error("Error in getNonce:", error);
      setAuthState("unauthenticated");
      throw error;
    }
  },

  createMessage: ({ nonce, address, chainId }) => {
    console.log("Creating SIWE message for wallet:", address);
    try {
      return createSiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    } catch (error) {
      console.error("Error in createMessage:", error);
      setAuthState("unauthenticated");
      throw error;
    }
  },

  verify: async ({ message, signature }) => {
    try {
      setAuthState("loading");
      console.log("Verifying signature:", signature);
      console.log("Message:", message);

      const verifyRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/wallet`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signature: signature,
            message: message,
          }),
        }
      );

      if (verifyRes.ok) {
        const authData = await verifyRes.json();
        console.log("Authentication successful:", authData);

        // Store the JWT token and user data using AUTH_CONFIG keys
        if (authData.access_token) {
          localStorage.setItem(
            AUTH_CONFIG.STORAGE_KEYS.TOKEN,
            authData.access_token
          );
          localStorage.setItem("auth_token", authData.access_token); // Legacy support
        }
        if (authData.user) {
          localStorage.setItem(
            AUTH_CONFIG.STORAGE_KEYS.USER,
            JSON.stringify(authData.user)
          );
          localStorage.setItem("user_data", JSON.stringify(authData.user)); // Legacy support
          localStorage.setItem(
            AUTH_CONFIG.STORAGE_KEYS.ROLE,
            authData.user.role
          );
        }
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_PROVIDER, "rainbow");

        setAuthState("authenticated");
        return true;
      } else {
        console.error("Authentication failed:", await verifyRes.text());
        setAuthState("unauthenticated");
        return false;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthState("unauthenticated");
      return false;
    }
  },

  signOut: async () => {
    try {
      setAuthState("loading");

      // Clear all authentication data
      clearAuthData();

      // Clear cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      setAuthState("unauthenticated");

      // Reload the page after a short delay to ensure state is updated
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Sign out error:", error);
      setAuthState("unauthenticated");
    }
  },
});

// Initialize authentication state on module load
// Check for stuck loading state on app startup
const initializeAuthState = () => {
  const currentState = getAuthState();
  if (currentState === "loading") {
    console.log(
      "Detected stuck loading state on startup, resetting to unauthenticated"
    );
    setAuthState("unauthenticated");
  }
};

// Initialize on module load
initializeAuthState();

export { authenticationAdapter, getAuthState, setAuthState };
