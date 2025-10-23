# Testing Guide for Bloom Finance Smart Contracts

This guide covers both **Solidity unit tests** (Foundry-style) and **Viem tests** (TypeScript) for the Bloom Finance protocol.

## 📁 Test Structure

```
test/
├── README.md                           # This guide
├── PositionManagerRouter.t.sol         # Solidity tests for main router
├── PositionPool.t.sol                  # Solidity tests for position pools
├── PositionRegistry.t.sol              # Solidity tests for NFT registry
├── PositionManagerRouter.test.ts       # Viem tests for main router
├── PositionPool.test.ts                # Viem tests for position pools
├── PositionRegistry.test.ts            # Viem tests for NFT registry
└── Counter.ts                          # Example Viem test (existing)
```

## 🔧 Setup and Installation

### Prerequisites

Your project already has the necessary dependencies:

- `hardhat` - Testing framework
- `@nomicfoundation/hardhat-toolbox-viem` - Viem integration
- `viem` - Ethereum library
- `forge-std` - Foundry testing utilities

### Additional Dependencies (if needed)

```bash
npm install --save-dev @types/mocha chai
```

## 🧪 Running Tests

### Viem Tests (TypeScript)

```bash
# Run all Viem tests
npx hardhat test

# Run specific test file
npx hardhat test test/PositionManagerRouter.test.ts

# Run with verbose output
npx hardhat test --verbose

# Run tests on specific network
npx hardhat test --network hardhatMainnet
```

### Solidity Tests (Foundry-style)

```bash
# If you have Foundry installed
forge test

# Run specific test contract
forge test --match-contract PositionManagerRouterTest

# Run with verbose output
forge test -vvv

# Run specific test function
forge test --match-test testCreatePosition
```

## 📝 Test Examples

### 1. Solidity Unit Tests

#### Basic Test Structure

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {YourContract} from "../contracts/YourContract.sol";

contract YourContractTest is Test {
    YourContract public yourContract;

    function setUp() public {
        yourContract = new YourContract();
    }

    function testBasicFunctionality() public {
        // Your test logic here
        assertEq(yourContract.someFunction(), expectedValue);
    }
}
```

#### Key Foundry Testing Features

- `vm.startPrank(user)` / `vm.stopPrank()` - Impersonate users
- `vm.expectRevert()` - Expect transaction to revert
- `vm.expectEmit()` - Expect specific events
- `assertEq()`, `assertTrue()`, etc. - Assertions
- `deal(address, amount)` - Set ETH balance
- `hoax(user, amount)` - Set user as msg.sender with ETH

### 2. Viem Tests (TypeScript)

#### Basic Test Structure

```typescript
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import { parseEther, getAddress } from "viem";

describe("YourContract", async function () {
  const { viem } = await network.connect();
  let contract: any;

  beforeEach(async function () {
    contract = await viem.deployContract("YourContract");
  });

  it("Should work correctly", async function () {
    const result = await contract.read.someFunction();
    assert.equal(result, expectedValue);
  });
});
```

#### Key Viem Testing Features

- `viem.deployContract()` - Deploy contracts
- `contract.write.functionName()` - Write transactions
- `contract.read.functionName()` - Read-only calls
- `contract.simulate.functionName()` - Simulate transactions
- `viem.assertions.emitWithArgs()` - Assert events
- `parseEther()`, `parseUnits()` - Parse amounts
- `getAddress()` - Format addresses

## 🎯 Testing Best Practices

### 1. Test Organization

- **One test file per contract**
- **Group related tests in describe blocks**
- **Use descriptive test names**
- **Test both success and failure cases**

### 2. Setup and Teardown

```typescript
beforeEach(async function () {
  // Deploy fresh contracts for each test
  // Set up initial state
  // Mint tokens, set approvals, etc.
});
```

### 3. Test Coverage Areas

#### ✅ Core Functionality

- Contract deployment and initialization
- Main business logic functions
- State changes and storage updates

#### ✅ Access Control

- Owner-only functions
- Role-based permissions
- Unauthorized access attempts

#### ✅ Edge Cases

- Zero amounts
- Maximum values
- Empty arrays/strings
- Invalid addresses

#### ✅ Error Handling

- Revert conditions
- Custom error messages
- Invalid inputs

#### ✅ Events

- Event emission
- Correct event parameters
- Event ordering

### 4. Mock and Test Data

```typescript
// Use realistic test data
const REALISTIC_ETH_AMOUNT = parseEther("1.5");
const REALISTIC_USDC_AMOUNT = parseUnits("3000", 6);

