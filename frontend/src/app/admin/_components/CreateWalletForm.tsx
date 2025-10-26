import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AdminWalletApi,
  adminWalletQueries,
  type CreatePrivateWalletDto,
} from "../../../lib/adminApi";
import type { AxiosError } from "axios";

interface CreateWalletFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateWalletForm: React.FC<CreateWalletFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreatePrivateWalletDto>({
    publicKey: "",
    privateKey: "",
    tags: [],
    notes: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createWalletMutation = useMutation({
    mutationFn: AdminWalletApi.createPrivateWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminWalletQueries.keys.lists(),
      });
      setFormData({ publicKey: "", privateKey: "", tags: [], notes: "" });
      setTagInput("");
      setErrors({});
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to create wallet:", error);
      setErrors({
        general:
          (error as AxiosError<{ message: string }>)?.response?.data?.message ||
          "Failed to create wallet. Please try again.",
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.publicKey.trim()) {
      newErrors.publicKey = "Public key is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.publicKey)) {
      newErrors.publicKey = "Invalid Ethereum address format";
    }

    if (!formData.privateKey.trim()) {
      newErrors.privateKey = "Private key is required";
    } else if (!/^0x[a-fA-F0-9]{64}$/.test(formData.privateKey)) {
      newErrors.privateKey =
        "Invalid private key format (should be 64 hex characters with 0x prefix)";
    }

    if (!formData.notes.trim()) {
      newErrors.notes = "Notes are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createWalletMutation.mutate(formData);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">
          <span className="text-primary">🔐</span>
          Create New Private Wallet
        </h2>

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
          {/* Public Key */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Public Key (Ethereum Address) *
              </span>
            </label>
            <input
              type="text"
              placeholder="0x742d35Cc6634C0532925a3b8D7389C2F5Cf5e5e5"
              className={`input input-bordered w-full ${
                errors.publicKey ? "input-error" : ""
              }`}
              value={formData.publicKey}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, publicKey: e.target.value }))
              }
            />
            {errors.publicKey && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.publicKey}
                </span>
              </label>
            )}
          </div>

          {/* Private Key */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Private Key *</span>
            </label>
            <input
              type="password"
              placeholder="0x..."
              className={`input input-bordered w-full ${
                errors.privateKey ? "input-error" : ""
              }`}
              value={formData.privateKey}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, privateKey: e.target.value }))
              }
            />
            {errors.privateKey && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.privateKey}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-warning">
                ⚠️ Private keys are stored securely and encrypted
              </span>
            </label>
          </div>

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
            {formData.tags.length > 0 && (
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
              value={formData.notes}
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
          <div className="card-actions justify-end pt-4">
            {onCancel && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onCancel}
                disabled={createWalletMutation.isPending}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createWalletMutation.isPending}
            >
              {createWalletMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                "Create Wallet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
