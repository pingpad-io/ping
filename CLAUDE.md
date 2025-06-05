# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pingpad is a minimalistic decentralized social platform built on:
- **Lens Protocol** - Decentralized social graph
- **Grove** and **Arweave** - Media storage
- **Next.js 14** (App Router) - Web framework
- **TypeScript** - Primary language
- **Bun** - Package manager (v1.2.5)

## Common Development Commands

```bash
# Install dependencies
bun install

# Run development server
bun dev
# or
npm run dev

# Build for production
bun build
# or
npm run build

# Start production server
bun start
# or
npm run start

# Format and lint code (required before commits)
bun x @biomejs/biome check --apply-unsafe ./src/*
# or
npm run check
```

## Architecture Overview

### Directory Structure
- `/src/app/` - Next.js App Router pages and API routes
  - `(feed)/` - Feed-related pages with shared layout
  - `(title)/` - Pages with title header layout
  - `api/` - RESTful API endpoints for posts, users, notifications
  - `p/[slug]/` - Individual post pages
  - `u/[user]/` - User profile pages

- `/src/components/` - React components organized by domain
  - `auth/` - Authentication components
  - `communities/` - Community-related components
  - `menu/` - Navigation and menu components
  - `notifications/` - Notification system
  - `post/` - Post-related components (PostView, PostWizard, etc.)
  - `ui/` - Shadcn/UI base components
  - `user/` - User profile and avatar components
  - `web3/` - Web3 wallet connection components

- `/src/hooks/` - Custom React hooks
- `/src/utils/` - Utility functions
  - `lens/` - Lens Protocol client utilities

### Key Technologies

**Web3 Integration:**
- Lens Protocol SDK (canary version) for social features
- Wagmi v2 for Ethereum interactions
- WalletConnect, Coinbase Wallet SDK for wallet connections
- Viem for blockchain utilities

**UI/Styling:**
- Tailwind CSS with custom theme configuration
- Radix UI primitives wrapped in Shadcn/UI components
- Framer Motion for animations
- Custom background gradient system (recent feature)

**State Management:**
- Redux Toolkit for global state
- React Query (TanStack Query) for server state
- React Hook Form for forms

### Environment Configuration

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID
- `NEXT_PUBLIC_APP_ADDRESS` - Production Lens app address
- `NEXT_PUBLIC_APP_ADDRESS_TESTNET` - Testnet Lens app address
- `NEXT_PUBLIC_NODE_ENV` - Environment (development/test/production)

Environment validation is handled by Zod schemas in `/src/env.mjs`.

### Code Style and Quality

- **Biome** is used for formatting and linting (replaces ESLint/Prettier)
- Configuration in `biome.json`:
  - 2 spaces indentation
  - 120 character line width
  - Some rules disabled for React/Next.js compatibility
- Run `bun x @biomejs/biome check --apply-unsafe ./src/*` before committing

### Important Patterns

1. **API Routes**: Follow RESTful conventions in `/src/app/api/`
2. **Components**: Use domain-based organization (post/, user/, etc.)
3. **Lens Integration**: Client utilities in `/src/utils/lens/`
4. **Theme System**: Custom background gradients stored in localStorage
5. **Authentication**: Server-side auth utilities in `/src/utils/getServerAuth.ts`

### Current Development State

- Active branch: `cursor/add-custom-background-gradients-6b30`
- Recent features: Custom background themes, notification improvements
- No test framework currently configured