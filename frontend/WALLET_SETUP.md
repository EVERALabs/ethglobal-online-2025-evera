# Wallet Connection Setup

## 🌈 Rainbow Wallet Integration

The application is now configured to work with Rainbow Wallet as the primary Web3 provider.

### Prerequisites

1. **Install Rainbow Wallet Extension**
   - Download from: https://rainbow.me/
   - Install the browser extension
   - Create or import a wallet

### Testing the Connection

1. **Start the Development Server**

   ```bash
   npm run dev
   ```

2. **Navigate to Login**

   - Go to `http://localhost:5173/login`
   - Rainbow Wallet should be the only available option

3. **Connect Wallet**
   - Click "Connect with Rainbow Wallet"
   - Rainbow extension should prompt for connection
   - Approve the connection request

### Current Status

✅ **Enabled:**

- Rainbow Wallet integration
- Basic wallet connection via `window.ethereum`
- Proper error handling

🚫 **Disabled (Temporarily):**

- Privy authentication
- Xellar wallet integration

### Next Steps

To enhance the Rainbow Wallet integration:

1. **Install RainbowKit (Optional)**

   ```bash
   npm install @rainbow-me/rainbowkit wagmi viem
   ```

2. **Add Chain Support**

   - Configure supported networks
   - Add chain switching functionality

3. **Enhanced Features**
   - Display wallet balance
   - Transaction history
   - Multi-chain support

### Troubleshooting

**"Rainbow Wallet not found" Error:**

- Ensure Rainbow extension is installed
- Refresh the page
- Check browser console for errors

**Connection Fails:**

- Make sure Rainbow wallet is unlocked
- Check if the wallet has accounts
- Try disconnecting and reconnecting

### Development Notes

- The connection logic is in `src/context/Web3Context.tsx`
- Provider selection is in `src/app/login/_components/AuthProviderSelector.tsx`
- TypeScript definitions are in `src/vite-env.d.ts`
