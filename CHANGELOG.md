# Changelog

All notable changes to the I-Goal project are documented in this file.

## [0.1.0] - 2026-04-13

### Added

#### Phase 1-2: Project Scaffold, Auth, Schema, and Strengths Framework (`72b0839`)
- Next.js 15 project scaffold with App Router and TypeScript
- NextAuth 4 authentication with credentials provider (email/password, JWT sessions)
- PostgreSQL database with Prisma 7 schema
- User, Account, Session, VerificationToken models (NextAuth standard)
- UserSubscription model with free/premium tier tracking
- StrengthDomain model (5 domains: Drive, Influence, Connection, Reasoning, Adaptability)
- StrengthTheme model (22 themes mapped to domains)
- QuestionItem model (~110 IPIP-based paired positive/negative statements)
- Database seed script for domains, themes, and questions
- Registration and login pages with Radix UI + Tailwind CSS
- Middleware protecting `/dashboard/*` and `/assessment/*` routes
- Landing page with hero, domains preview, how-it-works, and feature grid

#### Phase 3: Assessment Question-Answering UX (`cf8e17f`)
- Assessment session model tracking in-progress and completed assessments
- Balanced question selection algorithm (80 questions, min 3 per theme)
- One-question-at-a-time UI with Likert scale (1-5: SD, D, N, A, SA)
- 20-second soft timer per question with visual countdown
- Keyboard shortcuts (1-5 keys) for fast answering
- Pause/resume functionality with progress preservation
- Smooth slide transitions between questions
- Progress bar showing completion percentage
- API endpoints: `/api/assessment/start`, `/api/assessment/[sessionId]/respond`

#### Phase 4: Scoring Report and AI Narrative Generation (`61a3475`)
- Scoring engine with weighted theme scoring and reverse-scored items
- Normalization: raw (1-5) to normalized (1-100) linear mapping
- Domain score calculation (average of theme scores per domain)
- 22-theme ranking (1 = strongest)
- Percentile approximation using logistic function
- AI narrative generation using Claude or OpenAI
- Top 5 strengths report with personalized summaries, action items, and blind spots
- Domain radar chart visualization
- Full 22-theme ranking table
- Assessment completion flow with "See My Results" transition
- API endpoints: `/api/assessment/[sessionId]/complete`, `/api/results/[resultId]`
- Shareable results via public token (`/results/share/[shareToken]`)

#### Phase 5: Strengths-to-Goals Bridge and Goal Dashboard (`554a153`)
- UserGoal model linked to assessment results
- Goal creation with title, description, and strength tags
- Goal status cycling: Not Started -> In Progress -> Completed
- Goal deletion
- AI goal coaching (premium): personalized advice leveraging user's strengths
- AI goal suggestions (premium): auto-generated goals from assessment results
- Goals dashboard component with create form, status toggle, coaching panel
- API endpoints: `/api/goals` (CRUD), `/api/goals/[goalId]/coach`, `/api/goals/suggest`

#### Phase 6: Assessment History and Growth Comparison (`d228f7c`)
- Assessment history page listing all completed assessments
- Growth comparison view: side-by-side theme ranking comparison between two assessments
- Dashboard quick actions: Take Assessment, My Goals, Assessment History
- Dashboard layout with sidebar navigation
- Assessment hub showing in-progress session with resume option
- Recent assessments list on assessment page

### Fixed

- Error boundary pages for Next.js error handling (`cf11e22`)
- NextAuth error page redirect configuration (`cf11e22`)
- Question bank count comment correction from ~120 to ~110 (`db4d1ad`)

### Testing (E2E)

- Playwright E2E testing framework setup with Chromium
- **Landing Page Tests**: Hero content, 5 domains, how-it-works, CTAs, navigation, auth redirect
- **Authentication Tests**: Registration flow, duplicate email handling, login flow, invalid credentials, protected route redirects
- **Dashboard Tests**: Welcome message, quick action cards, empty state, navigation
- **Assessment Tests**: Assessment hub, start new assessment, question UI, answer progression, pause/resume, keyboard shortcuts, timer countdown
- **Goals Tests**: Empty state, create goal, status toggle, delete goal, cancel form, validation
- **History Tests**: History page, empty state, recent assessments
- **Navigation Tests**: Sidebar links, error boundary for invalid sessions/results
- **API Tests**: Registration validation, auth-required endpoint protection
- Screenshots captured at each step in `e2e/screenshots/` for UAT documentation
