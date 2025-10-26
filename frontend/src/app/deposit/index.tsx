import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../hooks/useWeb3';
import { usePositionContract } from '../../hooks/usePosition';
import { DepositForm } from './_components/DepositForm';
import { BestChainSuggestion } from './_components/BestChainSuggestion';
import { SimulationPreview } from './_components/SimulationPreview';
import { ConfirmModal } from './_components/ConfirmModal';
import { SuccessState } from './_components/SuccessState';

interface DepositData {
  amount: string;
  token: string;
  chain: string;
  projectedAllocation: {
    [chain: string]: number;
  };
  gasEstimate: number;
  bridgePath: string[];
}

const DepositPage: React.FC = () => {
  const { user } = useAuth();
  const { isConnected } = useWeb3();
  const { createPosition, hash, isConfirmed, receipt, isPending, isConfirming } = usePositionContract();
  const [depositData, setDepositData] = useState<DepositData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDepositSubmit = (data: DepositData) => {
    setDepositData(data);
    setShowConfirmModal(true);
  };


  // Update processing state based on transaction status
  useEffect(() => {
    if (isPending || isConfirming) {
      setIsProcessing(true);
    } else if (isConfirmed || (!isPending && !isConfirming && !hash)) {
      setIsProcessing(false);
    }
  }, [isPending, isConfirming, isConfirmed, hash]);

  const handleViewDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Show success state when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && hash && !showSuccess) {
      setShowConfirmModal(false);
      setShowSuccess(true);
    }
  }, [isConfirmed, hash, showSuccess]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="opacity-70">You need to be logged in to make deposits.</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="opacity-70">Please connect your wallet to make deposits.</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    const gasUsed = receipt?.gasUsed ? (Number(receipt.gasUsed) / 1e18).toFixed(6) : undefined;
    return (
      <SuccessState
        onViewDashboard={handleViewDashboard}
        transactionHash={hash}
        gasUsed={gasUsed}
      />
    );
  }


  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Deposit Liquidity
              </h1>
              <p className="text-lg opacity-70">
                Add PYUSD or other stablecoins to optimize across chains
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="px-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Deposit Form */}
              <div className="lg:col-span-2 space-y-6">
                <DepositForm onSubmit={handleDepositSubmit} />

                {depositData && (
                  <SimulationPreview
                    data={depositData}
                    onConfirm={() => setShowConfirmModal(true)}
                  />
                )}
              </div>

              {/* Right Column - Best Chain Suggestion */}
              <div className="space-y-6">
                <BestChainSuggestion />
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirmModal && depositData && (
          <ConfirmModal
            data={depositData}
            isProcessing={isProcessing}
            onCancel={() => setShowConfirmModal(false)}
            createPosition={createPosition}
            transactionHash={hash}
            isConfirmed={isConfirmed}
          />
        )}
      </div>
    </div>
  );
};

export default DepositPage;
