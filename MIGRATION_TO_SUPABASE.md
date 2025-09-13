# Migration Guide: Prisma to Supabase

## Overview
This guide will help you migrate your LearnForce application from the current Prisma + SQLite setup to Supabase for better scalability, real-time features, and enhanced functionality.

## Prerequisites
- Supabase account (free tier available)
- Current LearnForce application running
- Data export capabilities

## Step 1: Set Up Supabase Project

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project:
   - **Name**: `learnforce-production`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

### 1.2 Get Project Credentials
1. Go to Project Settings → API
2. Copy the following:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJ...` (public key)
   - **Service Role Key**: `eyJ...` (private key)

## Step 2: Install Supabase Dependencies

```bash
npm install @supabase/supabase-js
npm uninstall prisma @prisma/client @next-auth/prisma-adapter
```

## Step 3: Set Up Environment Variables

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth (update for Supabase)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## Step 4: Create Supabase Client

Create `src/lib/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Create `src/lib/supabase/server.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
```

## Step 5: Execute Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire `supabase-schema.sql` file
4. Click "Run" to execute the schema

## Step 6: Update Authentication

### 6.1 Install Supabase Auth Helpers
```bash
npm install @supabase/auth-helpers-nextjs
```

### 6.2 Update NextAuth Configuration

Replace `src/lib/auth/config.ts`:
```typescript
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabaseAdmin } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error || !user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.full_name,
          image: user.avatar_url,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}
```

## Step 7: Update API Routes

### 7.1 User Registration API

Update `src/app/api/auth/register/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, password } = await request.json()

    // Validate required fields
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        full_name: name,
        username,
        email,
        password: hashedPassword,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### 7.2 User Progress API

Update `src/app/api/users/progress/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get user data with progress
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        user_progress (
          *,
          subject:subjects (*),
          lesson:lessons (*)
        ),
        user_achievements (
          *,
          achievement:achievements (*)
        )
      `)
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Calculate additional stats
    const totalXp = user.xp
    const totalLessons = user.total_lessons_completed
    const totalTime = user.total_time_spent_minutes
    const currentStreak = user.current_streak

    // Get weekly and monthly XP
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const { data: weeklyProgress } = await supabaseAdmin
      .from('user_progress')
      .select('xp_earned')
      .eq('user_id', userId)
      .gte('created_at', oneWeekAgo.toISOString())

    const { data: monthlyProgress } = await supabaseAdmin
      .from('user_progress')
      .select('xp_earned')
      .eq('user_id', userId)
      .gte('created_at', oneMonthAgo.toISOString())

    const weeklyXp = weeklyProgress?.reduce((sum, p) => sum + (p.xp_earned || 0), 0) || 0
    const monthlyXp = monthlyProgress?.reduce((sum, p) => sum + (p.xp_earned || 0), 0) || 0

    const progressData = {
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        image: user.avatar_url,
      },
      stats: {
        totalXp,
        level: user.level,
        currentStreak,
        totalLessons,
        totalTime,
        weeklyXp,
        monthlyXp,
      },
      progress: user.user_progress || [],
      achievements: user.user_achievements || [],
    }

    return NextResponse.json(progressData)
  } catch (error) {
    console.error("Error fetching user progress:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
```

## Step 8: Update Components

### 8.1 Replace Prisma with Supabase

