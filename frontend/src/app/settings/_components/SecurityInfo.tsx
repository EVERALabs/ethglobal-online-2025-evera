import React from 'react';

interface ContractInfo {
  name: string;
  address: string;
  type: 'core' | 'proxy' | 'factory' | 'token';
  version: string;
  verified: boolean;
  description: string;
}

interface AuditInfo {
  firm: string;
  date: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  reportUrl?: string;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const CONTRACTS_DATA: ContractInfo[] = [
  {
    name: 'PureL Core',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    type: 'core',
    version: 'v1.2.0',
    verified: true,
    description: 'Main protocol contract handling rebalancing logic',
  },
  {
    name: 'Liquidity Manager',
    address: '0x8ba1f109551bD432803012645Hac136c',
    type: 'core',
    version: 'v1.1.5',
    verified: true,
    description: 'Manages liquidity distribution across chains',
  },
  {
    name: 'Bridge Adapter',
    address: '0x1234567890123456789012345678901234567890',
    type: 'proxy',
    version: 'v1.0.3',
    verified: true,
    description: 'Proxy contract for cross-chain bridge interactions',
  },
  {
    name: 'Fee Collector',
    address: '0x9876543210987654321098765432109876543210',
    type: 'factory',
    version: 'v1.0.1',
    verified: true,
    description: 'Automated fee collection and distribution',
  },
  {
    name: 'PYUSD Token',
    address: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
    type: 'token',
    version: 'v1.0.0',
    verified: true,
    description: 'PayPal USD stablecoin contract',
  },
];

const AUDITS_DATA: AuditInfo[] = [
  {
    firm: 'Trail of Bits',
    date: '2024-01-15',
    status: 'completed',
    reportUrl: 'https://example.com/audit-report-1',
    findings: {
      critical: 0,
      high: 1,
      medium: 3,
      low: 7,
    },
  },
  {
    firm: 'OpenZeppelin',
    date: '2024-02-20',
    status: 'completed',
    reportUrl: 'https://example.com/audit-report-2',
    findings: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 5,
    },
  },
  {
    firm: 'ConsenSys Diligence',
    date: '2024-03-10',
    status: 'in-progress',
    findings: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  },
];

export const SecurityInfo: React.FC = () => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getContractTypeBadge = (type: string) => {
    switch (type) {
      case 'core':
        return <span className="badge badge-primary badge-sm">Core</span>;
      case 'proxy':
        return <span className="badge badge-secondary badge-sm">Proxy</span>;
      case 'factory':
        return <span className="badge badge-accent badge-sm">Factory</span>;
      case 'token':
        return <span className="badge badge-info badge-sm">Token</span>;
      default:
        return <span className="badge badge-neutral badge-sm">Unknown</span>;
    }
  };

  const getAuditStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success badge-sm">Completed</span>;
      case 'in-progress':
        return <span className="badge badge-warning badge-sm">In Progress</span>;
      case 'scheduled':
        return <span className="badge badge-info badge-sm">Scheduled</span>;
      default:
        return <span className="badge badge-neutral badge-sm">Unknown</span>;
    }
  };

  const getSeverityBadge = (severity: string, count: number) => {
    if (count === 0) return null;
    
    const badgeClass = {
      critical: 'badge-error',
      high: 'badge-warning',
      medium: 'badge-info',
      low: 'badge-neutral',
    }[severity] || 'badge-neutral';

    return (
      <span className={`badge ${badgeClass} badge-sm`}>
        {count} {severity}
      </span>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">Security Information</h2>
            <p className="text-sm opacity-70">Contract addresses, audits, and security links</p>
          </div>
        </div>
        <div className="badge badge-success badge-lg">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Verified
        </div>
      </div>

      {/* Contract Addresses */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Contract Addresses
        </h3>
        <div className="space-y-3">
          {CONTRACTS_DATA.map((contract, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-base-300 bg-base-50 hover:bg-base-100 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-base-content">{contract.name}</h4>
                    {getContractTypeBadge(contract.type)}
                    <span className="badge badge-outline badge-sm">{contract.version}</span>
                    {contract.verified && (
                      <span className="badge badge-success badge-sm">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-70 mb-2">{contract.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono bg-base-200 px-2 py-1 rounded">
                      {formatAddress(contract.address)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(contract.address)}
                      className="btn btn-ghost btn-xs"
                      title="Copy address"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => window.open(`https://etherscan.io/address/${contract.address}`, '_blank')}
                      className="btn btn-ghost btn-xs"
                      title="View on Etherscan"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audits */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Security Audits
        </h3>
        <div className="space-y-4">
          {AUDITS_DATA.map((audit, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-base-300 bg-base-50 hover:bg-base-100 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-base-content">{audit.firm}</h4>
                    {getAuditStatusBadge(audit.status)}
                    <span className="text-sm opacity-70">{audit.date}</span>
                  </div>
                  
                  {audit.status === 'completed' && (
                    <div className="flex items-center space-x-2 mb-2">
                      {getSeverityBadge('critical', audit.findings.critical)}
                      {getSeverityBadge('high', audit.findings.high)}
                      {getSeverityBadge('medium', audit.findings.medium)}
                      {getSeverityBadge('low', audit.findings.low)}
                    </div>
                  )}

                  {audit.reportUrl && (
                    <a
                      href={audit.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Report
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Links */}
      <div className="p-4 bg-base-200 rounded-lg">
        <h3 className="font-semibold mb-3 text-sm opacity-70">Security Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="https://example.com/security-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-2 rounded hover:bg-base-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm">Security Policy</span>
          </a>
          <a
            href="https://example.com/bug-bounty"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-2 rounded hover:bg-base-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm">Bug Bounty Program</span>
          </a>
          <a
            href="https://example.com/security-contact"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-2 rounded hover:bg-base-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Security Contact</span>
          </a>
          <a
            href="https://example.com/incident-response"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-2 rounded hover:bg-base-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Incident Response</span>
          </a>
        </div>
      </div>
    </div>
  );
};
