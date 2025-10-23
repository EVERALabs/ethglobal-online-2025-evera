# 🚀 Evera Web3 Frontend Baseline

A comprehensive React + TypeScript starter template for Web3 applications, designed to be forked and customized for new projects.

## ✨ Features

- **🔐 Multi-Provider Authentication**: Support for Privy, Rainbow Wallet, and Xellar
- **👥 Role-Based Access Control**: Admin, User, and Public roles with route protection
- **⚡ Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS, DaisyUI
- **📡 Data Fetching**: Pre-configured Axios and React Query
- **💾 Session Management**: Local storage for persistent user sessions
- **🎨 Beautiful UI**: Responsive design with DaisyUI components
- **🔧 Developer Experience**: ESLint, TypeScript strict mode, hot reload

## 📁 Project Structure

```
src/
├── app/                    # Page components organized by route
│   ├── dashboard/
│   │   ├── index.tsx      # Main dashboard page
│   │   └── _components/   # Dashboard-specific components
│   ├── home/
│   ├── login/
│   ├── profile/
│   └── unauthorized/
├── components/            # Global reusable components
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── context/              # React Context providers
│   ├── AuthContext.tsx
│   └── Web3Context.tsx
├── const/               # Constants and configuration
│   ├── auth.ts
│   └── roles.ts
├── lib/                 # Utilities and external service configs
│   ├── axios.ts
│   ├── queryClient.ts
│   └── utils.ts
└── assets/             # Static assets
router.tsx              # Application routing configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn

### Installation

1. **Clone or fork this repository**

   ```bash
   git clone <your-repo-url>
   cd evera-frontend-base
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` and configure your preferred authentication provider:

   ```env
   VITE_AUTH_PROVIDER=privy  # or 'rainbow' or 'xellar'
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Authentication Setup

### Privy Setup

1. Create an account at [Privy](https://privy.io)
2. Get your App ID from the dashboard
3. Add to `.env`:
   ```env
   VITE_AUTH_PROVIDER=privy
   VITE_PRIVY_APP_ID=your_app_id_here
   ```

### Rainbow Wallet Setup

1. Create a project at [WalletConnect](https://walletconnect.com)
2. Get your Project ID
3. Add to `.env`:
   ```env
   VITE_AUTH_PROVIDER=rainbow
   VITE_RAINBOW_PROJECT_ID=your_project_id_here
   ```

### Xellar Setup

1. Get API credentials from Xellar
2. Add to `.env`:
   ```env
   VITE_AUTH_PROVIDER=xellar
   VITE_XELLAR_API_KEY=your_api_key_here
   ```

## 👥 Role System

The application includes three built-in roles:

- **Admin**: Full system access
- **User**: Standard user permissions
- **Public**: Limited access

### Role-Based Routing Example

```tsx
// Admin-only route
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>

// User and Admin route
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.USER]}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 📡 API Integration

### Axios Configuration

The project includes a pre-configured Axios instance with:

- Automatic token injection
- Response interceptors for error handling
- Base URL configuration

```tsx
// Example API call
import axiosInstance from "../lib/axios";

const fetchUserData = async () => {
  const response = await axiosInstance.get("/user/profile");
  return response.data;
};
```

### React Query Integration

```tsx
import { useQuery } from "@tanstack/react-query";

const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: fetchUserData,
  });
};
```

## 🎨 Styling

The project uses:

- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library built on Tailwind
- **Responsive Design**: Mobile-first approach

### Theme Customization

Themes can be changed in the UI or by modifying `tailwind.config.js`:

```js
module.exports = {
  daisyui: {
    themes: ["light", "dark", "cupcake", "bumblebee" /* ... */],
  },
};
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add `index.tsx` and `_components/` folder
3. Register the route in `router.tsx`

Example:

```tsx
// src/app/settings/index.tsx
const SettingsPage = () => {
  return <div>Settings Page</div>;
};

export default SettingsPage;
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

```env
VITE_AUTH_PROVIDER=your_provider
VITE_API_BASE_URL=https://your-api.com/api
VITE_PRIVY_APP_ID=your_production_app_id
# ... other provider-specific variables
```

## 🐳 Docker Support

The project includes Docker configuration:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t evera-frontend .
docker run -p 3000:80 evera-frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the [Issues](https://github.com/your-repo/issues) page
- Read the documentation
- Join our community discussions

---

**Happy coding! 🎉**

Built with ❤️ for the Web3 community.
