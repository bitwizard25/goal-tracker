# Goal Tracker - Advanced Goal Management with Psychological-Based Habit Formation

A comprehensive full-stack goal tracking application built with **Remix** (frontend) and **Fastify** (backend), featuring energy-emotion tracking, SMART goal framework, habit stacking, and advanced gamification.

## Architecture

This is a monorepo with the following structure:

```
├── apps/
│   ├── frontend/        # Remix + React application
│   └── backend/         # Fastify + Node.js API server
├── packages/
│   └── shared/          # Shared TypeScript types and utilities
└── package.json         # Workspace configuration
```

## Tech Stack

### Frontend
- **Remix** - Full-stack web framework
- **React** - UI library
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Backend
- **Fastify** - High-performance web framework
- **Node.js** - Runtime
- **MongoDB** - Document database
- **Mongoose** - ODM
- **Swagger UI** - API documentation

### Shared
- **Zod** - Schema validation

## Features

### Three-Level Goal Hierarchy
- **Long-term Goals** (months to years) - Broad vision with SMART framework
- **Short-term Goals** (weeks to months) - Milestones that ladder to long-term goals
- **Daily Tasks** (recurring or one-off) - Daily activities building habits

### Psychological Features

#### 1. Energy-Emotion Dual Tracking
- Pre/post-task energy (1-10 scale)
- Pre/post-task mood (1-10 scale)
- Energy-mood state matrix (16-state system)
- Burnout risk detection

#### 2. Temporal Dynamics & Urgency
- Real-time urgency scoring
- Time-based task recommendations
- Deadline pressure simulation
- Temporal pattern analysis

#### 3. Behavioral Economics
- Loss aversion mechanics
- Sunk cost recovery
- Choice architecture optimization
- Hyperbolic discounting countermeasures

#### 4. Cognitive Science
- IF-THEN implementation intentions
- Habit stacking engine
- Contextual cue tracking
- Automaticity progression

#### 5. Self-Efficacy & Flow
- Dynamic difficulty adaptation
- Flow state detection
- Challenge-skill balance
- Confidence scoring

#### 6. Gamification
- 60+ achievement badges
- Points system with multipliers
- 50-level progression
- Streak insurance mechanism
- Emotional achievements

#### 7. Advanced Analytics
- Mood-performance correlation
- Energy-emotion patterns
- Temporal heatmaps
- Predictive recommendations
- Burnout prevention alerts

## Project Setup

### Prerequisites
- Node.js 18+ with pnpm
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd goal-tracker-monorepo
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your MongoDB connection string and other settings.

### Running Development Servers

#### Development (both frontend and backend):
```bash
pnpm dev
```

#### Frontend only (Remix dev server on port 3000):
```bash
pnpm dev:frontend
```

#### Backend only (Fastify API on port 3001):
```bash
pnpm dev:backend
```

### Building for Production

```bash
pnpm build
```

This builds both frontend and backend. Outputs:
- Frontend: `apps/frontend/build/`
- Backend: `apps/backend/dist/`

### API Documentation

When running the backend in development, Swagger UI is available at:
```
http://localhost:3001/api/docs
```

## Database Schema

The project uses MongoDB with 12 core collections:

1. **users** - User accounts and profiles
2. **long_term_goals** - Long-term objectives (months to years)
3. **short_term_goals** - Short-term milestones (weeks to months)
4. **daily_tasks** - Daily tasks and recurring activities
5. **task_completions** - Task completion records with energy-mood data
6. **streaks** - Streak tracking across multiple dimensions
7. **achievements** - Earned badges and achievements
8. **user_stats** - Daily aggregate statistics
9. **user_psychology_profile** - User psychological baseline and patterns
10. **habit_stacks** - IF-THEN habit chains
11. **energy_mood_state_matrix** - 16-state distribution analysis
12. **energy_performance_correlation** - Energy level performance metrics

## Development Roadmap

### Phase 1: Setup & Infrastructure ✓
- Monorepo structure
- Database schemas
- Basic auth foundation

### Phase 2: Authentication & User Management
- User registration/login
- Session management
- Profile setup

### Phase 3: Core Goal & Task Management
- Goal CRUD operations
- Task management APIs
- Milestone tracking

### Phase 4: Gamification Engine
- Points calculation
- Badge system
- Level progression
- Streak mechanics

### Phase 5: Energy-Emotion Tracking
- Task completion with energy-emotion data
- Energy-mood state matrix
- Pattern recognition

### Phase 6: Advanced Analytics & AI Recommendations
- Temporal analysis
- Mood-performance correlation
- Energy forecasting
- Task timing recommendations

## Scripts

```bash
# Development
pnpm dev              # Run all dev servers
pnpm dev:frontend     # Frontend only
pnpm dev:backend      # Backend only

# Building
pnpm build           # Build all apps
pnpm build:frontend  # Frontend only
pnpm build:backend   # Backend only

# Quality
pnpm lint            # Lint all projects
pnpm type-check      # Type checking

# Production
pnpm start           # Start production server
```

## Environment Variables

See `.env.example` for all required variables.

Key variables:
- `MONGODB_URI` - MongoDB connection string
- `API_PORT` - Backend server port (default: 3001)
- `CORS_ORIGIN` - Frontend origin for CORS (default: http://localhost:3000)
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm type-check`
4. Submit a pull request

## License

MIT
