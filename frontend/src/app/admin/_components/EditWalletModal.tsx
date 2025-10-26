import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AdminWalletApi,
  adminWalletQueries,
  type ReservedWallet,
  type UpdatePrivateWalletDto,
} from "../../../lib/adminApi";

interface EditWalletModalProps {
  wallet: ReservedWallet;
  isOpen: boolean;
  onClose: () => void;
}

export const EditWalletModal: React.FC<EditWalletModalProps> = ({
  wallet,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UpdatePrivateWalletDto>({
    tags: [],
    notes: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when wallet changes
  useEffect(() => {
    if (wallet) {
      setFormData({
        tags: [...wallet.tags],
        notes: wallet.notes,
      });
    }
  }, [wallet]);

  const updateWalletMutation = useMutation({
    mutationFn: (data: UpdatePrivateWalletDto) =>
      AdminWalletApi.updatePrivateWallet(wallet.publicKey, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.detail(wallet.publicKey),
      });
      setErrors({});
      onClose();
    },
    onError: (error: unknown) => {
      console.error("Failed to update wallet:", error);
      setErrors({
        general:
          (error as Error & { response?: { data?: { message?: string } } })
            ?.response?.data?.message ||
          "Failed to update wallet. Please try again.",
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.notes?.trim()) {
      newErrors.notes = "Notes are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateWalletMutation.mutate(formData);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl">
            <span className="text-primary">✏️</span>
            Edit Wallet
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={updateWalletMutation.isPending}
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-base-200 rounded-lg">
          <p className="text-sm text-base-content/70 mb-1">Wallet Address:</p>
          <p className="font-mono font-semibold">
            {formatAddress(wallet.publicKey)}
          </p>
        </div>

        {errors.general && (
          <div className="alert alert-error mb-4">
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
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tags */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Tags</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a tag (e.g., development, testing)"
                className="input input-bordered flex-1"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className="btn btn-outline btn-primary"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Add
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="badge badge-primary gap-2">
                    {tag}
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Notes *</span>
            </label>
            <textarea
              placeholder="Describe the purpose of this wallet..."
              className={`textarea textarea-bordered h-24 ${
                errors.notes ? "textarea-error" : ""
              }`}
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
            {errors.notes && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.notes}
                </span>
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={updateWalletMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateWalletMutation.isPending}
            >
              {updateWalletMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                "Update Wallet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
