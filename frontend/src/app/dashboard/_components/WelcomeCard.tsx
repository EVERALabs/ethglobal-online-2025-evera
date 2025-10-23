import React from "react";
import { type User } from "../../../context/AuthContext";
import { ROLES } from "../../../const/roles";

interface WelcomeCardProps {
  user: User;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ user }) => {
  const getWelcomeMessage = () => {
    const timeOfDay = new Date().getHours();
    let greeting = "Hello";

    if (timeOfDay < 12) greeting = "Good morning";
    else if (timeOfDay < 18) greeting = "Good afternoon";
    else greeting = "Good evening";

    return `${greeting}, ${user.name || "there"}!`;
  };

  const getRoleMessage = () => {
    switch (user.role) {
      case ROLES.ADMIN:
        return "You have full administrative access to the system.";
      case ROLES.USER:
        return "Welcome to your personal dashboard.";
      case ROLES.PUBLIC:
        return "You have limited access. Consider upgrading your account.";
      default:
        return "Welcome to the dashboard.";
    }
  };

  return (
    <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl">{getWelcomeMessage()}</h2>
        <p className="text-lg opacity-90">{getRoleMessage()}</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline badge-lg">
            {user.role.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