// Create helper functions
function createTestPosition(
  user: Address,
  ethAmount: bigint,
  usdcAmount: bigint
) {
  // Helper implementation
}
```

## 🔍 Debugging Tests

### Viem Tests

```typescript
// Add console logs
console.log("Balance:", await token.read.balanceOf([user]));

// Use try-catch for better error handling
try {
  await contract.write.someFunction();
} catch (error: any) {
  console.log("Error:", error.message);
  throw error;
}
```

### Solidity Tests

```solidity
// Use console.log from forge-std
console.log("Balance:", token.balanceOf(user));
console.log("Address:", user);

// Use vm.expectRevert with specific error
vm.expectRevert(abi.encodeWithSelector(CustomError.selector, param));
```

## 📊 Test Scenarios for Bloom Finance

### Position Creation Tests

- ✅ Create position with valid amounts
- ✅ Create multiple positions for same user
- ✅ Create positions for different users
- ✅ Verify token transfers
- ✅ Check NFT minting
- ❌ Create position with zero amounts
- ❌ Create position with insufficient balance

### Position Pool Tests

- ✅ Transfer tokens as owner
- ✅ Transfer different token types
- ✅ Transfer entire balance
- ❌ Transfer as non-owner
- ❌ Transfer more than balance
- ❌ Transfer to zero address

### Position Registry Tests

- ✅ Mint NFT as manager
- ✅ Multiple NFTs to same user
- ✅ NFTs to different users
- ✅ ERC721 transfers and approvals
- ❌ Mint as non-manager
- ❌ Mint same token ID twice
- ❌ Mint to zero address

## 🚀 Advanced Testing

### Integration Tests

```typescript
// Test full workflow
it("Should complete full position lifecycle", async function () {
  // 1. Create position
  // 2. Mint liquidity position
  // 3. Rebalance position
  // 4. Collect fees
  // 5. Close position
});
```

### Gas Optimization Tests

```solidity
function testGasUsage() public {
    uint256 gasBefore = gasleft();
    yourContract.someFunction();
    uint256 gasUsed = gasBefore - gasleft();

    // Assert gas usage is within expected range
    assertLt(gasUsed, MAX_EXPECTED_GAS);
}
```

### Fuzz Testing

```solidity
function testFuzzCreatePosition(uint256 ethAmount, uint256 usdcAmount) public {
    // Bound inputs to reasonable ranges
    ethAmount = bound(ethAmount, 0.01 ether, 100 ether);
    usdcAmount = bound(usdcAmount, 100e6, 100000e6);

    // Test with random inputs
    // ... test logic
}
```

## 📋 Test Checklist

Before deploying:

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Edge cases covered
- [ ] Error conditions tested
- [ ] Events properly tested
- [ ] Gas usage optimized
- [ ] Access control verified
- [ ] Mock contracts work correctly

## 🛠 Troubleshooting

### Common Issues

1. **Contract not found**

   ```bash
   # Compile contracts first
   npx hardhat compile
   ```

2. **Import errors in Solidity tests**

   ```solidity
   // Use correct relative paths
   import {Contract} from "../contracts/Contract.sol";
   ```

3. **Viem type errors**

   ```typescript
   // Ensure proper typing
   const result: bigint = await contract.read.someFunction();
   ```

4. **Network configuration**
   ```typescript
   // Use correct network in hardhat.config.ts
   const { viem } = await network.connect("hardhatMainnet");
   ```

This comprehensive testing setup ensures your Bloom Finance protocol is thoroughly tested and production-ready! 🚀
