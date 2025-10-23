export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  PUBLIC: "public",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
