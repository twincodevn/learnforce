# LearnForce Supabase Database Schema Documentation

## Overview
This comprehensive database schema is designed for a Duolingo-style learning platform with advanced gamification, social features, and progress tracking capabilities.

## Database Architecture

### Core Tables

#### 1. **users** - User Profiles & Gamification
```sql
- id: UUID (Primary Key)
- email: VARCHAR(255) UNIQUE
- username: VARCHAR(50) UNIQUE
- full_name: VARCHAR(100)
- avatar_url: TEXT
- bio: TEXT
- xp: INTEGER (Experience Points)
- level: INTEGER (User Level)
- current_streak: INTEGER (Current Learning Streak)
- longest_streak: INTEGER (Best Streak Ever)
- total_lessons_completed: INTEGER
- total_time_spent_minutes: INTEGER
- daily_goal_minutes: INTEGER (User's Daily Target)
- timezone: VARCHAR(50)
- language_preference: VARCHAR(10)
- last_active_at: TIMESTAMP
- is_premium: BOOLEAN
- is_active: BOOLEAN
```

#### 2. **subjects** - Learning Categories
```sql
- id: UUID (Primary Key)
- name: VARCHAR(100) (e.g., "JavaScript Fundamentals")
- slug: VARCHAR(100) UNIQUE (URL-friendly identifier)
- description: TEXT
- icon_url: TEXT
- color_hex: VARCHAR(7) (Theme Color)
- difficulty_level: INTEGER (1-5)
- total_lessons: INTEGER
- estimated_hours: DECIMAL(4,1)
- category: VARCHAR(50) (programming, language, business)
- order_index: INTEGER
- is_active: BOOLEAN
- tags: TEXT[] (Array of tags)
```

#### 3. **lessons** - Individual Learning Units
```sql
- id: UUID (Primary Key)
- subject_id: UUID (Foreign Key to subjects)
- title: VARCHAR(200)
- slug: VARCHAR(200)
- description: TEXT
- content: JSONB (Flexible lesson content)
- lesson_type: VARCHAR(50) (multiple_choice, fill_blank, translation)
- difficulty_level: INTEGER (1-5)
- xp_reward: INTEGER (XP earned for completion)
- time_estimate_minutes: INTEGER
- order_index: INTEGER
- is_active: BOOLEAN
- is_premium: BOOLEAN
- prerequisite_lesson_ids: UUID[] (Array of required lessons)
```

#### 4. **user_progress** - Learning Progress Tracking
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- subject_id: UUID (Foreign Key to subjects)
- lesson_id: UUID (Foreign Key to lessons)
- is_completed: BOOLEAN
- score: INTEGER (0-100)
- time_spent_seconds: INTEGER
- attempts: INTEGER
- xp_earned: INTEGER
- streak_bonus: INTEGER
- started_at: TIMESTAMP
- completed_at: TIMESTAMP
- last_attempt_at: TIMESTAMP
```

#### 5. **achievements** - Badges & Milestones
```sql
- id: UUID (Primary Key)
- name: VARCHAR(100)
- description: TEXT
- icon_url: TEXT
- category: VARCHAR(50) (streak, xp, lessons, time, social, special)
- requirement_type: VARCHAR(50) (count, consecutive, score, time)
- requirement_value: INTEGER
- xp_reward: INTEGER
- badge_rarity: VARCHAR(20) (common, rare, epic, legendary)
- is_active: BOOLEAN
- is_hidden: BOOLEAN (Hidden until unlocked)
```

#### 6. **user_achievements** - User's Earned Achievements
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- achievement_id: UUID (Foreign Key to achievements)
- progress_value: INTEGER (Current progress toward requirement)
- is_unlocked: BOOLEAN
- unlocked_at: TIMESTAMP
```

#### 7. **leaderboards** - Ranking System
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- period: VARCHAR(20) (daily, weekly, monthly, all_time)
- xp: INTEGER
- level: INTEGER
- streak: INTEGER
- lessons_completed: INTEGER
- rank: INTEGER
- percentile: DECIMAL(5,2)
- period_start: TIMESTAMP
- period_end: TIMESTAMP
```

#### 8. **daily_goals** - Daily Learning Targets
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- date: DATE
- target_minutes: INTEGER
- target_lessons: INTEGER
- target_xp: INTEGER
- completed_minutes: INTEGER
- completed_lessons: INTEGER
- earned_xp: INTEGER
- is_achieved: BOOLEAN
- achievement_percentage: DECIMAL(5,2)
```

#### 9. **streaks** - Streak Tracking
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- streak_type: VARCHAR(50) (daily_learning, weekly_goal, monthly_goal)
- current_count: INTEGER
- longest_count: INTEGER
- last_activity_date: DATE
- freeze_count: INTEGER
- is_active: BOOLEAN
```

#### 10. **social_features** - Friends & Social Connections
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- target_user_id: UUID (Foreign Key to users)
- relationship_type: VARCHAR(20) (friend, follow, block)
- status: VARCHAR(20) (pending, accepted, declined, blocked)
```

