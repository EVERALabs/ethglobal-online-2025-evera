export const AUTH_PROVIDERS = {
  PRIVY: "privy",
  RAINBOW: "rainbow",
  XELLAR: "xellar",
} as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

export const AUTH_CONFIG = {
  STORAGE_KEYS: {
    USER: "evera_user",
    TOKEN: "evera_token",
    ROLE: "evera_role",
    AUTH_PROVIDER: "evera_auth_provider",
  },
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
} as const;
