# Rainbow Wallet Setup Guide

This application has been configured to work exclusively with Rainbow Wallet. Follow these steps to get started:

## Prerequisites

1. **Install Rainbow Wallet**

   - Download and install the Rainbow Wallet browser extension from [rainbow.me](https://rainbow.me/)
   - Create or import your wallet
   - Make sure you have some ETH for transactions

2. **Get WalletConnect Project ID**
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy your Project ID

## Setup Steps

1. **Environment Configuration**

   ```bash
   cp env.example .env
   ```

   Update your `.env` file with:

   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## What's Changed

- ✅ Removed Privy and Xellar providers
- ✅ Configured RainbowKit and wagmi
- ✅ Simplified login flow to only use Rainbow Wallet
- ✅ Updated UI to show Rainbow Wallet branding
- ✅ Added proper Web3 context integration

## Supported Networks

The application is configured to support:

- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base
- Sepolia (testnet)

## Troubleshooting

**"No wallet connector found"**

- Make sure Rainbow Wallet extension is installed and enabled
- Refresh the page after installing the extension

**Connection fails**

- Check that you have a valid WalletConnect Project ID
- Ensure Rainbow Wallet is unlocked
- Try refreshing the page

**Network issues**

- Make sure you're connected to a supported network in Rainbow Wallet
- Switch networks if needed through the wallet interface

## Features

- **Role-based Demo Login**: Choose between Admin, User, or Public roles
- **Persistent Connection**: Wallet connection state is preserved
- **Network Support**: Works with multiple Ethereum networks
- **Modern UI**: Clean, responsive interface with Rainbow branding
