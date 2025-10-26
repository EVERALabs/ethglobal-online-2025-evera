import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ROLES } from "./const/roles";
import HomePage from "./app/home";
import DashboardPage from "./app/dashboard";
import ProfilePage from "./app/profile";
import UnauthorizedPage from "./app/unauthorized";
import DepositPage from "./app/deposit";
import RebalancePage from "./app/rebalance";
import AnalyticsPage from "./app/analytics";
import SettingsPage from "./app/settings";
import VaultDetailPage from "./app/vault-detail";
import AboutPage from "./app/about";

const router = createBrowserRouter([
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/",
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.USER]}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute
            requiredRoles={[ROLES.ADMIN, ROLES.USER, ROLES.PUBLIC]}
          >
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "deposit",
        element: (
          <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.USER]}>
            <DepositPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "rebalance",
        element: (
          <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.USER]}>
            <RebalancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.USER]}>
            <AnalyticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
              <p className="text-lg opacity-70">Admin-only content goes here</p>
              <div className="badge badge-error badge-lg mt-4">
                Admin Access Required
              </div>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.USER]}>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "vault/:vaultId",
        element: (
          <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.USER]}>
            <VaultDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Contact</h1>
            <p className="text-lg opacity-70">Get in touch with us</p>
            <div className="badge badge-secondary badge-lg mt-4">
              Public Access
            </div>
          </div>
        ),
      },
    ],
  },
]);

export default router;
