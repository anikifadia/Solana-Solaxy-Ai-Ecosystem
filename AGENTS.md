# SOLAXY AI - Production Guidelines & Roadmap

This file contains persistent guidelines, system rules, and the multi-stage production roadmap for Solaxy AI to ensure future agents maintain technical depth and respect the architecture.

## 🚀 Vision & Core Value Proposition
Solaxy is the world’s first fully automated token factory for Web3 creators, enabling users to generate, automatically verify with AI audit, and instantly deploy a complete Solana token with locked liquidity pools in 10 seconds—eliminating expensive development costs and smart contract security risks.

---

## 📅 Production Roadmap v2.0

### Etap 1 – Fundament (Priority: Critical)
- **Framework**: React + TypeScript client-side styled with Tailwind CSS, Vite bundler.
- **Backend API**: Express.js with custom server router handling API requests.
- **Storage**: Persistent JSON-based local store on server (can be migrated to PostgreSQL/Prisma).
- **Session state**: Decentralized wallets (Phantom, Solflare, etc.) or local state fallback.

### Etap 2 – AI Core
- **Gemini API Integration**: Server-side Gemini API utilizing the `@google/genai` SDK.
- **Workflow**: Automated generation, audit reports, branding metadata, and deployment simulation.

### Etap 3 – AI Orchestrator
- **Model selection**: Google Gemini models (e.g. `gemini-2.5-flash` or `gemini-2.5-pro` via `@google/genai`).
- **Resiliency**: Built-in timeout, rate limit guards, and error retry handlers.

### Etap 4 – Data Schema
- **Token registry**: Tracks simulated/deployed tokens, supply, description, creator wallet, and audit scores.
- **Miners/Staking**: Active miners, balances, and hash-rate performance.
- **Tickets**: User contact submissions logged securely.

### Etap 5 – Dashboard
- Interactive dashboards for:
  - Token creation progress (11 steps automated stream).
  - Presale analytics with interactive SVG pie charts and vesting trackers.
  - Staking forge and miners with real-time blocks.
  - System status & live telemetry console.

### Etap 6 – UI/UX
- **Aesthetic**: Deep premium dark mode, green neon accents, cyber-HUD visual details.
- **Motion**: Fluid spring animations and staggered ScrollReveals.

### Etap 7 – Integrations
- Gemini API (server-side).
- Wallet standard emulation.
- Dynamic CoinGecko data.
- SMTP / local contact logs.

### Etap 8 – Security & Resiliency
- Built-in live **Outage Reactor** with **Exponential Backoff** retry scheduling and automated Backup RPC Fallback failover.
- Strict input validation on API routes.

---

## 🛠️ Project Guidelines
1. **Never mock everything**: Always ensure buttons have concrete functional actions, live state updates, and trigger server endpoints if required.
2. **Technical Credibility**: Maintain public accessibility of `robots.txt` and `sitemap.xml` via custom Express handlers in `server.ts`.
3. **No Unrequested Theme Toggle**: Preserve the polished Dark luxury visual theme.
