## ETH Predictor

> ETH Predictor is a decentralized, trustless prediction market platform where users can create and participate in binary outcome markets, interact in real-time chat, earn reputation for accurate predictions, and safely avoid bots and fake accounts. It uses smart contracts, an oracle bridge, off-chain services, and AI-powered moderation to ensure fairness and transparency.

---

## Key features

- Create and participate in binary (Yes/No) markets backed by smart contracts.
- Real-time market rooms with chat and moderation.
- Reputation system that rewards accurate predictors.
- AI-based moderation and bot detection to reduce spam and fake accounts.
- Oracle bridge for trustless on-chain settlement.
- Docker-based local development environment.

## Repository layout

- `backend/` — Node + TypeScript backend (API, websocket chat, database models, oracle & integrations).
- `frontend/` — React + Vite frontend (market UI, chat, wallet integration).
- `ai/` — small AI service for moderation and bot detection.
- `docker-compose.yml`, `Dockerfile` — orchestration for local dev.

## Architecture (high-level)

- Smart contracts (Ethereum-compatible): market creation, staking, settlement.
- Oracle: signs and posts final market outcomes on-chain.
- Backend: REST + websockets, stores messages/reputation in Postgres, integrates with AI service, and runs oracle logic.
- AI service: content moderation and bot detection endpoints used by the backend.
- Frontend: market discovery, market room, chat, and wallet interactions.

Security & trust model

- On-chain settlement is final — always reconcile backend state with chain events.
- Oracle integrity is crucial: prefer multi-sig or multiple data sources and dispute flows.
- Secrets (private keys, API keys) must never be committed to the repo; use environment-level secret stores.

## Quickstart — running locally (Windows PowerShell)

1. Copy or edit `backend/.env` and set any secrets you need. The repo contains example placeholders; keep secrets out of version control.

2. From the repository root run Docker Compose to build and start all services:

```powershell
docker-compose up --build
```

This will build and start services declared in `docker-compose.yml`. Expect services like Postgres, backend, ai, and frontend to start. The backend listens on port 5000 by default (see `backend/.env`). The frontend is served by Vite (likely at http://localhost:5173).

If you prefer to run services individually (for development):

- Backend (from `backend/`):

```powershell
cd backend
# install deps if needed
npm install
npm run dev
```

- Frontend (from `frontend/`):

```powershell
cd frontend
npm install
npm run dev
```

- AI service (from `ai/`):

```powershell
cd ai
# python venv recommended
pip install -r requirements.txt
python app.py
```

## Environment variables (examples)

The `backend/.env` in the repository provides the variables the backend expects; key ones include:

- `PORT` — backend port (default 5000)
- `AI_SERVICE_URL` — URL for AI moderation (e.g. `http://ai:5000/classify`)
- Postgres: `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DB`
- Hedera placeholders: `HEDERA_NETWORK`, `HEDERA_OPERATOR_ID`, `HEDERA_OPERATOR_KEY`
- `ENVOI_API_KEY`, `ENVOI_WEBHOOK_SECRET` — placeholders for sponsor integration
- Ethereum: `RPC_URL`, `PRIVATE_KEY` — for oracle bridge signing

IMPORTANT: do NOT commit real private keys or production API keys. Use environment variables in CI and secret managers in production.

## Developer notes

- Backend API conventions: REST endpoints for markets and websocket for chat. See `backend/src/controllers` and `backend/src/routes`.
- Database migrations are stored under `backend/migrations`.
- Frontend components are in `frontend/src/components` and pages in `frontend/src/pages`.

## Testing & verification (recommended)

- Unit tests for backend controllers and services. Add test runner & CI to run tests on PRs.
- Integration tests using a local Ethereum testchain (Hardhat) to validate contract flows and the oracle.
- E2E tests for chat + reputation flows to verify moderation and reputation changes.

## Recommended next steps

1. Add an architecture summary document with diagrams for the oracle, contract flows, and data synchronization.
2. Add OpenAPI spec for backend endpoints.
3. Add a small Hardhat project for smart contracts and sample tests.
4. Add CI (GitHub Actions) to run lint, tests, and avoid secret leakage.

## Contact & contributing

If you'd like me to continue, I can:

- Expand the architecture doc and include sequence diagrams.
- Extract and enumerate all required environment variables into a `.env.example`.
- Add CI and a basic test for one backend controller.

Pick the next task and I'll start it.

---

Generated on: October 24, 2025

# Social Prediction Market

This project is a social prediction market application.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS