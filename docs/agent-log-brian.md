# Agent Log - Brian

## 2026-03-29: Implemented Agent Negotiation Backend

Built the full backend infrastructure for interactive two-agent negotiation demos:

- **Dependencies**: Added `ai` and `@ai-sdk/openai` packages
- **Types**: Extended `lib/types.ts` with `NegotiationAgentConfig` and `NegotiationScenario`
- **LLM Layer**: Created `lib/llm/client.ts` wrapping the Vercel AI SDK with `generateAgentMessage()` and `classifyText()`
- **Negotiation Engine** (`lib/negotiation/`):
  - `agents.ts` - System prompt builder from agent config
  - `sessions.ts` - In-memory session store with SSE listener support
  - `completion.ts` - Deal agreement/stalemate detection (heuristic + LLM fallback)
  - `orchestrator.ts` - Turn-taking engine with `executeNextTurn()` and `runNegotiation()`
  - `scenarios.ts` - Three preset demo scenarios matching existing mock deals
- **API Routes** (`app/api/negotiations/`):
  - `POST /api/negotiations` - Create session from scenario
  - `GET /api/negotiations` - List sessions + scenarios
  - `GET /api/negotiations/[id]` - Get session state
  - `POST /api/negotiations/[id]/step` - Execute single turn
  - `POST /api/negotiations/[id]/run` - Auto-run negotiation
  - `POST /api/negotiations/[id]/pause` - Toggle pause/resume
  - `GET /api/negotiations/[id]/stream` - SSE real-time stream
- **Bridge**: Updated `app/api/conversations/route.ts` to merge real sessions with mock data
- **Config**: Created `.env.local` placeholder for `OPENAI_API_KEY`

## 2026-03-29: Frontend Integration for Negotiation Engine

Connected the frontend to the new negotiation backend APIs:

- **Hooks** (`lib/hooks/use-negotiations.ts`):
  - `useNegotiations()` — fetches sessions + scenarios from `GET /api/negotiations`, exposes `createSession()` for launching new scenarios
  - `useNegotiationStream()` — connects to SSE stream at `/api/negotiations/[id]/stream` for real-time message updates, exposes `step()`, `run()`, and `togglePause()` controls
- **Live Page rewrite** (`app/(dashboard)/live/page.tsx`):
  - Replaced static mock data import with API-driven state
  - Added scenario picker dialog to create new negotiation sessions from the three preset demos
  - Per-session controls: Step (single turn), Auto-run (continuous), Pause/Resume
  - Real-time message streaming via SSE with auto-scroll
  - Empty state with CTA when no sessions exist
  - Active/paused session count badges in header
- **Dashboard** (`app/(dashboard)/dashboard/`):
  - Added `LiveNegotiationsStat` client component that fetches live session count from API
  - New stat card in dashboard grid linking to Live page with active count
  - Grid updated from 4-col to 5-col to accommodate
- **Sidebar** (`components/sidebar.tsx`):
  - Live nav item now shows dynamic active session count badge (polls every 10s)
  - Agent status auto-switches to "Negotiating" when sessions are active
  - Replaced static pulse dot with count indicator

## 2026-03-29: Custom Contract Negotiation (Describe-and-Negotiate)

Added the ability to describe any contract in natural language and have the system generate opposing agents and negotiate it live:

- **Scenario Generator** (`lib/negotiation/generate-scenario.ts`):
  - `generateScenarioFromPrompt(prompt)` — sends the user's description to Claude, which generates a full `NegotiationScenario` with two agent configs, realistic constraints, and overlapping price ranges so deals are possible
  - Robust validation of LLM output into typed `NegotiationAgentConfig` structs
- **API** (`app/api/negotiations/route.ts`):
  - `POST /api/negotiations` now accepts either `{ scenario: "preset-id" }` or `{ prompt: "describe your deal" }`
  - Custom prompts generate scenarios via LLM, then create sessions identically to presets
  - Error handling for LLM failures with user-facing messages
