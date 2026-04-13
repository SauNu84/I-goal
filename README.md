# I-Goal

AI-powered strengths assessment and goal-setting application. Discover your top 5 strengths through scientifically-grounded questions, then set goals that leverage your natural talents.

## Features

- **Strengths Assessment**: 80-question assessment based on Big Five (OCEAN) personality science and IPIP public-domain items
- **22 Strength Themes**: Mapped across 5 domains — Drive, Influence, Connection, Reasoning, Adaptability
- **AI-Personalized Reports**: Claude or OpenAI generates unique narratives for your Top 5 strengths
- **Goal Setting**: Create goals linked to your strengths with AI coaching support
- **Growth Tracking**: Retake assessments and compare results over time
- **Shareable Results**: Public share links for coaches, mentors, or teams

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Auth**: NextAuth 4 (Credentials provider, JWT sessions)
- **Database**: PostgreSQL + Prisma 7
- **UI**: React 18 + Radix UI + Tailwind CSS 4
- **AI**: Anthropic SDK / OpenAI SDK (pluggable)
- **E2E Tests**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- An AI provider API key (OpenAI or Anthropic)

### Setup

```bash
# Clone the repository
git clone https://github.com/SauNu84/I-goal.git
cd i-goal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL, NextAuth secret, and AI API key

# Run database migrations
npx prisma migrate dev

# Seed the strengths framework (domains, themes, questions)
npm run db:seed

# Generate Prisma client
npm run db:generate

# Start the development server
npm run dev
```

Visit http://localhost:3000 to use the application.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL (e.g., `http://localhost:3000`) | Yes |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | Yes |
| `AI_PROVIDER` | `openai`, `anthropic`, or `lmstudio` | Yes |
| `OPENAI_API_KEY` | OpenAI API key (when `AI_PROVIDER=openai`) | Conditional |
| `ANTHROPIC_API_KEY` | Anthropic API key (when `AI_PROVIDER=anthropic`) | Conditional |

## Project Structure

```
src/
  app/
    (auth)/                  # Login and registration pages
    (dashboard)/             # Protected dashboard routes
      dashboard/             # Main dashboard
        assessment/          # Assessment hub (start/resume)
        goals/               # Goals management
        history/             # Assessment history and comparison
          compare/           # Growth comparison view
    assessment/[sessionId]/  # Assessment question-answering UI
    results/
      [resultId]/            # Full results report (auth required)
      share/[shareToken]/    # Public shareable results
    admin/strengths/         # Debug view for domains/themes/questions
    api/
      auth/                  # NextAuth + registration endpoints
      assessment/            # Start, respond, complete endpoints
      goals/                 # CRUD + AI coaching + suggestions
      results/               # Results fetch + sharing
  components/                # React components
  lib/                       # Core logic (auth, scoring, AI, tier)
prisma/
  schema.prisma              # Database schema
  seed.ts                    # Seed script for strengths framework
e2e/                         # Playwright E2E tests
```

## User Flows

### 1. New User Registration and First Assessment

1. Register at `/register` (name, email, password)
2. Redirected to `/dashboard`
3. Click "Take Assessment" to go to `/dashboard/assessment`
4. Click "Begin Assessment" to start the 80-question flow
5. Answer questions one at a time using Likert scale (1-5)
6. Complete assessment and view personalized results
7. Create goals from results page

### 2. Assessment Experience

- One question at a time with 20-second soft timer
- Keyboard shortcuts: press 1-5 to answer quickly
- Pause and resume at any time
- Progress bar shows completion percentage

### 3. Goal Management

- Create goals manually or let AI suggest goals based on your strengths
- Tag goals with relevant strengths
- Toggle status: Not Started -> In Progress -> Completed
- Get AI coaching on how to achieve goals using your strengths

### 4. Growth Tracking

- Retake assessments to track development over time
- Compare two assessments side-by-side
- See how your theme rankings have shifted

## Tier System

| Feature | Free | Premium |
|---------|------|---------|
| Assessments per month | 2 | Unlimited |
| Top 5 Strengths Report | Basic | AI-generated narrative |
| Full 22-Theme Ranking | Yes | Yes |
| Goal Creation | Yes | Yes |
| AI Goal Coaching | No | Yes |
| AI Goal Suggestions | No | Yes |
| Growth Comparison | No | Yes |
| Share Results | Yes | Yes |

## E2E Testing

The project includes comprehensive Playwright E2E tests covering all critical user flows.

### Running E2E Tests

```bash
# Ensure the dev server is running
npm run dev

# Run all E2E tests
npm run test:e2e

# Run tests with browser visible
npm run test:e2e:headed

# Run tests with Playwright UI mode
npm run test:e2e:ui

# View test report
npm run test:e2e:report
```

### Test Coverage

| Test Suite | File | Covers |
|------------|------|--------|
| Landing Page | `e2e/01-landing-page.spec.ts` | Hero, domains, CTAs, navigation, auth redirect |
| Authentication | `e2e/02-auth.spec.ts` | Registration, login, error handling, protected routes |
| Dashboard | `e2e/03-dashboard.spec.ts` | Welcome message, quick actions, empty state, navigation |
| Assessment | `e2e/04-assessment.spec.ts` | Start, question UI, pause/resume, keyboard, timer, completion |
| Goals | `e2e/05-goals.spec.ts` | Create, status toggle, delete, cancel, validation |
| History | `e2e/06-history.spec.ts` | History page, empty state, recent assessments |
| Navigation | `e2e/07-navigation.spec.ts` | Sidebar navigation, error boundary handling |
| API | `e2e/08-api.spec.ts` | Registration API validation, auth-required endpoints |

### Screenshots

E2E tests capture screenshots at each step for UAT documentation. Screenshots are saved to `e2e/screenshots/` with descriptive filenames.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed strengths framework data |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:headed` | Run E2E tests with browser visible |
| `npm run test:e2e:ui` | Run E2E tests in UI mode |
| `npm run test:e2e:report` | View HTML test report |

## Strengths Framework

Built on the Big Five (OCEAN) model with 5 domains, 22 themes, and ~110 IPIP-based question items:

| Domain | Mapped To | Themes |
|--------|-----------|--------|
| **Drive** | Conscientiousness | Execution, persistence, discipline themes |
| **Influence** | Extraversion | Leadership, persuasion, communication themes |
| **Connection** | Agreeableness | Empathy, trust, relationship themes |
| **Reasoning** | Openness | Creativity, curiosity, intellectual themes |
| **Adaptability** | Emotional Stability | Resilience, composure, flexibility themes |

## License

Private project.
