import axiosInstance from "./axios";

// Types for admin wallet operations
export interface CreatePrivateWalletDto {
  publicKey: string;
  privateKey: string;
  tags: string[];
  notes: string;
}

export interface UpdatePrivateWalletDto {
  tags?: string[];
  notes?: string;
}

export interface CreateReservedWalletUserAccessDto {
  userId: string;
}

export interface UpdateReservedWalletUserAccessDto {
  active?: boolean;
}

export interface ReservedWallet {
  publicKey: string;
  privateKey: string;
  tags: string[];
  notes: string;
  ReservedWalletUserAccess: ReservedWalletUserAccess[];
}

export interface ReservedWalletUserAccess {
  userId: string;
  reservedWalletPublicKey: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  reservedWallet?: {
    publicKey: string;
    tags: string[];
    notes: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Admin Wallet API Service
export class AdminWalletApi {
  private static baseUrl = "/admin";

  // Private Wallet CRUD Operations
  static async createPrivateWallet(
    data: CreatePrivateWalletDto
  ): Promise<ReservedWallet> {
    const response = await axiosInstance.post(`admin/private-wallets`, data);
    return response.data;
  }

  static async getPrivateWallets(): Promise<ReservedWallet[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/private-wallets`);
    return response.data;
  }

  static async getPrivateWallet(publicKey: string): Promise<ReservedWallet> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/private-wallets/${publicKey}`
    );
    return response.data;
  }

  static async updatePrivateWallet(
    publicKey: string,
    data: UpdatePrivateWalletDto
  ): Promise<ReservedWallet> {
    const response = await axiosInstance.put(
      `${this.baseUrl}/private-wallets/${publicKey}`,
      data
    );
    return response.data;
  }

  static async deletePrivateWallet(
    publicKey: string
  ): Promise<{ message: string }> {
    const response = await axiosInstance.delete(
      `${this.baseUrl}/private-wallets/${publicKey}`
    );
    return response.data;
  }

  // Reserved Wallet User Access Operations
  static async grantWalletAccess(
    publicKey: string,
    data: CreateReservedWalletUserAccessDto
  ): Promise<ReservedWalletUserAccess> {
    const response = await axiosInstance.post(
      `${this.baseUrl}/private-wallets/${publicKey}/access`,
      data
    );
    return response.data;
  }

  static async getWalletAccesses(
    publicKey: string
  ): Promise<ReservedWalletUserAccess[]> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/private-wallets/${publicKey}/access`
    );
    return response.data;
  }

  static async updateWalletAccess(
    publicKey: string,
    userId: string,
    data: UpdateReservedWalletUserAccessDto
  ): Promise<ReservedWalletUserAccess> {
    const response = await axiosInstance.put(
      `${this.baseUrl}/private-wallets/${publicKey}/access/${userId}`,
      data
    );
    return response.data;
  }

  static async revokeWalletAccess(
    publicKey: string,
    userId: string
  ): Promise<{ message: string }> {
    const response = await axiosInstance.delete(
      `${this.baseUrl}/private-wallets/${publicKey}/access/${userId}`
    );
    return response.data;
  }
}

// React Query hooks for admin wallet operations
export const adminWalletQueries = {
  // Query keys
  keys: {
    all: ["admin-wallets"] as const,
    lists: () => [...adminWalletQueries.keys.all, "list"] as const,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: (filters?: any) =>
      [...adminWalletQueries.keys.lists(), { filters }] as const,
    details: () => [...adminWalletQueries.keys.all, "detail"] as const,
    detail: (publicKey: string) =>
      [...adminWalletQueries.keys.details(), publicKey] as const,
    accesses: (publicKey: string) =>
      [...adminWalletQueries.keys.all, "accesses", publicKey] as const,
  },

  // Query options
  list: () => ({
    queryKey: adminWalletQueries.keys.list(),
    queryFn: () => AdminWalletApi.getPrivateWallets(),
  }),

  detail: (publicKey: string) => ({
    queryKey: adminWalletQueries.keys.detail(publicKey),
    queryFn: () => AdminWalletApi.getPrivateWallet(publicKey),
    enabled: !!publicKey,
  }),

  accesses: (publicKey: string) => ({
    queryKey: adminWalletQueries.keys.accesses(publicKey),
    queryFn: () => AdminWalletApi.getWalletAccesses(publicKey),
    enabled: !!publicKey,
  }),
};