Create `src/lib/supabase/queries.ts`:
```typescript
import { supabaseAdmin } from './server'

export const getUserProgress = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select(`
      *,
      user_progress (
        *,
        subject:subjects (*),
        lesson:lessons (*)
      )
    `)
    .eq('id', userId)
    .single()

  return { data, error }
}

export const getLeaderboard = async (period: string, limit: number = 10) => {
  const { data, error } = await supabaseAdmin
    .from('leaderboards')
    .select(`
      *,
      user:users (username, full_name, avatar_url)
    `)
    .eq('period', period)
    .order('rank')
    .limit(limit)

  return { data, error }
}

export const completeLesson = async (
  userId: string,
  lessonId: string,
  score: number,
  timeSpent: number
) => {
  // Get lesson details
  const { data: lesson, error: lessonError } = await supabaseAdmin
    .from('lessons')
    .select('*, subject:subjects (*)')
    .eq('id', lessonId)
    .single()

  if (lessonError || !lesson) {
    throw new Error('Lesson not found')
  }

  // Calculate XP
  const baseXp = Math.floor(lesson.xp_reward * (score / 100))
  const totalXpEarned = baseXp

  // Update user progress
  const { error: progressError } = await supabaseAdmin
    .from('user_progress')
    .upsert({
      user_id: userId,
      subject_id: lesson.subject_id,
      lesson_id: lessonId,
      is_completed: true,
      score,
      time_spent_seconds: timeSpent,
      xp_earned: totalXpEarned,
      completed_at: new Date().toISOString(),
    })

  if (progressError) {
    throw progressError
  }

  // Update user stats
  const { error: userError } = await supabaseAdmin
    .from('users')
    .update({
      xp: supabaseAdmin.raw('xp + ?', [totalXpEarned]),
      total_lessons_completed: supabaseAdmin.raw('total_lessons_completed + 1'),
      total_time_spent_minutes: supabaseAdmin.raw('total_time_spent_minutes + ?', [Math.floor(timeSpent / 60)]),
      last_active_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (userError) {
    throw userError
  }

  return { xpEarned: totalXpEarned }
}
```

## Step 9: Data Migration

### 9.1 Export Current Data
```bash
# Export from SQLite
sqlite3 dev.db ".dump" > data_export.sql
```

### 9.2 Transform and Import Data
Create a migration script `migrate-data.js`:
```javascript
const { createClient } = require('@supabase/supabase-js')
const sqlite3 = require('sqlite3').verbose()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Connect to SQLite
const db = new sqlite3.Database('./dev.db')

// Migrate users
db.all("SELECT * FROM users", async (err, rows) => {
  for (const user of rows) {
    await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.name,
      xp: user.xp,
      level: user.level,
      current_streak: user.streak,
      longest_streak: user.streak, // Assuming same for now
      total_lessons_completed: user.totalLessons,
      total_time_spent_minutes: user.totalTime,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    })
  }
})

// Continue for other tables...
```

## Step 10: Testing

### 10.1 Test Authentication
1. Start the development server
2. Try registering a new user
3. Test login functionality
4. Verify session persistence

### 10.2 Test Core Features
1. Navigate to dashboard
2. Check leaderboard data
3. Test lesson completion
4. Verify XP and level updates

### 10.3 Test Real-time Features
1. Open multiple browser tabs
2. Complete a lesson in one tab
3. Verify updates appear in other tabs

## Step 11: Deployment

### 11.1 Update Environment Variables
Set production environment variables in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### 11.2 Deploy Application
Deploy your updated application to Vercel, Netlify, or your preferred platform.

## Benefits After Migration

### ✅ **Enhanced Features**
- Real-time updates across all users
- Advanced social features
- Better performance and scalability
- Built-in authentication
- File storage for avatars and content

### ✅ **Developer Experience**
- Better TypeScript support
- Real-time subscriptions
- Edge functions for complex logic
- Built-in analytics

### ✅ **Production Ready**
- Automatic backups
- Global CDN
- Advanced security features
- Monitoring and logging

## Troubleshooting

### Common Issues
1. **RLS Policies**: Ensure Row Level Security policies are correctly set
2. **CORS**: Configure CORS settings in Supabase dashboard
3. **Rate Limits**: Monitor API usage in Supabase dashboard
4. **Data Types**: Ensure data types match between Prisma and Supabase

### Support
- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
- Community Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: [github.com/supabase/supabase](https://github.com/supabase/supabase)

This migration will significantly enhance your LearnForce application with modern features and better scalability! 🚀