- **Hook** (`lib/hooks/use-negotiations.ts`):
  - Added `createFromPrompt(prompt)` alongside existing `createSession(scenarioId)`
- **UI** (`app/(dashboard)/live/page.tsx`):
  - Redesigned dialog: textarea input front-and-center for custom descriptions, "Generate & Start" button
  - Preset scenarios moved below a separator as quick-start options
  - Loading state with spinner while scenario generates
  - Error display if generation fails

## 2026-03-29: Replaced LLM with Simulation Engine (no API key needed)

Removed all LLM dependencies from the negotiation flow so everything works offline:

- **Simulator** (`lib/negotiation/simulator.ts`):
  - `generateSimulatedMessage()` produces realistic negotiation messages based on agent config, turn index, and negotiation phase (opening → exploration → counter → concession → closing)
  - References actual price constraints, objectives, and must-haves from the agent config
  - Varies tone by negotiation style (collaborative/aggressive/balanced)
  - Closing phase triggers agreement patterns that the completion detector recognizes
- **Prompt-to-Scenario Parser** (`lib/negotiation/generate-scenario.ts`):
  - Rewrote to parse user prompts locally — extracts prices, durations, quantities, buyer/seller role
  - Generates realistic counterparty company + agent names
  - Builds conflicting-but-overlapping constraints so deals are possible
  - No LLM call required
- **Orchestrator** (`lib/negotiation/orchestrator.ts`):
  - Now calls `generateSimulatedMessage()` instead of `generateAgentMessage()` (LLM)
  - Removed all `@/lib/llm/client` imports
- **Completion Detection** (`lib/negotiation/completion.ts`):
  - Removed LLM classification fallback — heuristic pattern matching only
  - Added more agreement patterns to catch simulator's closing messages

## 2026-03-29: Negotiation Completion UI

Added a distinct "completed" status so the UI clearly signals when agents finish negotiating (deal or stalemate), rather than just showing "Paused":

- **Types** (`lib/types.ts`):
  - `LiveNegotiation.status` now includes `"completed"` alongside `"active" | "paused"`
  - Added optional `outcome?: "agreed" | "stalemate"` field
- **Sessions** (`lib/negotiation/sessions.ts`):
  - Added `outcome` field to `NegotiationSession`
  - New `completeSession(sessionId, outcome)` helper — sets status + outcome and emits a `complete` SSE event
  - `sessionToLiveNegotiation` now passes through `"completed"` status and outcome (previously mapped to `"paused"`)
- **Orchestrator** (`lib/negotiation/orchestrator.ts`):
  - Replaced `updateStatus(id, "completed")` with `completeSession(id, outcome)` to carry the outcome through
  - Max-turns exhaustion now results in `"stalemate"` outcome
- **SSE Stream** (`app/api/negotiations/[id]/stream/route.ts`):
  - `init` event now includes `outcome` field for clients connecting to already-completed sessions
- **Hook** (`lib/hooks/use-negotiations.ts`):
  - Status type widened to include `"completed"`
  - Removed the `completed → paused` mapping in `init` and `status` event handlers
  - New `complete` event listener sets both status and outcome
  - Exposes `outcome` from the hook
- **Live Page** (`app/(dashboard)/live/page.tsx`):
  - Status badge: green "Deal Reached" for agreed, red "Stalemate" for stalemate
  - Completion banner replaces playback controls when negotiation ends:
    - **Agreed**: green banner with "Approve Deal" / "Reject" buttons (no-ops for now)
    - **Stalemate**: red banner with "Start New Negotiation" button
  - Header now shows "done" count badge alongside active/paused

## 2026-03-29: Deal Terms Review & Approval

When agents agree on a deal, the system now generates a structured terms document and presents it for human approval:

- **Types** (`lib/types.ts`):
  - Added `DealSummaryTerm`, `DealSummary`, and `DealApproval` types
  - `LiveNegotiation` now carries optional `dealSummary` and `approval` fields
