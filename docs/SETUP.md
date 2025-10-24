## ETH Predictor — Setup & Run (local)

This guide walks through bringing up the project locally on Windows (PowerShell). It covers running the full stack with Docker Compose and how to run individual services for development.

Prerequisites
- Docker & Docker Compose
- Node.js (v18+ recommended) and npm
- Python 3.8+ (for `ai/` service)
- git

Quick: run everything with Docker Compose

1. Copy environment templates

```powershell
cd <repo-root>
copy backend\.env.example backend\.env
# Edit backend\.env and set secrets (PG password, RPC_URL) as needed
```

2. Start everything

```powershell
docker-compose up --build
```

This will build and start services declared in `docker-compose.yml`. Wait for services to finish initializing. The backend listens on port 5000 (see `backend/.env`). The frontend Vite server usually prints its port (often 5173).

Run services individually (for development)

- Backend (Node/TypeScript)

```powershell
cd backend
npm install
# Build once
npm run build
# Start compiled app
node dist/index.js

# OR run in dev (requires ts-node-dev):
npm install --save-dev ts-node-dev typescript
npm run dev
```

- Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```

- AI service (Python)

```powershell
cd ai
python -m venv .venv
. .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Verify services

- Backend root:

```powershell
(New-Object System.Net.WebClient).DownloadString('http://localhost:5000/')
```

- Chat endpoint (example):

```powershell
# Replace MARKETID and send JSON body
$body = '{"userId":"u1","text":"hello"}'
Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/chat/MARKETID' -Body $body -ContentType 'application/json'
```

Troubleshooting

- `DB connection not established` — Backend will run in degraded mode without Postgres. To enable DB:
  - Ensure Postgres is running (via Docker or local install).
  - Update `backend/.env` with PG credentials.
  - Create a TypeORM config (e.g., `ormconfig.json`) or set env vars used by TypeORM.

- Hedera operator errors — The code will skip operator setup if `HEDERA_OPERATOR_KEY` is missing or invalid. For production, set `HEDERA_OPERATOR_KEY` to a valid key and secure it in a secret manager.

- TypeScript compile errors — run `npm run build` in `backend/` to see tsc errors. Fix source or install missing `@types/*` packages.

Replacing shims with proper types (optional)

Currently the repo includes minimal `.d.ts` shims to allow building without installing `@types` packages. For better developer DX, install type defs:

```powershell
cd backend
npm install --save-dev @types/express @types/cors @types/body-parser @types/node
```

Then you can remove `src/types/shims.d.ts` and `src/types/express.d.ts`.

Running migrations (TypeORM)

There is a `backend/migrations` folder. If you want to use TypeORM migrations, either add an `ormconfig.json` or set up environment-driven TypeORM connection options. Example `ormconfig.json`:

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "mypassword",
  "database": "prediction_market",
  "entities": ["src/models/**/*.ts"],
  "migrations": ["migrations/*.js"],
  "cli": { "migrationsDir": "migrations" }
}
```

Then run (from `backend/`):

```powershell
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
```

Notes & next steps

- The backend currently runs in degraded mode if DB/Hedera are not configured; this is intentional for quick local iteration of chat and basic routes.
- Next recommended tasks (I can implement):
  1. Wire TypeORM entities and switch `services/db.ts` to use the database instead of an in-memory store.
  2. Add proper `@types/*` devDependencies and remove shims.
  3. Scaffold a Hardhat smart contract project and add a minimal Market contract + tests.
  4. Add CI (GitHub Actions) to run lint/build/tests.

If you'd like, I can proceed to implement one of the next steps automatically. Tell me which one to start.
