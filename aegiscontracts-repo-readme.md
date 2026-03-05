# AegisPay Contracts

**Decentralized Payment & Settlement Protocol**

_The Settlement Ledger for Web3 Commerce - Bringing Visa-style "Auth & Capture" to Smart Contracts_

[![Chainlink CRE](https://img.shields.io/badge/Built%20with-Chainlink%20CRE-blue)](https://docs.chain.link/cre)

## Table of Contents

- [The Problem](#the-problem)
  - [Infinite Approvals Risk](#1-infinite-approvals-risk)
  - [Over-collateralization Burden](#2-over-collateralization-burden)
  - [Strict Approval UX Nightmare](#3-strict-approval-ux-nightmare)
- [The Aegis Solution](#the-aegis-solution)
  - [The TradFi Equivalent](#the-tradfi-equivalent)
  - [The Aegis Reality](#the-aegis-reality)
- [Core Architecture (The Smart Contract)](#core-architecture-the-smart-contract)
  - [Singleton Ledger Design](#singleton-ledger-design)
  - [Identity Layer & Risk Profiles](#identity-layer--risk-profiles)
  - [AI & CRE Guarded Functions](#ai--cre-guarded-functions)
  - [Key Functions](#key-functions)
- [Integration with `aegispay-cre`](#integration-with-aegispay-cre)
- [Local Setup & Testing](#local-setup--testing)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Deployment](#deployment)
  - [Testing the Complete Flow](#testing-the-complete-flow)
  - [Event Monitoring & Audit Trail](#event-monitoring--audit-trail)
- [Architecture Benefits](#architecture-benefits)
- [Supported Merchant Types](#supported-merchant-types)
- [Contributing](#contributing)

---

## The Problem

Web3 payments currently fail real-world commerce due to three critical limitations:

### 1. **Infinite Approvals Risk**

Traditional ERC20 approvals force users into a dangerous choice: either approve infinite amounts (risking complete wallet drainage if the merchant is exploited) or face constant transaction friction.

### 2. **Over-collateralization Burden**

Dynamic pricing services require users to lock excessive upfront capital. Want a $15 Uber ride? Lock $100 "just in case" traffic hits. This creates terrible UX and capital inefficiency.

### 3. **Strict Approval UX Nightmare**

In standard ERC20, if an Uber ride is estimated at exactly 15 USDC, you `approve()` exactly 15 USDC. But if traffic hits and the ride costs 16 USDC, the transaction reverts. The merchant fails to capture funds, and the user experience breaks.

**The Current Reality**: Handling dynamic pricing in Web3 (like EV charging, ride-sharing, or AI agent services) forces merchants and users into suboptimal solutions that either compromise security or create friction.

---

## The Aegis Solution

AegisPay translates the proven TradFi "Auth & Capture" architecture to Web3, utilizing a secure, decentralized clearing ledger powered by AI risk management.

### **The TradFi Equivalent**

When you get your paycheck, you deposit it into your Bank of America checking account. You trust the bank. But when you swipe your debit card at a shady gas station, the gas station only gets authorization for the $40 of gas. They do **not** get access to your entire bank account.

### **The Aegis Reality**

1. **Deposit**: User deposits 1000 USDC into the AegisProtocol ledger (`userFreeBalances`) - their secure "checking account"
2. **Authorize**: When they want to ride an Uber, they sign an off-chain authorization for exactly 15 USDC. This signed authorization is forwarded via CRE and goes through an AI fraud assessment step before being processed on-chain
3. **Dynamic Increment**: If traffic hits and the ride needs 18 USDC, the merchant cannot arbitrarily pull it. They must request an increment through our **Chainlink CRE AI Risk Engine**
4. **AI Evaluation**: The AI dynamically evaluates the request (merchant history, user patterns, service type) and executes the increment on-chain if approved
5. **Capture**: Merchant captures the actual amount used, automatically releasing any unused authorization back to user's free balance

**Key Security**: This architecture isolates the user's primary capital from merchant-level exploits while enabling seamless dynamic pricing.

---

## Core Architecture (The Smart Contract)

### **Singleton Ledger Design**

AegisPay uses a single, efficient contract to manage the complete payment lifecycle:

```solidity
// Three-Tier Balance Separation
mapping(address => uint256) public userFreeBalances;
// User's available funds
mapping(address => mapping(address => uint256)) public authorizedHolds;
// Active merchant authorizations
mapping(address => uint256) public merchantSettledBalances;
 // Captured funds ready for withdrawal
```

### **Identity Layer & Risk Profiles**

The `registerMerchant` function assigns risk profiles via the `MerchantCategory` enum:

```solidity
enum MerchantCategory {
    GENERIC,      // Standard merchants
    EV_CHARGER,   // Electric vehicle charging stations
    RIDE_SHARE,   // Transportation services (Uber, Lyft)
    RETAIL        // Physical/digital goods
}
```

Each category enables different risk parameters and authorization limits in the AI engine.

### **AI & CRE Guarded Functions**

**Critical Security Feature**: Both the `authorize` (signature verification) and `_secureIncrement` (dynamic pricing) functions are **STRICTLY gated** to the Chainlink CRE Forwarder. No one can bypass the off-chain AI Risk Engine.

```solidity
function _secureIncrement(address user, address merchant, uint256 newAmount, string memory reason) internal {
    // Only callable through Chainlink CRE verification
    // All authorizations logged in off-chain data store
    // This is the "AI Guard" for dynamic authorization increases
}
```

### **Key Functions**

- **`deposit(uint256 amount)`**: Deposit USDC into user free balance
- **`registerMerchant(string name, MerchantCategory category)`**: Register as a merchant with risk profile
- **`authorize(...)`**: Process user authorization signatures through CRE AI fraud assessment (CRE-gated)
- **`_secureIncrement(...)`**: Dynamically increment authorization amounts via AI risk evaluation (CRE-gated)
- **`captureFunds(address user, uint256 amount)`**: Capture authorized funds (merchant only)
- **`withdrawSettled()`**: Withdraw captured funds to merchant wallet
- **`withdrawFunds(uint256 amount)`**: Withdraw available free balance to user wallet

---

## Integration with `aegispay-cre`

The smart contract layer integrates seamlessly with our off-chain **Aegis CRE (Chainlink Runtime Environment)** repository, which handles:

- 🤖 **LLM Fraud Detection**: AI-powered risk assessment for authorization increments
- ✅ **Signature Verification**: Off-chain validation of user authorization signatures
- 📊 **Event Logging**: Real-time event capture and storage in Firestore for end-to-end audit trails
- 🔄 **CRE Workflow Simulation**: Testing and validation of the complete payment flow

**Learn More**: [AegisPay CRE Repository](https://github.com/AegisPayments/aegis-cre.git)

---

## Local Setup & Testing

### **Prerequisites**

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Node.js and npm (for CRE simulations in CRE repo)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/AegisPayments/aegispay-contracts.git
cd aegispay-contracts

# Install dependencies
forge install

# Build the contracts
forge build

# Run the test suite
forge test -vvv
```

### **Environment Setup**

Copy the environment template and configure your settings:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```bash
RPC_URL=https://sepolia.infura.io/v3/your-key
PRIVATE_KEY=0xYourPrivateKey
ETHERSCAN_API_KEY=YourEtherscanApiKey
```

### **Deployment**

The deployment script is located at [`script/deploy/AegisProtocol.s.sol`](script/deploy/AegisProtocol.s.sol).

**Important**: Before deploying to a different network, update the token and forwarder addresses in the deployment script:

```solidity
// Current: Sepolia testnet
address usdcAddress = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238; // Sepolia USDC
address forwarderAddress = 0x15fC6ae953E024d975e77382eEeC56A9101f9F88; // CRE Forwarder

// For Mainnet, use:
// address usdcAddress = 0xA0b86a33E6Dd86BC78e47C65ACdd7EB7b2f3db24; // Mainnet USDC
```

**Deploy the contract:**

```bash
# Dry run
make deploy

# Live deployment
make deploy FLAGS=--broadcast
```

### **Testing the Complete Flow**

After deployment, test the full payment cycle:

#### **1. Approve and Deposit User Funds**

```bash
make approve-deposit PROTOCOL=0xYourProtocolAddress AMOUNT=1000000 FLAGS=--broadcast
# Note: AMOUNT is in smallest units (1000000 = 1 USDC)
```

#### **2. Register as Merchant**

```bash
make register-merchant PROTOCOL=0xYourProtocolAddress MERCHANT_NAME="My Coffee Shop" MERCHANT_CATEGORY=3 FLAGS=--broadcast
# Categories: 0=GENERIC, 1=EV_CHARGER, 2=RIDE_SHARE, 3=RETAIL
```

#### **3. CRE Workflow Simulation**

After completing steps 1-2, you can test the AI-powered authorization and increment flow in the `aegispay-cre` repository, which simulates the entire process including signature generation, CRE evaluation, and on-chain interactions.

#### **4. Capture Authorized Funds**

```bash
make capture-funds PROTOCOL=0xYourProtocolAddress USER_ADDRESS=0xUserAddress AMOUNT=500000 FLAGS=--broadcast
```

The `captureFunds` function automatically:

- ✅ Captures the specified amount from authorized holds
- ✅ Moves captured funds to merchant settled balances
- ✅ Releases any remaining authorized funds back to user's free balance
- ✅ Emits events that trigger CRE log storage in Firestore

#### **5. Withdraw Settled Funds**

```bash
make withdraw-settled PROTOCOL=0xYourProtocolAddress FLAGS=--broadcast
```

### **Event Monitoring & Audit Trail**

Upon emission of `Captured` and `FundsReleased` events, CRE log triggers execute automatically, storing all events in Firestore for comprehensive end-to-end audit trails. This ensures complete transaction visibility and regulatory compliance.

---

## Architecture Benefits

✅ **Security**: Isolated user funds with AI-powered risk management  
✅ **UX**: Seamless dynamic pricing without infinite approvals  
✅ **Capital Efficiency**: No over-collateralization required  
✅ **Merchant Flexibility**: Support for various business models  
✅ **Audit Trail**: Complete transaction history and compliance  
✅ **Scalability**: Single contract, optimized gas costs

---

## Supported Merchant Types

- 🚗 **Ride Sharing**: Dynamic pricing for transportation services
- ⚡ **EV Charging**: Pay-per-kWh with real-time metering
- 🛍️ **Retail**: Traditional e-commerce and physical goods
- 🤖 **AI Agents**: Automated service consumption and billing
- 📦 **Generic**: Any merchant requiring flexible payment authorization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request