### Additional Tables

#### 11. **user_sessions** - Daily Activity Tracking
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- session_date: DATE
- total_minutes: INTEGER
- lessons_completed: INTEGER
- xp_earned: INTEGER
```

#### 12. **notifications** - User Notifications
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to users)
- type: VARCHAR(50) (achievement, streak, friend_request, goal_reminder)
- title: VARCHAR(200)
- message: TEXT
- data: JSONB (Additional notification data)
- is_read: BOOLEAN
```

## Key Features

### 🎮 **Gamification System**
- **XP & Levels**: Progressive experience system with automatic level calculation
- **Streaks**: Multiple streak types (daily learning, weekly goals, monthly goals)
- **Achievements**: Categorized badges with different rarity levels
- **Leaderboards**: Multi-period ranking system (daily, weekly, monthly, all-time)

### 📊 **Progress Tracking**
- **Detailed Analytics**: Track completion, scores, time spent, attempts
- **Subject Progress**: Percentage completion per subject
- **Daily Goals**: Customizable daily targets with achievement tracking
- **Session History**: Complete learning session records

### 👥 **Social Features**
- **Friends System**: Add friends and follow other learners
- **Social Leaderboards**: Compete with friends
- **Notifications**: Real-time updates for achievements and social interactions

### 🔒 **Security & Privacy**
- **Row Level Security (RLS)**: Comprehensive access control
- **User Data Protection**: Users can only access their own data
- **Public Content**: Subjects and lessons are publicly readable
- **Admin Controls**: Premium users can manage content

## Database Functions

### Automatic Level Calculation
```sql
-- Automatically calculates user level based on XP
-- Uses progressive XP requirements: 1000, 1200, 1440, 1728, etc.
CREATE FUNCTION update_user_xp_and_level()
```

### Timestamp Management
```sql
-- Automatically updates updated_at field on record changes
CREATE FUNCTION update_updated_at_column()
```

## Performance Optimizations

### Indexes
- **Primary Keys**: All tables have UUID primary keys
- **Foreign Keys**: Indexed for fast joins
- **Search Fields**: Full-text search on subjects and lessons
- **Gamification**: XP, level, and streak indexes for leaderboards
- **Time-based**: Date indexes for daily goals and sessions

### Views
- **user_dashboard**: Aggregated user statistics
- **subject_progress**: Subject completion percentages per user

## Sample Data

The schema includes sample data for:
- 5 subjects (JavaScript, React, AWS, English, Spanish)
- 6 achievements (First Steps, Streak Master, XP Collector, etc.)
- Proper relationships and constraints

## Usage Examples

### Get User Dashboard Data
```sql
SELECT * FROM user_dashboard WHERE id = 'user-uuid';
```

### Get Subject Progress
```sql
SELECT * FROM subject_progress WHERE user_id = 'user-uuid';
```

### Get Weekly Leaderboard
```sql
SELECT u.username, l.xp, l.level, l.rank 
FROM leaderboards l 
JOIN users u ON l.user_id = u.id 
WHERE l.period = 'weekly' 
ORDER BY l.rank 
LIMIT 10;
```

### Get User Achievements
```sql
SELECT a.name, a.description, a.badge_rarity, ua.unlocked_at
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id
WHERE ua.user_id = 'user-uuid' AND ua.is_unlocked = TRUE;
```

## Migration from Current Schema

To migrate from the current Prisma schema to this Supabase schema:

1. **Export Data**: Export all data from current database
2. **Create Supabase Project**: Set up new Supabase project
3. **Run Schema**: Execute the provided SQL schema
4. **Import Data**: Transform and import existing data
5. **Update Application**: Modify application to use Supabase client

## Benefits of Supabase Schema

### Advantages over Current Setup
- **Real-time Features**: Built-in real-time subscriptions
- **Authentication**: Integrated auth system
- **Storage**: File storage for avatars and content
- **Edge Functions**: Serverless functions for complex logic
- **Better Performance**: Optimized for web applications
- **Scalability**: Handles high concurrency better
- **Security**: Advanced RLS policies
- **Analytics**: Built-in usage analytics

### Enhanced Features
- **Social System**: Complete friend/follow system
- **Advanced Gamification**: Multiple streak types, achievement categories
- **Better Notifications**: Rich notification system
- **Flexible Content**: JSONB for lesson content
- **Comprehensive Tracking**: Detailed progress analytics

This schema provides a solid foundation for a production-ready Duolingo-style learning platform with all the features needed for user engagement, progress tracking, and social interaction.
