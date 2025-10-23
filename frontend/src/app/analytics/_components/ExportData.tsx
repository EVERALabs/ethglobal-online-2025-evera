import React, { useState } from 'react';

interface ExportDataProps {
  timeframe: '24h' | '7d' | '30d';
  selectedChains: string[];
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'csv',
    name: 'CSV',
    description: 'Download as CSV file',
    icon: '📊',
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Download as JSON file',
    icon: '📄',
  },
  {
    id: 'api',
    name: 'API',
    description: 'View API endpoint',
    icon: '🔗',
  },
];

const generateCSVData = (timeframe: '24h' | '7d' | '30d', chains: string[]): string => {
  const headers = ['Timestamp', 'Chain', 'TVL', 'Volume', 'Rebalances', 'APY'];
  const rows = [headers.join(',')];
  
  const dataPoints = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date();
    date.setHours(date.getHours() - (dataPoints - i) * (timeframe === '24h' ? 1 : 24));
    
    chains.forEach(chain => {
      const tvl = Math.floor(Math.random() * 50000) + 10000;
      const volume = Math.floor(Math.random() * 10000) + 1000;
      const rebalances = Math.floor(Math.random() * 50) + 10;
      const apy = (Math.random() * 10 + 5).toFixed(2);
      
      rows.push([
        date.toISOString(),
        chain,
        tvl.toString(),
        volume.toString(),
        rebalances.toString(),
        apy
      ].join(','));
    });
  }
  
  return rows.join('\n');
};

const generateJSONData = (timeframe: '24h' | '7d' | '30d', chains: string[]): object => {
  const dataPoints = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
  const data: any[] = [];
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date();
    date.setHours(date.getHours() - (dataPoints - i) * (timeframe === '24h' ? 1 : 24));
    
    chains.forEach(chain => {
      data.push({
        timestamp: date.toISOString(),
        chain,
        tvl: Math.floor(Math.random() * 50000) + 10000,
        volume: Math.floor(Math.random() * 10000) + 1000,
        rebalances: Math.floor(Math.random() * 50) + 10,
        apy: parseFloat((Math.random() * 10 + 5).toFixed(2))
      });
    });
  }
  
  return {
    timeframe,
    chains,
    data,
    exported_at: new Date().toISOString(),
    total_records: data.length
  };
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const ExportData: React.FC<ExportDataProps> = ({ timeframe, selectedChains }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showApiEndpoint, setShowApiEndpoint] = useState(false);

  const handleExport = async (format: string) => {
    if (selectedChains.length === 0) {
      alert('Please select at least one chain to export data.');
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const timestamp = new Date().toISOString().split('T')[0];
      const chainSuffix = selectedChains.length === 1 ? selectedChains[0] : 'multi-chain';
      
      if (format === 'csv') {
        const csvData = generateCSVData(timeframe, selectedChains);
        downloadFile(csvData, `analytics-${timeframe}-${chainSuffix}-${timestamp}.csv`, 'text/csv');
      } else if (format === 'json') {
        const jsonData = generateJSONData(timeframe, selectedChains);
        downloadFile(JSON.stringify(jsonData, null, 2), `analytics-${timeframe}-${chainSuffix}-${timestamp}.json`, 'application/json');
      } else if (format === 'api') {
        setShowApiEndpoint(true);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const apiEndpoint = `https://api.evera.xyz/v1/analytics?timeframe=${timeframe}&chains=${selectedChains.join(',')}&format=json`;

  return (
    <div className="card bg-white shadow-xl border border-gray-200">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Export Data</h3>
            <p className="text-sm opacity-70">Download analytics data or access API</p>
          </div>
          <div className="text-sm opacity-70">
            {selectedChains.length} chain{selectedChains.length !== 1 ? 's' : ''} • {timeframe}
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format.id}
              onClick={() => handleExport(format.id)}
              disabled={isExporting || selectedChains.length === 0}
              className="btn btn-outline flex items-center gap-3 p-4 h-auto border border-gray-200"
            >
              <div className="text-2xl">{format.icon}</div>
              <div className="text-left">
                <div className="font-semibold">{format.name}</div>
                <div className="text-sm opacity-70">{format.description}</div>
              </div>
              {isExporting && (
                <div className="ml-auto">
                  <div className="loading loading-spinner loading-sm"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* API Endpoint Display */}
        {showApiEndpoint && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">API Endpoint</h4>
              <button
                onClick={() => setShowApiEndpoint(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="bg-base-300 rounded p-3 mb-3">
              <code className="text-sm text-success break-all">{apiEndpoint}</code>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(apiEndpoint)}
                className="btn btn-sm btn-primary"
              >
                Copy URL
              </button>
              <button
                onClick={() => window.open(apiEndpoint, '_blank')}
                className="btn btn-sm btn-outline"
              >
                Open in Browser
              </button>
            </div>
          </div>
        )}

        {/* Export Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold mb-1">Data Points</div>
            <div className="opacity-70">
              {timeframe === '24h' ? '24' : timeframe === '7d' ? '7' : '30'} × {selectedChains.length} chains
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold mb-1">Last Updated</div>
            <div className="opacity-70">
              {new Date().toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold mb-1">Rate Limit</div>
            <div className="opacity-70">
              100 requests/hour
            </div>
          </div>
        </div>

        {/* Warning */}
        {selectedChains.length === 0 && (
          <div className="mt-4 alert alert-warning">
            <span>⚠️</span>
            <span>Please select at least one chain to export data.</span>
          </div>
        )}
      </div>
    </div>
  );
};
