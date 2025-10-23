import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useWeb3 } from "../../hooks/useWeb3";
import { copyToClipboard } from "../../lib/utils";
import { ProfileForm } from "./_components/ProfileForm";
import { WalletInfo } from "./_components/WalletInfo";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { provider, isConnected } = useWeb3();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="opacity-70">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = async (formData: any) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateUser({
        name: formData.name,
        email: formData.email,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyAddress = async () => {
    if (user.address) {
      const success = await copyToClipboard(user.address);
      if (success) {
        // Show toast notification
        console.log("Address copied to clipboard");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-lg opacity-70">Manage your account information</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-6">Personal Information</h2>

              {isEditing ? (
                <ProfileForm
                  user={user}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(false)}
                  isLoading={isSaving}
                />
              ) : (
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-20 rounded-full">
                        <img
                          src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${
                              user.name || user.address
                            }&background=random`
                          }
                          alt="Profile"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {user.name || "Unnamed User"}
                      </h3>
                      <div className="badge badge-primary">{user.role}</div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Name</span>
                      </label>
                      <div className="p-3 bg-base-200 rounded-lg">
                        {user.name || "Not set"}
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Email</span>
                      </label>
                      <div className="p-3 bg-base-200 rounded-lg">
                        {user.email || "Not set"}
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Role</span>
                      </label>
                      <div className="p-3 bg-base-200 rounded-lg">
                        <div className="badge badge-primary">{user.role}</div>
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">
                          User ID
                        </span>
                      </label>
                      <div className="p-3 bg-base-200 rounded-lg font-mono text-sm">
                        {user.id}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WalletInfo
            user={user}
            provider={provider}
            isConnected={isConnected}
            onCopyAddress={handleCopyAddress}
          />

          {/* Account Stats */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Account Stats</h3>
              <div className="stats stats-vertical">
                <div className="stat">
                  <div className="stat-title">Member Since</div>
                  <div className="stat-value text-sm">Today</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Last Login</div>
                  <div className="stat-value text-sm">Now</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Sessions</div>
                  <div className="stat-value text-primary">1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Security</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Two-Factor Auth</span>
                  <div className="badge badge-error">Disabled</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Verification</span>
                  <div className="badge badge-warning">Pending</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Wallet Connected</span>
                  <div
                    className={`badge ${
                      isConnected ? "badge-success" : "badge-error"
                    }`}
                  >
                    {isConnected ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
