import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="text-6xl">🚫</div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-error">Access Denied</h1>
          <p className="text-lg opacity-70">
            You don't have permission to access this resource.
          </p>

          {user && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-4">
                <h3 className="font-semibold text-sm mb-2">Current User</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="opacity-70">Name:</span>
                    <span>{user.name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Role:</span>
                    <div className="badge badge-primary badge-sm">
                      {user.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>

          <div className="divider">OR</div>

          <div className="space-y-2">
            <p className="text-sm opacity-70">Need different permissions?</p>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Login with Different Account
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs opacity-50 space-y-1">
          <p>If you believe this is an error, please contact support.</p>
          <p>Error Code: 403 - Forbidden</p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
