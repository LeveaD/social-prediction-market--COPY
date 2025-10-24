## ETH Predictor — Architecture

This document describes the high-level architecture for ETH Predictor, explains component responsibilities, and shows the main data flows and lifecycle for a market.

### Components

- Smart Contracts (Ethereum-compatible)
  - Market contract: create markets, accept stakes, store outcome, distribute payouts.
  - Oracle bridge contract (or trusted multisig): receives signed outcomes from the oracle service and finalizes markets.

- Backend (`/backend`)
  - REST API: market metadata, user endpoints, moderation endpoints.
  - Websocket server: real-time market updates and chat rooms.
  - Services: oracleService, reputationService, envoiService (sponsor integration), hederaService (optional).
  - Integrations: AI moderation service, Postgres DB, on-chain RPC.

- AI Service (`/ai`)
  - Provides classification endpoints for bot detection, content moderation, and other ML tasks.
  - Lightweight: returns labels, confidence scores, and metadata for use by backend moderation logic.

- Frontend (`/frontend`)
  - React + Vite app that displays markets, market rooms, chat, and wallet interactions.
  - Connects to blockchain via injected wallet (e.g., MetaMask) or WalletConnect for signing transactions.

- Database
  - Postgres: stores users, messages, reputation history, and off-chain market metadata.

### On-chain vs Off-chain responsibilities

- On-chain:
  - Money transfers and bet settlement.
  - Market finalization (the canonical truth).
  - Event logs used by backend for reconciliation and transparency.

- Off-chain:
  - Market discovery, UI, and metadata (titles, descriptions, tags).
  - Chat, message history, and moderation decisions (moderation can reflect on-chain penalties but does not change chain state).
  - Reputation tracking — can be on-chain or off-chain depending on product choices.
  - Oracle aggregation and signing before posting to chain.

### Market lifecycle — sequence (mermaid)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant AI
    participant DB
    participant Oracle
    participant SmartContract

    User->>Frontend: create market metadata
    Frontend->>Backend: POST /markets (metadata)
    Backend->>DB: store market draft
    Backend->>SmartContract: (optional) deploy market or emit request
    Backend-->>Frontend: 201 created (marketId)

    User->>Frontend: place bet (sign TX)
    Frontend->>SmartContract: send signed transaction
    SmartContract-->>Frontend: tx receipt
    SmartContract->>Backend: emit event (via RPC or polling)
    Backend->>DB: reconcile bet record

    Note over Competition: Market runs until resolution window

    Event: Outcome determined (off-chain evidence)
    Backend->>AI: request moderation/verification
    AI-->>Backend: classification + confidence
    Backend->>Oracle: aggregate and sign outcome (multi-sig optional)
    Oracle->>SmartContract: post outcome (signed)
    SmartContract-->>All: emits MarketSettled event
    Backend->>DB: reconcile settlement and update reputation
    Backend->>Frontend: push settlement to clients (websocket)

    User->>Frontend: claim payout (if required)
    Frontend->>SmartContract: claim tx
    SmartContract-->>Frontend: payout
```

### Data flows & reconciliation

- Always treat the blockchain as the source of truth for balances and settlements.
- Use on-chain events as triggers to update off-chain state (backend DB). Prefer a reliable event listener (websocket + polling fallback).
- Reconcile periodically: compare on-chain events with DB state and alert on inconsistencies.

### Security & integrity

- Oracle integrity: protect signing keys with HSMs or hardware wallets. Use multi-sig or multiple oracle sources to mitigate compromise.
- Private keys: never store raw private keys in repo or unsecured environment. Use environment secret stores and limit access.
- Rate limits & CAPTCHAs: mitigate bot registrations and automated spam.
- AI moderation: use confidence thresholds and human-in-the-loop adjudication for edge cases.
- Smart contract audits: required before production deployments.

### Scalability & performance

- Use caching for market discovery (CDN / Varnish) to reduce backend load.
- Partition chat by market room; consider sharding or moving to specialized real-time systems (Redis streams, socket clusters).
- Use read replicas for Postgres if read-heavy.

### Monitoring & observability

- Capture metrics: request rates, error rates, event processing lag, oracle health, on-chain tx success.
- Add alerting for mismatches between chain events and DB state.
- Log moderation actions and allow admins to review false positives.

### Deployment notes

- Docker + docker-compose for local dev (provided).
- For production: container orchestration (Kubernetes / managed services), secure secret injection, and auto-scaling.

### Appendix: recommended minimal contract interface

- createMarket(metadataHash, resolutionWindow)
- placeBet(marketId, outcome, amount)
- postOutcome(marketId, outcome, signature)
- claimPayout(marketId)

---

If you want, I can now:

1. Add a `.env.example` in `backend/` with all environment variables and comments (I will create it).
2. Start implementing a small test or add an OpenAPI spec for the backend.
3. Scaffold a Hardhat project for smart contracts with a minimal Market contract.

Tell me which to start next; I'll proceed and keep the todo list updated.
