# AegisPay Web

**The landing page, documentation, and interactive demo site for AegisPay** — a decentralized settlement layer bringing Visa-style "Auth & Capture" to Web3 smart contracts.

[![Built with Chainlink CRE](https://img.shields.io/badge/Built%20with-Chainlink%20CRE-blue)](https://docs.chain.link/cre)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)

## What is AegisPay?

AegisPay solves three critical failures in Web3 payments:

- **No Infinite Approvals** — Users deposit once into a secure singleton ledger. Merchants get time-limited authorizations without access to your entire wallet.
- **No Over-collateralization** — Dynamic pricing services (EV charging, ride-sharing, AI agents) work without locking excessive upfront capital.
- **AI Risk Engine** — Chainlink CRE workflows with LLM-powered fraud detection evaluate every authorization increment in real-time.

The protocol consists of two repositories:
- **[aegispay-contracts](https://github.com/AegisPayments/aegispay-contracts)** — On-chain singleton ledger (Solidity/Foundry)
- **[aegis-cre](https://github.com/AegisPayments/aegis-cre)** — Off-chain AI risk engine (Chainlink CRE + LLM)

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
bun dev          # Start dev server
bun run build    # Production build
bun run lint     # ESLint
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/demos` | Interactive protocol demos |
| `/docs` | Full technical documentation (Smart Contracts + CRE Workflow) |

## Tech Stack

- **Framework**: Next.js 16 App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4, always dark mode, `aegis-gradient-bg`
- **UI**: shadcn/ui (Radix UI primitives), lucide-react, Geist fonts
- **Docs rendering**: react-markdown, react-syntax-highlighter, mermaid
- **Search**: Fuse.js fuzzy search across documentation

## Related Repositories

- **[AegisPay Smart Contracts](https://github.com/AegisPayments/aegispay-contracts)** — Foundry contracts, deployment scripts, and test suite
- **[AegisPay CRE](https://github.com/AegisPayments/aegis-cre)** — Chainlink CRE workflow, LLM integration, Firebase audit logging
