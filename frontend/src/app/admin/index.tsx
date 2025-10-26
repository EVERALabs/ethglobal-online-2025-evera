import React, { useState } from "react";
import { CreateWalletForm } from "./_components/CreateWalletForm";
import { WalletList } from "./_components/WalletList";
import { WalletAccessManager } from "./_components/WalletAccessManager";
import { type ReservedWallet } from "../../lib/adminApi";

type AdminView = "overview" | "create" | "manage";

const AdminPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>("overview");
  const [selectedWallet, setSelectedWallet] = useState<ReservedWallet | null>(
    null
  );

  const handleWalletSelect = (wallet: ReservedWallet) => {
    setSelectedWallet(wallet);
    setCurrentView("manage");
  };

  const handleCreateSuccess = () => {
    setCurrentView("overview");
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedWallet(null);
  };

  const renderNavigation = () => (
    <div className="navbar bg-base-100 rounded-box shadow-sm border border-base-300 mb-6">
      <div className="navbar-start">
        <h1 className="text-2xl font-bold">
          <span className="text-primary">🔐</span>
          Admin Panel
        </h1>
      </div>
      <div className="navbar-end">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${currentView === "overview" ? "tab-active" : ""}`}
            onClick={handleBackToOverview}
          >
            📋 Overview
          </button>
          <button
            className={`tab ${currentView === "create" ? "tab-active" : ""}`}
            onClick={() => setCurrentView("create")}
          >
            ➕ Create Wallet
          </button>
          {selectedWallet && (
            <button
              className={`tab ${currentView === "manage" ? "tab-active" : ""}`}
              onClick={() => setCurrentView("manage")}
            >
              ⚙️ Manage Access
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderBreadcrumb = () => {
    if (currentView === "overview") return null;

    return (
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li>
            <button className="link link-hover" onClick={handleBackToOverview}>
              🏠 Admin Panel
            </button>
          </li>
          {currentView === "create" && <li>Create Wallet</li>}
          {currentView === "manage" && selectedWallet && (
            <li>Manage Access - {selectedWallet.publicKey.slice(0, 10)}...</li>
          )}
        </ul>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case "create":
        return (
          <CreateWalletForm
            onSuccess={handleCreateSuccess}
            onCancel={handleBackToOverview}
          />
        );

      case "manage":
        return selectedWallet ? (
          <WalletAccessManager
            wallet={selectedWallet}
            onClose={handleBackToOverview}
          />
        ) : (
          <div className="alert alert-error">
            <span>No wallet selected for management.</span>
          </div>
        );

      case "overview":
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-3xl mb-2">
                  Welcome to Admin Panel
                </h2>
                <p className="text-lg opacity-90 mb-4">
                  Manage private wallets and control user access with
                  enterprise-grade security.
                </p>
                <div className="card-actions">
                  <button
                    className="btn btn-accent"
                    onClick={() => setCurrentView("create")}
                  >
                    🚀 Create Your First Wallet
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat bg-base-100 rounded-box shadow border border-base-300">
                <div className="stat-figure text-primary">
                  <span className="text-3xl">💼</span>
                </div>
                <div className="stat-title">Total Wallets</div>
                <div className="stat-value text-primary">-</div>
                <div className="stat-desc">Managed by you</div>
              </div>

              <div className="stat bg-base-100 rounded-box shadow border border-base-300">
                <div className="stat-figure text-secondary">
                  <span className="text-3xl">👥</span>
                </div>
                <div className="stat-title">Active Users</div>
                <div className="stat-value text-secondary">-</div>
                <div className="stat-desc">With wallet access</div>
              </div>

              <div className="stat bg-base-100 rounded-box shadow border border-base-300">
                <div className="stat-figure text-accent">
                  <span className="text-3xl">🔐</span>
                </div>
                <div className="stat-title">Security Level</div>
                <div className="stat-value text-accent">High</div>
                <div className="stat-desc">Enterprise grade</div>
              </div>
            </div>

            {/* Wallet List */}
            <WalletList
              onSelectWallet={handleWalletSelect}
              selectedWalletId={selectedWallet?.publicKey}
            />

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <span className="text-primary">⚡</span>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    className="btn btn-outline btn-primary justify-start"
                    onClick={() => setCurrentView("create")}
                  >
                    <span className="text-xl mr-2">➕</span>
                    Create New Wallet
                  </button>
                  <button
                    className="btn btn-outline btn-secondary justify-start"
                    onClick={() => {
                      // In a real app, this would open a user management interface
                      alert("User management feature coming soon!");
                    }}
                  >
                    <span className="text-xl mr-2">👥</span>
                    Manage Users
                  </button>
                  <button
                    className="btn btn-outline btn-accent justify-start"
                    onClick={() => {
                      // In a real app, this would show audit logs
                      alert("Audit logs feature coming soon!");
                    }}
                  >
                    <span className="text-xl mr-2">📊</span>
                    View Audit Logs
                  </button>
                  <button
                    className="btn btn-outline btn-info justify-start"
                    onClick={() => {
                      // In a real app, this would show security settings
                      alert("Security settings feature coming soon!");
                    }}
                  >
                    <span className="text-xl mr-2">🛡️</span>
                    Security Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {renderNavigation()}
      {renderBreadcrumb()}
      {renderContent()}
    </div>
  );
};

export default AdminPage;
