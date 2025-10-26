import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AdminWalletApi,
  adminWalletQueries,
  type ReservedWallet,
} from "../../../lib/adminApi";
import { EditWalletModal } from "./EditWalletModal";

interface WalletListProps {
  onSelectWallet?: (wallet: ReservedWallet) => void;
  selectedWalletId?: string;
}

export const WalletList: React.FC<WalletListProps> = ({
  onSelectWallet,
  selectedWalletId,
}) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [editingWallet, setEditingWallet] = useState<ReservedWallet | null>(
    null
  );

  const {
    data: wallets = [],
    isLoading,
    error,
  } = useQuery(adminWalletQueries.list());

  const deleteWalletMutation = useMutation({
    mutationFn: AdminWalletApi.deletePrivateWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.lists(),
      });
    },
    onError: (error: unknown) => {
      console.error("Failed to delete wallet:", error);
    },
  });

  // Get all unique tags from wallets
  const allTags = Array.from(
    new Set(wallets.flatMap((wallet) => wallet.tags))
  ).sort();

  // Filter wallets based on search term and selected tag
  const filteredWallets = wallets.filter((wallet) => {
    const matchesSearch =
      wallet.publicKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTag = !selectedTag || wallet.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const handleDeleteWallet = (publicKey: string, walletNotes: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the wallet "${walletNotes}"?\n\nThis action cannot be undone.`
      )
    ) {
      deleteWalletMutation.mutate(publicKey);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getAccessCount = (wallet: ReservedWallet) => {
    return (
      wallet.ReservedWalletUserAccess?.filter((access) => access.active)
        .length || 0
    );
  };

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Failed to load wallets. Please try again.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <div className="flex justify-between items-center mb-6">
          <h2 className="card-title text-2xl">
            <span className="text-primary">💼</span>
            Private Wallets ({filteredWallets.length})
          </h2>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="form-control flex-1">
            <input
              type="text"
              placeholder="Search wallets by address, notes, or tags..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-control">
            <select
              className="select select-bordered"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wallets List */}
        {filteredWallets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">
              {wallets.length === 0
                ? "No wallets found"
                : "No matching wallets"}
            </h3>
            <p className="text-base-content/70">
              {wallets.length === 0
                ? "Create your first private wallet to get started."
                : "Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWallets.map((wallet) => (
              <div
                key={wallet.publicKey}
                className={`card bg-base-200 border cursor-pointer transition-all hover:shadow-md ${
                  selectedWalletId === wallet.publicKey
                    ? "border-primary shadow-md"
                    : "border-base-300"
                }`}
                onClick={() => onSelectWallet?.(wallet)}
              >
                <div className="card-body p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-mono text-lg font-semibold">
                          {formatAddress(wallet.publicKey)}
                        </h3>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(wallet.publicKey);
                          }}
                          title="Copy full address"
                        >
                          📋
                        </button>
                      </div>

                      <p className="text-sm text-base-content/70 mb-3">
                        {wallet.notes}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {wallet.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge badge-outline badge-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-base-content/60">
                        <span>
                          👥 {getAccessCount(wallet)} user(s) with access
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingWallet(wallet);
                        }}
                        title="Edit wallet"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectWallet?.(wallet);
                        }}
                        title="Manage access"
                      >
                        ⚙️
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWallet(wallet.publicKey, wallet.notes);
                        }}
                        disabled={deleteWalletMutation.isPending}
                        title="Delete wallet"
                      >
                        {deleteWalletMutation.isPending ? (
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

        {/* Edit Wallet Modal */}
        {editingWallet && (
          <EditWalletModal
            wallet={editingWallet}
            isOpen={!!editingWallet}
            onClose={() => setEditingWallet(null)}
          />
        )}
      </div>
    </div>
  );
};
