import React, { useState } from 'react';

interface DepositFormProps {
  onSubmit: (data: {
    amount: string;
    token: string;
    chain: string;
    projectedAllocation: { [chain: string]: number };
    gasEstimate: number;
    bridgePath: string[];
  }) => void;
}

const TOKENS = [
  { symbol: 'PYUSD', name: 'PayPal USD', icon: '💰', balance: '1,250.00' },
  { symbol: 'USDC', name: 'USD Coin', icon: '💵', balance: '2,100.50' },
  { symbol: 'USDT', name: 'Tether USD', icon: '💸', balance: '850.25' },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🪙', balance: '500.00' },
];

const CHAINS = [
  { id: 'auto', name: 'Auto (Best Yield)', icon: '🎯', description: 'Automatically select optimal chain' },
  { id: 'base', name: 'Base', icon: '🔵', description: 'Coinbase L2 - High volume' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔴', description: 'Ethereum L2 - Low fees' },
  { id: 'polygon', name: 'Polygon', icon: '🟣', description: 'Ethereum L2 - Fast transactions' },
  { id: 'ethereum', name: 'Ethereum', icon: '⚫', description: 'Mainnet - Highest security' },
];

export const DepositForm: React.FC<DepositFormProps> = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to get optimal allocation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data for demonstration
    const projectedAllocation = selectedChain.id === 'auto' 
      ? { base: 40, arbitrum: 35, polygon: 25 }
      : { [selectedChain.id]: 100 };

    const gasEstimate = selectedChain.id === 'ethereum' ? 0.05 : 0.01;
    const bridgePath = selectedChain.id === 'auto' 
      ? ['ethereum', 'base', 'arbitrum', 'polygon']
      : ['ethereum', selectedChain.id];

    onSubmit({
      amount,
      token: selectedToken.symbol,
      chain: selectedChain.id,
      projectedAllocation,
      gasEstimate,
      bridgePath,
    });

    setIsSubmitting(false);
  };

  const handleMaxAmount = () => {
    setAmount(selectedToken.balance);
  };

  return (
    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-base-300/50">
      <h2 className="text-2xl font-bold mb-6">Deposit Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Amount</span>
            <span className="label-text-alt">
              Balance: {selectedToken.balance} {selectedToken.symbol}
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input input-bordered w-full pr-20 text-lg"
              required
            />
            <button
              type="button"
              onClick={handleMaxAmount}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-sm btn-outline"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Token Selector */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Token</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TOKENS.map((token) => (
              <button
                key={token.symbol}
                type="button"
                onClick={() => setSelectedToken(token)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedToken.symbol === token.symbol
                    ? 'border-primary bg-primary/10'
                    : 'border-base-300 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{token.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-sm opacity-70">{token.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chain Selector */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Target Chain</span>
          </label>
          <div className="space-y-3">
            {CHAINS.map((chain) => (
              <button
                key={chain.id}
                type="button"
                onClick={() => setSelectedChain(chain)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedChain.id === chain.id
                    ? 'border-primary bg-primary/10'
                    : 'border-base-300 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{chain.icon}</span>
                  <div>
                    <div className="font-semibold">{chain.name}</div>
                    <div className="text-sm opacity-70">{chain.description}</div>
                  </div>
                  {chain.id === 'auto' && (
                    <div className="ml-auto">
                      <div className="badge badge-success">Recommended</div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0 || isSubmitting}
          className="btn btn-primary btn-lg w-full"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Calculating...
            </>
          ) : (
            'Preview Deposit'
          )}
        </button>
      </form>
    </div>
  );
};
