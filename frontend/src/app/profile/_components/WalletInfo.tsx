import React from "react";
import { type User } from "../../../context/AuthContext";
import { type AuthProvider } from "../../../const/auth";
import { formatAddress } from "../../../lib/utils";

interface WalletInfoProps {
  user: User;
  provider: AuthProvider | null;
  isConnected: boolean;
  onCopyAddress: () => void;
}

export const WalletInfo: React.FC<WalletInfoProps> = ({
  user,
  provider,
  isConnected,
  onCopyAddress,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Wallet Information</h3>

        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex justify-between items-center">
            <span className="font-semibold">Status</span>
            <div
              className={`badge ${
                isConnected ? "badge-success" : "badge-error"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>

          {/* Provider */}
          {provider && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">Provider</span>
              <div className="badge badge-primary">
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </div>
            </div>
          )}

          {/* Wallet Address */}
          {user.address && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Address</span>
                <button
                  onClick={onCopyAddress}
                  className="btn btn-ghost btn-xs"
                  title="Copy address"
                >
                  📋
                </button>
              </div>
              <div className="p-3 bg-base-200 rounded-lg">
                <code className="text-xs break-all">{user.address}</code>
              </div>
              <div className="text-xs opacity-70 mt-1">
                Short: {formatAddress(user.address)}
              </div>
            </div>
          )}

          {/* Network Info */}
          <div className="divider text-xs">Network Information</div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-70">Network:</span>
              <span>Sepolia Testnet</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Chain ID:</span>
              <span>11155111</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Balance:</span>
              <span>0.00 ETH</span>
            </div>
          </div>

          {/* Actions */}
          <div className="card-actions justify-end">
            <button className="btn btn-outline btn-sm">Switch Network</button>
            <button className="btn btn-primary btn-sm">View on Explorer</button>
          </div>
        </div>
      </div>
    </div>
  );
};
