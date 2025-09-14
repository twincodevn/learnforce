# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

LearnForce is a Duolingo-style gamified learning platform built with **Next.js 15**, featuring XP systems, streaks, achievements, and interactive lessons. The application is migrated from Prisma/SQLite to **Supabase** for enhanced scalability and real-time features.

## Essential Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm start           # Start production server
npm run lint        # Run ESLint
```

### Database (Supabase)
```bash
# Test Supabase connection
curl http://localhost:3000/api/test-supabase

# Execute schema updates via Supabase SQL Editor
# Use supabase-schema.sql file for complete schema
```

### Running Single Components
- Access development server: `http://localhost:3000`
- Test individual API routes: `http://localhost:3000/api/{endpoint}`
- Dashboard: `http://localhost:3000/dashboard`
- Learning interface: `http://localhost:3000/learn`

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with credentials provider
- **State Management**: Zustand
- **UI**: Lucide React icons, Framer Motion animations
- **Form Handling**: React Hook Form + Zod validation

### Core Architecture Patterns

#### 1. **Three-Tier Gamification System**
The app implements a sophisticated gamification engine:
- **XP & Levels**: Progressive leveling with `XP_PER_LEVEL = 1000` and `XP_MULTIPLIER = 1.2`
- **Streak System**: Multi-type streaks (daily, weekly, monthly) with freeze capabilities
- **Achievement Engine**: Category-based badges (streak, xp, lessons, time, social, special) with rarity levels

#### 2. **Database Architecture**
Supabase schema with 12+ interconnected tables:
- Core entities: `users`, `subjects`, `lessons`, `user_progress`
- Gamification: `achievements`, `user_achievements`, `leaderboards`, `streaks`
- Social features: `social_features`, `notifications`
- Analytics: `daily_goals`, `user_sessions`

#### 3. **Authentication Flow**
- NextAuth.js with custom credentials provider
- Supabase admin client for server-side operations
- JWT-based sessions with custom callbacks
- Password hashing with bcryptjs

### Directory Structure Insights

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (auth, users, lessons, leaderboard)
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main user dashboard
│   └── learn/             # Learning interface
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── gamification/  # XP, levels, achievements
│   │   ├── leaderboard/   # Rankings and competition
│   │   └── lessons/       # Lesson types and UI
│   ├── layout/            # App layout components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── auth/              # NextAuth configuration
│   ├── supabase/          # Database clients and queries
│   └── utils/             # Gamification logic, helpers
└── types/                 # TypeScript definitions
```

### Critical Business Logic

#### Gamification Calculations
Located in `src/lib/utils/gamification.ts`:
- Level calculation uses exponential progression
- Streak bonuses: 3-6 days (1x), 7-13 days (2x), 14-29 days (3x), 30+ days (5x)
- Level titles: Beginner → Explorer → Adventurer → Expert → Master → Legend → Grandmaster

#### Lesson Content System
- Dynamic lesson content stored as JSONB in database
- Supported types: `multiple_choice`, `fill_blank`, `translation`, `listening`, `speaking`
- Prerequisite system for progressive learning paths

## Environment Setup

### Required Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Database Setup
1. Create Supabase project
2. Execute `supabase-schema.sql` in SQL Editor
3. Configure Row Level Security policies
4. Set up authentication triggers

## Key API Endpoints

- `POST /api/auth/register` - User registration with password hashing
- `GET /api/users/progress` - User progress and gamification data
- `POST /api/lessons/complete` - Mark lesson complete and update XP/streaks
- `GET /api/leaderboard` - Multi-period rankings (daily, weekly, monthly, all-time)
- `GET /api/achievements` - Achievement system and user badges

## Development Patterns

### Component Organization
- Feature-based component structure in `components/features/`
- Shared UI components use Tailwind CSS utility classes
- Layout components handle authentication and navigation

### State Management
- Zustand for client-side state management
- Server state handled through API routes and Supabase
- Form state managed by React Hook Form + Zod

### Database Patterns
- Server-side operations use `supabaseAdmin` client
- Client-side operations use `supabase` client with RLS
- Real-time features available via Supabase subscriptions

## Migration Status

The project is actively migrated from Prisma to Supabase:
- ✅ Database schema fully migrated
- ✅ Authentication system updated
- ✅ Core API endpoints functional
- ⏳ Real-time features in progress
- ⏳ Social features being implemented

Key migration files:
- `MIGRATION_TO_SUPABASE.md` - Complete migration guide
- `SUPABASE_SCHEMA_DOCS.md` - Database documentation
- `supabase-schema.sql` - Complete database schema

## Testing and Debugging

### Common Issues
- Supabase connection issues: Check environment variables and test with `/api/test-supabase`
- Authentication problems: Verify NextAuth configuration and user table structure
- Gamification bugs: Check XP calculations in `gamification.ts`

### Debugging Tools
- Use Supabase dashboard for database inspection
- NextAuth debug mode for authentication issues
- Browser dev tools for client-side state debugging