import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AdminWalletApi,
  adminWalletQueries,
  type ReservedWallet,
  type ReservedWalletUserAccess,
} from "../../../lib/adminApi";

interface WalletAccessManagerProps {
  wallet: ReservedWallet;
  onClose?: () => void;
}

export const WalletAccessManager: React.FC<WalletAccessManagerProps> = ({
  wallet,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [newUserEmail, setNewUserEmail] = useState("");

  const {
    data: accesses = [],
    isLoading,
    error,
  } = useQuery(adminWalletQueries.accesses(wallet.publicKey));

  // Type guard for error to make it compatible with JSX
  const hasError = error != null;

  const grantAccessMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      return AdminWalletApi.grantWalletAccess(wallet.publicKey, { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.accesses(wallet.publicKey),
      });
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.lists(),
      });
      setNewUserEmail("");
    },
    onError: (error) => {
      console.error("Failed to grant access:", error);
    },
  });

  const updateAccessMutation = useMutation({
    mutationFn: async ({
      userId,
      active,
    }: {
      userId: string;
      active: boolean;
    }) => {
      return AdminWalletApi.updateWalletAccess(wallet.publicKey, userId, {
        active,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.accesses(wallet.publicKey),
      });
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.lists(),
      });
    },
    onError: (error: unknown) => {
      console.error("Failed to update access:", error);
    },
  });

  const revokeAccessMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      return AdminWalletApi.revokeWalletAccess(wallet.publicKey, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.accesses(wallet.publicKey),
      });
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.lists(),
      });
    },
    onError: (error: unknown) => {
      console.error("Failed to revoke access:", error);
    },
  });

  const handleGrantAccess = async () => {
    if (!newUserEmail.trim()) return;

    // In a real app, you'd search for users by email
    // For now, we'll use the email as userId (this should be replaced with proper user lookup)
    const userId = newUserEmail.trim();
    grantAccessMutation.mutate({ userId });
  };

  const handleToggleAccess = (access: ReservedWalletUserAccess) => {
    updateAccessMutation.mutate({
      userId: access.userId,
      active: !access.active,
    });
  };

  const handleRevokeAccess = (access: ReservedWalletUserAccess) => {
    if (
      window.confirm(
        `Are you sure you want to permanently revoke access for ${access.user.name}?`
      )
    ) {
      revokeAccessMutation.mutate({ userId: access.userId });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="card-title text-2xl mb-2">
              <span className="text-primary">👥</span>
              Access Management
            </h2>
            <div className="text-sm text-base-content/70">
              <p className="font-mono">{formatAddress(wallet.publicKey)}</p>
              <p>{wallet.notes}</p>
            </div>
          </div>
          {onClose && (
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        {/* Grant New Access */}
        <div className="card bg-base-200 mb-6">
          <div className="card-body p-4">
            <h3 className="font-semibold mb-3">Grant New Access</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter user email or ID"
                className="input input-bordered flex-1"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleGrantAccess();
                  }
                }}
              />
              <button
                className="btn btn-primary"
                onClick={handleGrantAccess}
                disabled={!newUserEmail.trim() || grantAccessMutation.isPending}
              >
                {grantAccessMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Granting...
                  </>
                ) : (
                  "Grant Access"
                )}
              </button>
            </div>
            {grantAccessMutation.error && (
              <div className="alert alert-error mt-2">
                <span className="text-sm">
                  {(
                    grantAccessMutation.error as Error & {
                      response?: { data?: { message?: string } };
                    }
                  )?.response?.data?.message ||
                    "Failed to grant access. Please try again."}
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <h3 className="font-semibold mb-4">
              Current Access ({accesses.length})
            </h3>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : hasError ? (
              <div className="alert alert-error">
                <span>Failed to load access records. Please try again.</span>
              </div>
            ) : accesses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">👤</div>
                <p className="text-base-content/70">
                  No users have access to this wallet yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {accesses.map((access) => (
                  <div
                    key={`${access.userId}-${access.reservedWalletPublicKey}`}
                    className="card bg-base-200 border border-base-300"
                  >
                    <div className="card-body p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-10">
                                <span className="text-sm">
                                  {access.user.name?.charAt(0)?.toUpperCase() ||
                                    "?"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold">
                                {access.user.name || "Unknown User"}
                              </h4>
                              <p className="text-sm text-base-content/70">
                                {access.user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-base-content/60">
                            <span>Granted: {formatDate(access.createdAt)}</span>
                            <span>Updated: {formatDate(access.updatedAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Status Badge */}
                          <div
                            className={`badge ${
                              access.active ? "badge-success" : "badge-error"
                            }`}
                          >
                            {access.active ? "Active" : "Inactive"}
                          </div>

                          {/* Toggle Access */}
                          <button
                            className={`btn btn-sm ${
                              access.active ? "btn-warning" : "btn-success"
                            }`}
                            onClick={() => handleToggleAccess(access)}
                            disabled={updateAccessMutation.isPending}
                            title={
                              access.active
                                ? "Deactivate access"
                                : "Activate access"
                            }
                          >
                            {updateAccessMutation.isPending ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : access.active ? (
                              "⏸️"
                            ) : (
                              "▶️"
                            )}
                          </button>

                          {/* Revoke Access */}
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleRevokeAccess(access)}
                            disabled={revokeAccessMutation.isPending}
                            title="Permanently revoke access"
                          >
                            {revokeAccessMutation.isPending ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "🗑️"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {updateAccessMutation.error || revokeAccessMutation.error ? (
            <div className="alert alert-error mt-4">
              <span>
                {(
                  updateAccessMutation.error as Error & {
                    response?: { data?: { message?: string } };
                  }
                )?.response?.data?.message ||
                  (
                    revokeAccessMutation.error as Error & {
                      response?: { data?: { message?: string } };
                    }
                  )?.response?.data?.message ||
                  "An error occurred. Please try again."}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
