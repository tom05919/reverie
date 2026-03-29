# Reverie Backend TODO

## 1. Authentication & Users
- [ ] Set up auth provider (NextAuth.js / Clerk / Supabase Auth)
- [ ] Replace hardcoded login with real credential verification
- [ ] User registration flow with email verification
- [ ] Company profile creation on signup (name, industry, size)
- [ ] Session management and JWT tokens
- [ ] Protected route middleware for `/dashboard/*` routes
- [ ] Logout endpoint that clears session

## 2. Database
- [ ] Choose and provision database (PostgreSQL recommended)
- [ ] Set up ORM (Prisma / Drizzle)
- [ ] Schema design:
  - `users` — id, email, password_hash, company_id, created_at
  - `companies` — id, name, industry, description, anonymous_alias
  - `agents` — id, company_id, status, config, system_prompt
  - `deals` — id, title, status, value, counterparty_agent_id, anonymous, created_at
  - `deal_terms` — id, deal_id, label, our_position, their_position, status
  - `interactions` — id, agent_id, counterparty_agent_id, topic, outcome, anonymous, timestamp
  - `messages` — id, interaction_id, sender_role, content, timestamp
  - `negotiations` — id, deal_id, status (active/paused/closed)
  - `negotiation_messages` — id, negotiation_id, sender, content, timestamp
  - `chat_messages` — id, user_id, agent_id, role, content, timestamp
  - `uploaded_files` — id, user_id, filename, file_type, storage_url, processed, created_at
- [ ] Seed script with realistic demo data
- [ ] Database migrations pipeline

## 3. Agent Core (LLM Integration)
- [ ] Choose LLM provider (OpenAI / Anthropic / both)
- [ ] Agent system prompt construction from company context + uploaded files
- [ ] User-to-agent chat endpoint (`POST /api/chat`) — replace mock responses with real LLM calls
- [ ] Agent memory / conversation history management
- [ ] Instruction parsing — extract negotiation parameters from user messages (price floors, concession limits, etc.)
- [ ] Structured output for deal summaries and status updates

## 4. Agent-to-Agent Negotiation Engine
- [ ] Negotiation orchestrator — manages turn-taking between two agents
- [ ] Agent goal extraction — decode company objectives into negotiation parameters
- [ ] Counterparty matching — find relevant agents/companies based on decoded intent
- [ ] Negotiation strategy module — configurable tactics (aggressive, collaborative, etc.)
- [ ] Term proposal and counter-proposal generation
- [ ] Deal closure detection — recognize when terms are agreed
- [ ] Escalation to human — trigger "pending approval" when agent reaches deal threshold
- [ ] Fairness guardrails — prevent exploitative or one-sided terms
- [ ] Malicious request filtering — detect and block bad-faith negotiation attempts

## 5. Anonymity Layer
- [ ] Anonymous alias generation for companies (e.g., "Entity-7X2", "Party Alpha")
- [ ] Identity proxy — all agent-to-agent messages strip company identifiers
- [ ] Per-deal anonymity flag stored in DB
- [ ] Reveal mechanism — option to de-anonymize after deal closure (with mutual consent)
- [ ] Audit trail — log identity access for compliance

## 6. Real-Time Communication
- [ ] WebSocket server (Socket.io / Pusher / Ably)
- [ ] Live negotiation message streaming to frontend
- [ ] Typing indicators for agent-to-agent conversations
- [ ] Agent status updates (online/negotiating/idle) pushed to dashboard
- [ ] Real-time deal status change notifications

## 7. File Processing
- [ ] File upload endpoint (`POST /api/files`)
- [ ] Cloud storage integration (S3 / Cloudflare R2)
- [ ] Document parsing pipeline:
  - PDF text extraction
  - DOCX parsing
  - CSV structured data ingestion
- [ ] Feed parsed content into agent context / RAG pipeline
- [ ] File metadata storage in DB
- [ ] File size and type validation

## 8. API Routes (Replace Mocks)
- [ ] `GET /api/deals` — fetch user's deals from DB
- [ ] `GET /api/deals/[id]` — fetch single deal with terms, timeline, strategy notes
- [ ] `POST /api/deals/[id]/approve` — human approves a pending deal
- [ ] `POST /api/deals/[id]/reject` — human rejects a deal
- [ ] `POST /api/deals/[id]/counter` — human sends counter-offer instructions
- [ ] `GET /api/interactions` — fetch interaction history
- [ ] `GET /api/conversations` — fetch live negotiation threads
- [ ] `POST /api/chat` — send message to agent, get LLM response
- [ ] `GET /api/chat` — fetch chat history
- [ ] `GET /api/activity` — fetch activity feed for dashboard
- [ ] `POST /api/files` — upload file
- [ ] `GET /api/agent/status` — get agent status

## 9. Security
- [ ] Rate limiting on all API routes
- [ ] Input sanitization and validation (zod schemas)
- [ ] CORS configuration
- [ ] API key management for LLM providers (env vars, secret manager)
- [ ] Data encryption at rest for sensitive deal terms
- [ ] Request authentication middleware on all protected routes
- [ ] Audit logging for deal actions (approve/reject/counter)

## 10. Deployment
- [ ] Dockerize the application
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment variable management (dev / staging / prod)
- [ ] Database hosting (Neon / Supabase / RDS)
- [ ] Deploy to Vercel / Railway / Fly.io
- [ ] Monitoring and error tracking (Sentry)
- [ ] Uptime monitoring

## Priority Order
1. **Auth + Database** — foundation for everything else
2. **API routes (replace mocks)** — make the existing UI real
3. **Agent core (LLM chat)** — user-to-agent conversation
4. **File processing** — context ingestion
5. **Agent-to-agent negotiation** — the core product
6. **Anonymity layer** — identity protection
7. **Real-time communication** — live updates
8. **Security hardening** — production readiness
9. **Deployment** — go live
