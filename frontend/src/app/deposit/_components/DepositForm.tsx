import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { formatUnits, parseUnits, type Address, maxUint256 } from 'viem';
import { ERC20ABI } from '../../../lib/contracts/abi/ERC20';
import { usePositionContract } from '../../../hooks/usePosition';

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  enabled: boolean;
  address: Address;
  decimals: number;
}

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

const TOKENS: Token[] = [
  {
    symbol: 'PYUSD',
    name: 'PayPal USD',
    icon: '💰',
    balance: '0.00',
    enabled: true,
    address: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9' as Address,
    decimals: 6
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💵',
    balance: '0.00',
    enabled: false,
    address: '0x0000000000000000000000000000000000000000' as Address,
    decimals: 6
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '💸',
    balance: '0.00',
    enabled: false,
    address: '0x0000000000000000000000000000000000000000' as Address,
    decimals: 6
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    icon: '🪙',
    balance: '0.00',
    enabled: false,
    address: '0x0000000000000000000000000000000000000000' as Address,
    decimals: 18
  },
];

// const CHAINS = [
//   { id: 'auto', name: 'Auto (Best Yield)', icon: '🎯', description: 'Automatically select optimal chain' },
//   { id: 'base', name: 'Base', icon: '🔵', description: 'Coinbase L2 - High volume' },
//   { id: 'arbitrum', name: 'Arbitrum', icon: '🔴', description: 'Ethereum L2 - Low fees' },
//   { id: 'polygon', name: 'Polygon', icon: '🟣', description: 'Ethereum L2 - Fast transactions' },
//   { id: 'ethereum', name: 'Ethereum', icon: '⚫', description: 'Mainnet - Highest security' },
// ];

export const DepositForm: React.FC<DepositFormProps> = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(TOKENS.find(token => token.enabled) || TOKENS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);

  const { address, chainId, isConnected } = useAccount();
  const { contractAddress } = usePositionContract();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();


  const {
    writeContractAsync: writeContractERC20Async,
    data: approvalHash
  } = useWriteContract();

  const { data: approvalReceipt, isLoading: isApprovalConfirming } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  // Read token balance
  const { data: tokenBalance } = useReadContract({
    address: selectedToken.address,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && selectedToken.enabled,
    },
  });

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: selectedToken.address,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: address && contractAddress ? [address, contractAddress] : undefined,
    query: {
      enabled: !!address && !!contractAddress && selectedToken.enabled,
    },
  });

  // Update token balance display
  useEffect(() => {
    if (tokenBalance !== undefined) {
      const balanceFormatted = formatUnits(tokenBalance, selectedToken.decimals);
      setSelectedToken(prev => ({
        ...prev,
        balance: parseFloat(balanceFormatted).toFixed(2)
      }));
    }
  }, [tokenBalance, selectedToken.decimals]);

  // Auto-switch to Sepolia if on wrong network
  useEffect(() => {
    if (isConnected && chainId && chainId !== 11155111) {
      switchChain({ chainId: 11155111 });
    }
  }, [isConnected, chainId, switchChain]);

  // Check if approval is needed
  useEffect(() => {
    if (amount && allowance !== undefined && contractAddress) {
      const amountInWei = parseUnits(amount, selectedToken.decimals);
      // Check if allowance is close to max uint256 (indicating it was approved with max amount)
      const isMaxApproval = allowance >= maxUint256 - BigInt(1000);
      const needsApprovalCheck = !isMaxApproval && allowance < amountInWei;

      setNeedsApproval(needsApprovalCheck);
    }
  }, [amount, allowance, selectedToken.decimals, contractAddress]);

  const handleApprove = useCallback(async () => {
    if (!contractAddress || !selectedToken.enabled) {
      return;
    }

    try {
      await writeContractERC20Async({
        address: selectedToken.address,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [contractAddress, maxUint256], // Max uint256
      });
    } catch (error) {
      console.error('Approval failed:', error);
      throw error; // Re-throw to handle in the calling function
    }
  }, [contractAddress, selectedToken.enabled, selectedToken.address, writeContractERC20Async]);

  // Handle approval completion
  useEffect(() => {
    if (approvalReceipt && !isApprovalConfirming) {
      // Refetch allowance first, then update state
      refetchAllowance().then(() => {
        // Wait a bit for the blockchain state to update
        setTimeout(() => {
          setNeedsApproval(false);
        }, 500);
      });
    }
  }, [approvalReceipt, isApprovalConfirming, refetchAllowance]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!isConnected) {
      alert('Please connect your wallet');
      return;
    }

    if (chainId !== 11155111) {
      switchChain({ chainId: 11155111 });
      return;
    }

    if (!contractAddress) {
      alert('Contract not configured. Please check environment variables.');
      return;
    }

    // Check if user has enough balance
    if (tokenBalance && parseFloat(amount) > parseFloat(formatUnits(tokenBalance, selectedToken.decimals))) {
      alert('Insufficient balance');
      return;
    }

    if (needsApproval) {
      try {
        await handleApprove();
      } catch (error) {
        console.error('Approval failed:', error);
        alert('Approval failed. Please try again.');
        return;
      }
      return; // Exit early, deposit will be triggered after approval
    }

    setIsSubmitting(true);

    try {
      // Call the onSubmit callback with deposit data to show confirm modal
      onSubmit({
        amount,
        token: selectedToken.symbol,
        chain: 'sepolia',
        projectedAllocation: { sepolia: 100 },
        gasEstimate: 0.001,
        bridgePath: ['sepolia'],
      });

    } catch (error) {
      console.error('Failed to show confirm modal:', error);
      alert('Failed to show confirmation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [amount, address, chainId, isConnected, contractAddress, tokenBalance, selectedToken.decimals, needsApproval, onSubmit, handleApprove, selectedToken.symbol, switchChain]);

  // Auto-trigger modal after successful approval
  useEffect(() => {
    if (approvalReceipt && !isApprovalConfirming && !needsApproval && !isSubmitting && amount) {
      // Add a small delay to ensure all state updates are complete
      setTimeout(() => {
        const event = new Event('submit') as unknown as React.FormEvent<HTMLFormElement>;
        handleSubmit(event);
      }, 100);
    }
  }, [approvalReceipt, isApprovalConfirming, needsApproval, isSubmitting, amount, handleSubmit]);

  const handleMaxAmount = () => {
    setAmount(selectedToken.balance);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
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
              className="input input-bordered w-full pr-20 text-lg bg-white"
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
                onClick={() => token.enabled && setSelectedToken(token)}
                disabled={!token.enabled}
                className={`p-4 rounded-xl border-2 transition-all ${!token.enabled
                  ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                  : selectedToken.symbol === token.symbol
                    ? 'border-primary bg-primary/10'
                    : 'border-base-300 hover:border-primary/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{token.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-sm opacity-70">{token.name}</div>
                    {!token.enabled && (
                      <div className="text-xs text-gray-500 mt-1">Coming Soon</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chain Selector */}
        <div className="form-control">
          {/* <label className="label">
            <span className="label-text font-semibold">Target Chain</span>
          </label> */}
          {/* <div className="space-y-3">
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
          </div> */}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0 || isSubmitting || isSwitchingChain || chainId !== 11155111}
          className="btn btn-primary btn-lg w-full"
        >
          {isSwitchingChain ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Switching to Sepolia...
            </>
          ) : isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Depositing...
            </>
          ) : chainId !== 11155111 ? (
            'Switching Network...'
          ) : needsApproval ? (
            'Approve & Deposit'
          ) : (
            'Deposit'
          )}
        </button>
      </form>
    </div>
  );
};
