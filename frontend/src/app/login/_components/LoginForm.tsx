import React from 'react';
import { ROLES } from '../../../const/roles';

interface LoginFormProps {
  onConnect: (provider: string, role?: string) => void;
  selectedProvider: string;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onConnect,
  selectedProvider,
  isLoading,
}) => {
  const demoRoles = [
    {
      id: ROLES.ADMIN,
      name: 'Admin',
      description: 'Full system access',
      icon: '👑',
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverBg: 'hover:bg-red-100',
      textColor: 'text-red-700'
    },
    {
      id: ROLES.USER,
      name: 'User',
      description: 'Standard user access',
      icon: '👤',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverBg: 'hover:bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      id: ROLES.PUBLIC,
      name: 'Public',
      description: 'Limited access',
      icon: '🔒',
      gradient: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      hoverBg: 'hover:bg-gray-100',
      textColor: 'text-gray-700'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Demo Role Selection */}
      <div className="space-y-3">
        {demoRoles.map((role) => (
          <button
            key={role.id}
            onClick={() => onConnect(selectedProvider, role.id)}
            disabled={isLoading}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 ${role.borderColor} ${role.bgColor} ${role.hoverBg} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md group`}
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
              {role.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1 text-left">
              <div className={`font-semibold ${role.textColor} text-lg`}>
                {isLoading ? 'Connecting...' : `Connect as ${role.name}`}
              </div>
              <div className="text-sm text-gray-600">
                {role.description}
              </div>
            </div>

            {/* Arrow */}
            <div className={`${role.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Connect */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-500">Or quick connect</span>
        </div>
      </div>

      <button
        onClick={() => onConnect(selectedProvider)}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : (
          <>
            Connect with {selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}
          </>
        )}
      </button>

      {/* Environment Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-blue-600 shrink-0 w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-xs text-blue-700">
            <div className="font-semibold mb-1">Development Mode</div>
            <div>Set VITE_AUTH_PROVIDER in .env to configure default provider</div>
          </div>
        </div>
      </div>
    </div>
  );
};
