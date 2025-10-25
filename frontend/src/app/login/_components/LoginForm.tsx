import React from "react";

interface LoginFormProps {
  onConnect: (role?: string) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onConnect,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      {/* Quick Connect */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
      </div>

      <button
        onClick={() => onConnect()}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connecting...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🌈</span>
            Connect with Rainbow Wallet
          </span>
        )}
      </button>

      {/* Rainbow Wallet Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <div className="flex gap-3">
          <div className="text-purple-600 text-xl">🌈</div>
          <div className="text-xs text-purple-700">
            <div className="font-semibold mb-1">Rainbow Wallet Required</div>
            <div>Make sure you have Rainbow Wallet installed and set up</div>
          </div>
        </div>
      </div>
    </div>
  );
};
