import React, { useState } from "react";
import { type User } from "../../../context/AuthContext";

interface ProfileFormProps {
  user: User;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-20 rounded-full">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${
                  formData.name || user.address
                }&background=random`
              }
              alt="Profile"
            />
          </div>
        </div>
        <div>
          <button type="button" className="btn btn-outline btn-sm">
            Change Avatar
          </button>
          <p className="text-xs opacity-70 mt-1">
            Upload a new profile picture
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Role</span>
          </label>
          <input
            type="text"
            value={user.role}
            className="input input-bordered"
            disabled
          />
          <label className="label">
            <span className="label-text-alt">Role cannot be changed</span>
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">User ID</span>
          </label>
          <input
            type="text"
            value={user.id}
            className="input input-bordered font-mono text-sm"
            disabled
          />
          <label className="label">
            <span className="label-text-alt">Unique identifier</span>
          </label>
        </div>
      </div>

      {/* Wallet Address (Read-only) */}
      {user.address && (
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Wallet Address</span>
          </label>
          <input
            type="text"
            value={user.address}
            className="input input-bordered font-mono text-sm"
            disabled
          />
          <label className="label">
            <span className="label-text-alt">Connected wallet address</span>
          </label>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-primary ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {!isLoading && "Save Changes"}
        </button>
      </div>
    </form>
  );
};
