import React from 'react';

interface Role {
  name: string;
  address: string;
  type: 'multisig' | 'eoa' | 'contract';
  threshold?: number;
  signers?: string[];
  description: string;
  status: 'active' | 'pending' | 'inactive';
}

const ROLES_DATA: Role[] = [
  {
    name: 'Protocol Operator',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    type: 'multisig',
    threshold: 3,
    signers: [
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      '0x8ba1f109551bD432803012645Hac136c',
      '0x1234567890123456789012345678901234567890',
      '0x9876543210987654321098765432109876543210',
      '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
    ],
    description: 'Controls rebalancing operations and emergency functions',
    status: 'active',
  },
  {
    name: 'Treasury Manager',
    address: '0x8ba1f109551bD432803012645Hac136c',
    type: 'multisig',
    threshold: 2,
    signers: [
      '0x8ba1f109551bD432803012645Hac136c',
      '0x1234567890123456789012345678901234567890',
      '0x9876543210987654321098765432109876543210',
    ],
    description: 'Manages protocol treasury and fee collection',
    status: 'active',
  },
  {
    name: 'Emergency Pause',
    address: '0x1234567890123456789012345678901234567890',
    type: 'eoa',
    description: 'Emergency pause functionality for protocol safety',
    status: 'active',
  },
  {
    name: 'Fee Collector',
    address: '0x9876543210987654321098765432109876543210',
    type: 'contract',
    description: 'Automated fee collection and distribution contract',
    status: 'active',
  },
];

export const RolesSection: React.FC = () => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRoleTypeBadge = (type: string) => {
    switch (type) {
      case 'multisig':
        return <span className="badge badge-primary badge-sm">Multisig</span>;
      case 'eoa':
        return <span className="badge badge-secondary badge-sm">EOA</span>;
      case 'contract':
        return <span className="badge badge-accent badge-sm">Contract</span>;
      default:
        return <span className="badge badge-neutral badge-sm">Unknown</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success badge-sm">Active</span>;
      case 'pending':
        return <span className="badge badge-warning badge-sm">Pending</span>;
      case 'inactive':
        return <span className="badge badge-error badge-sm">Inactive</span>;
      default:
        return <span className="badge badge-neutral badge-sm">Unknown</span>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification here
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">Protocol Roles</h2>
            <p className="text-sm opacity-70">View operator addresses and multisig configurations</p>
          </div>
        </div>
        <div className="badge badge-info badge-lg">
          {ROLES_DATA.length} Roles
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {ROLES_DATA.map((role, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-base-300 bg-base-50 hover:bg-base-100 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-base-content">{role.name}</h3>
                  {getRoleTypeBadge(role.type)}
                  {getStatusBadge(role.status)}
                </div>
                
                <p className="text-sm opacity-70 mb-3">{role.description}</p>

                {/* Address */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-mono bg-base-200 px-2 py-1 rounded">
                    {formatAddress(role.address)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(role.address)}
                    className="btn btn-ghost btn-xs"
                    title="Copy address"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => window.open(`https://etherscan.io/address/${role.address}`, '_blank')}
                    className="btn btn-ghost btn-xs"
                    title="View on Etherscan"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>

                {/* Multisig Details */}
                {role.type === 'multisig' && role.threshold && role.signers && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Multisig Configuration</span>
                      <span className="badge badge-primary badge-sm">
                        {role.threshold}/{role.signers.length} Required
                      </span>
                    </div>
                    <div className="space-y-1">
                      {role.signers.map((signer, signerIndex) => (
                        <div key={signerIndex} className="flex items-center space-x-2 text-xs">
                          <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                            {signerIndex + 1}
                          </span>
                          <span className="font-mono bg-base-200 px-2 py-1 rounded">
                            {formatAddress(signer)}
                          </span>
                          <button
                            onClick={() => copyToClipboard(signer)}
                            className="btn btn-ghost btn-xs opacity-50 hover:opacity-100"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Governance Info */}
      <div className="mt-6 p-4 bg-base-200 rounded-lg">
        <h3 className="font-semibold mb-2 text-sm opacity-70">Governance Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="opacity-70">Governance Token:</span>
            <span className="font-mono">PURE-L</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Voting Period:</span>
            <span>7 days</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Execution Delay:</span>
            <span>24 hours</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Quorum:</span>
            <span>10% of supply</span>
          </div>
        </div>
      </div>
    </div>
  );
};
