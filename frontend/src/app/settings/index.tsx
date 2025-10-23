import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../hooks/useWeb3';
import { StrategyParameters } from './_components/StrategyParameters';
import { ChainWhitelist } from './_components/ChainWhitelist';
import { RolesSection } from './_components/RolesSection';
import { SecurityInfo } from './_components/SecurityInfo';
import { SaveChangesModal } from './_components/SaveChangesModal';

interface SettingsData {
    strategyParams: {
        rebalanceThreshold: number;
        minLiquidityPerChain: number;
        maxSlippage: number;
        gasPriceMultiplier: number;
    };
    chainWhitelist: {
        [chainId: string]: boolean;
    };
}

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const { isConnected } = useWeb3();
    const [settingsData, setSettingsData] = useState<SettingsData>({
        strategyParams: {
            rebalanceThreshold: 5.0,
            minLiquidityPerChain: 10000,
            maxSlippage: 0.5,
            gasPriceMultiplier: 1.2,
        },
        chainWhitelist: {
            '1': true,    // Ethereum
            '8453': true, // Base
            '42161': true, // Arbitrum
            '10': true,   // Optimism
            '137': true,  // Polygon
            '56': false,  // BSC
            '43114': false, // Avalanche
        },
    });
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const handleStrategyParamsChange = (params: SettingsData['strategyParams']) => {
        setSettingsData(prev => ({ ...prev, strategyParams: params }));
        setHasChanges(true);
    };

    const handleChainWhitelistChange = (whitelist: SettingsData['chainWhitelist']) => {
        setSettingsData(prev => ({ ...prev, chainWhitelist: whitelist }));
        setHasChanges(true);
    };

    const handleSaveChanges = async () => {
        setShowSaveModal(true);
    };

    const handleConfirmSave = async () => {
        // Simulate transaction processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        setShowSaveModal(false);
        setHasChanges(false);
        // In a real app, you'd submit the transaction here
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="opacity-70">You need to be logged in to access settings.</p>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
                    <p className="opacity-70">Please connect your wallet to access settings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200/30">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="space-y-8">
                    {/* Page Header */}
                    <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-primary font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    ⚙️ Settings & Governance
                                </h1>
                                <p className="text-lg opacity-70 mt-2">
                                    Configure protocol parameters and manage system settings
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="badge badge-warning badge-lg">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Admin Access
                                </div>
                                <div className="badge badge-primary badge-lg">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Protocol Control
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Sections */}
                    <div className="px-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <StrategyParameters
                                    params={settingsData.strategyParams}
                                    onChange={handleStrategyParamsChange}
                                />

                                <ChainWhitelist
                                    whitelist={settingsData.chainWhitelist}
                                    onChange={handleChainWhitelistChange}
                                />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <RolesSection />

                                <SecurityInfo />
                            </div>
                        </div>
                    </div>

                    {/* Save Changes Button */}
                    <div className="px-2">
                        <div className="flex justify-center pt-6">
                            <button
                                onClick={handleSaveChanges}
                                disabled={!hasChanges}
                                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${hasChanges
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 shadow-lg hover:shadow-xl'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {hasChanges ? (
                                    <>
                                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Save Changes
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        No Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Changes Modal */}
                {showSaveModal && (
                    <SaveChangesModal
                        onConfirm={handleConfirmSave}
                        onCancel={() => setShowSaveModal(false)}
                        changes={settingsData}
                    />
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