- **Terms Extraction** (`lib/negotiation/extract-terms.ts`):
  - New module that analyzes negotiation messages + agent configs to produce a structured `DealSummary`
  - Extracts agreed price (last price mentioned in conversation, or inferred midpoint from constraints)
  - Builds term lines from both agents' must-haves and objectives
  - Detects contract duration, payment terms, and percentages from message text
  - Generates a natural-language summary paragraph
- **Sessions** (`lib/negotiation/sessions.ts`):
  - Added `dealSummary` and `approval` fields to `NegotiationSession`
  - `completeSession()` now accepts and stores an optional `DealSummary`
  - New `setApproval()` function to update approval status and emit an `approval` SSE event
  - `sessionToLiveNegotiation()` passes through `dealSummary` and `approval`
- **Orchestrator** (`lib/negotiation/orchestrator.ts`):
  - On `"agreed"` outcome, calls `extractDealSummary()` and passes the result to `completeSession()`
- **SSE** (`app/api/negotiations/[id]/stream/route.ts`):
  - `init` event now includes `dealSummary` and `approval` for reconnecting clients
- **API** (`app/api/negotiations/[id]/approve/route.ts`):
  - New `POST` endpoint accepting `{ action: "approved" | "rejected" }`
  - Validates the session is completed with `"agreed"` outcome before allowing approval
- **Hook** (`lib/hooks/use-negotiations.ts`):
  - Tracks `dealSummary` and `approval` state from SSE events (`complete`, `approval`, `init`)
  - Exposes `approveDeal()` and `rejectDeal()` actions
- **UI** (`app/(dashboard)/live/page.tsx`):
  - New `DealReviewPanel` component replaces the simple banner when a deal is reached:
    - Header showing deal title and counterparty
    - Highlighted agreed price section
    - Natural-language summary paragraph
    - Collapsible terms list with color-coded party indicators (mutual/ours/theirs)
    - Approve/Reject buttons that hit the API
    - Post-decision confirmation message with approval status badge

## 2026-03-29: Cross-Page Data Integration

Connected the Deals, Dashboard, Interactions, and deal detail pages to reflect live negotiation results (previously all used static mock data only):

- **Bridge Layer** (`lib/negotiation/bridge.ts`):
  - Converts `NegotiationSession` → `Deal` (with inferred value, status mapping, terms, timeline)
  - Converts `NegotiationSession` → `Interaction` (with message history and outcome)
  - Converts `NegotiationSession` → `ActivityItem[]` (start, completion, approval events)
  - Helper functions: `getDealsFromSessions()`, `getInteractionsFromSessions()`, `getActivityFromSessions()`
- **New API Endpoints**:
  - `GET /api/deals` — merges mock deals + real negotiation-derived deals, sorted by last activity
  - `GET /api/activity` — merges mock activity feed + real negotiation events, sorted by timestamp
  - `GET /api/interactions` — merges mock interactions + real negotiation conversations, sorted by timestamp
- **Deals Page** (`app/(dashboard)/deals/page.tsx`):
  - Converted to client component fetching from `/api/deals`
  - Now shows negotiation-derived deals alongside mock data with loading state
- **Deal Detail Page** (`app/(dashboard)/deals/[id]/page.tsx`):
  - Converted to client component fetching from `/api/deals`
  - Approve/Reject buttons now call `/api/negotiations/[id]/approve` and update status in real time
  - Shows "Deal Approved" or "Deal Rejected" card after decision
- **Dashboard** (`app/(dashboard)/dashboard/page.tsx`):
  - Converted to client component fetching from `/api/deals` and `/api/activity`
  - Stats now computed from real data (active deals count, win rate, total value)
  - Activity feed shows real negotiation events
- **Interactions Page** (`app/(dashboard)/interactions/page.tsx`):
  - Converted to client component fetching from `/api/interactions`
  - Completed negotiations appear as searchable interactions with full message history
