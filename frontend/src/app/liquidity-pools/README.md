# Liquidity Pools Page

## Overview

The Liquidity Pools page provides a beautiful, dark-themed interface for users to explore and manage liquidity pools. The design matches the screenshot provided with a modern dark blue/slate color scheme.

## Features

### 1. **Pool Display**
- Grid layout showing all available liquidity pools
- Each pool card displays:
  - Token pair icons and names (e.g., SOL/USDC)
  - Protocol information (e.g., Meteora DLMM)
  - 24h Volume
  - APY (Annual Percentage Yield)
  - TVL (Total Value Locked)
  - Current Price
  - Deposit and Withdraw action buttons
  - Maintenance status indicator

### 2. **Filtering**
- Filter buttons at the top allow users to filter pools by:
  - All Pools (default)
  - SHEDGE
  - SOL
  - WBTC
  - WETH
- Active filter is highlighted with an indigo gradient

### 3. **Deposit Functionality**
The Deposit Modal integrates with `usePosition.ts` hook:
- Input fields for both token amounts (token0 and token1)
- Displays token balances from wallet
- ERC20 token approval workflow
- Calls the `useMint` function from `usePositionContract` hook
- Shows transaction status (pending, confirming, confirmed)
- Links to Etherscan for transaction verification

### 4. **Withdraw Functionality**
The Withdraw Modal integrates with `usePosition.ts` hook:
- Input field for Position NFT Token ID
- Calls the `rebalance` function from `usePositionContract` hook
- Warning message about stopping rewards
- Transaction status tracking
- Links to Etherscan for transaction verification

## File Structure

```
liquidity-pools/
├── index.tsx                    # Main page component
├── _components/
│   ├── PoolCard.tsx            # Individual pool card component
│   ├── FilterButtons.tsx       # Filter button group component
│   ├── DepositModal.tsx        # Modal for depositing liquidity
│   └── WithdrawModal.tsx       # Modal for withdrawing liquidity
└── README.md                   # This file
```

## Integration with usePosition Hook

### Deposit Flow
1. User clicks "Deposit" on a pool card
2. Deposit modal opens with input fields for token0 and token1
3. System checks if token approvals are needed
4. If needed, requests approval for each token
5. Once approved, calls `mintPosition` (from `usePositionContract.useMint`)
6. Transaction is submitted and confirmed
7. Modal shows success state and closes

### Withdraw Flow
1. User clicks "Withdraw" on a pool card
2. Withdraw modal opens with input field for NFT token ID
3. User enters their position NFT token ID
4. Calls `rebalance` from `usePositionContract`
5. Transaction is submitted and confirmed
6. Modal shows success state and closes

## Key Components

### PoolData Interface
```typescript
interface PoolData {
  id: string;
  pair: {
    token0: string;
    token1: string;
    icon0: string;
    icon1: string;
  };
  protocol: string;
  protocolType: string;
  volume24h: string;
  apy: string;
  tvl: string;
  price: string;
  isUnderMaintenance?: boolean;
  tokenAddresses?: {
    token0: string;
    token1: string;
  };
  poolAddress?: string;
  fee?: number;
}
```

### usePositionContract Hook Integration
The page uses the following functions from `usePositionContract`:
- `useMint` (renamed to `mintPosition` in DepositModal): Creates a new liquidity position
- `rebalance`: Withdraws liquidity from a position
- State tracking: `isPending`, `isConfirming`, `isConfirmed`, `hash`

## Access Control

The page is protected and requires users to be logged in with either ADMIN or USER role (configured in `router.tsx`).

## Navigation

A "Liquidity Pools" link has been added to the main navigation header, positioned between "Deposit" and "Analytics".

## Design

The page features a dark theme to match the screenshot:
- Background: Dark slate gradient (`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`)
- Cards: Slate-800 with slate-700 borders
- Primary action buttons: Indigo gradient
- Secondary buttons: Slate-700
- Text: White and slate-300/400 for hierarchy

## Future Enhancements

1. **Live Data Integration**: Replace mock data with real pool data from a backend API or blockchain
2. **Real Token Addresses**: Update token addresses from placeholder values
3. **Balance Display**: Show user's current positions in each pool
4. **APY History**: Add charts showing historical APY data
5. **Multi-chain Support**: Extend to support multiple blockchain networks
6. **Advanced Filters**: Add more filtering options (by TVL, APY range, etc.)
7. **Search**: Add search functionality for specific pools
8. **Favorites**: Allow users to favorite/bookmark specific pools

## Usage Example

```typescript
// Navigate to the page
navigate('/liquidity-pools');

// Or link to it
<Link to="/liquidity-pools">View Liquidity Pools</Link>
```

## Dependencies

- React
- wagmi (for Web3 interactions)
- viem (for Ethereum utilities)
- @rainbow-me/rainbowkit (for wallet connection)
- react-router-dom (for navigation)
- Custom hooks: `useAuth`, `useWeb3`, `usePositionContract`

