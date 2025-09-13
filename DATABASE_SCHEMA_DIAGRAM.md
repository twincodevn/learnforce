# LearnForce Database Schema Diagram

## Entity Relationship Diagram (Text-based)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    USERS                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ email (VARCHAR, UNIQUE)                     │
│ username (VARCHAR, UNIQUE)       │ full_name (VARCHAR)                         │
│ avatar_url (TEXT)                │ bio (TEXT)                                  │
│ xp (INTEGER)                     │ level (INTEGER)                             │
│ current_streak (INTEGER)         │ longest_streak (INTEGER)                    │
│ total_lessons_completed (INT)    │ total_time_spent_minutes (INT)              │
│ daily_goal_minutes (INT)         │ timezone (VARCHAR)                          │
│ language_preference (VARCHAR)    │ last_active_at (TIMESTAMP)                  │
│ is_premium (BOOLEAN)             │ is_active (BOOLEAN)                         │
│ email_verified (BOOLEAN)         │ created_at (TIMESTAMP)                      │
│ updated_at (TIMESTAMP)           │                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 SUBJECTS                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ name (VARCHAR)                              │
│ slug (VARCHAR, UNIQUE)           │ description (TEXT)                          │
│ icon_url (TEXT)                  │ color_hex (VARCHAR)                         │
│ difficulty_level (INTEGER)       │ total_lessons (INTEGER)                     │
│ estimated_hours (DECIMAL)        │ category (VARCHAR)                          │
│ order_index (INTEGER)            │ is_active (BOOLEAN)                         │
│ tags (TEXT[])                    │ created_by (UUID, FK→users)                 │
│ created_at (TIMESTAMP)           │ updated_at (TIMESTAMP)                      │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  LESSONS                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ subject_id (UUID, FK→subjects)              │
│ title (VARCHAR)                  │ slug (VARCHAR)                              │
│ description (TEXT)               │ content (JSONB)                             │
│ lesson_type (VARCHAR)            │ difficulty_level (INTEGER)                  │
│ xp_reward (INTEGER)              │ time_estimate_minutes (INTEGER)             │
│ order_index (INTEGER)            │ is_active (BOOLEAN)                         │
│ is_premium (BOOLEAN)             │ prerequisite_lesson_ids (UUID[])            │
│ created_by (UUID, FK→users)      │ created_at (TIMESTAMP)                      │
│ updated_at (TIMESTAMP)           │                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               USER_PROGRESS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ user_id (UUID, FK→users)                    │
│ subject_id (UUID, FK→subjects)   │ lesson_id (UUID, FK→lessons)                │
│ is_completed (BOOLEAN)           │ score (INTEGER)                             │
│ time_spent_seconds (INTEGER)     │ attempts (INTEGER)                          │
│ xp_earned (INTEGER)              │ streak_bonus (INTEGER)                      │
│ started_at (TIMESTAMP)           │ completed_at (TIMESTAMP)                    │
│ last_attempt_at (TIMESTAMP)      │                                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                               ACHIEVEMENTS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ name (VARCHAR)                              │
│ description (TEXT)               │ icon_url (TEXT)                             │
│ category (VARCHAR)               │ requirement_type (VARCHAR)                  │
│ requirement_value (INTEGER)      │ xp_reward (INTEGER)                         │
│ badge_rarity (VARCHAR)           │ is_active (BOOLEAN)                         │
│ is_hidden (BOOLEAN)              │ order_index (INTEGER)                       │
│ created_by (UUID, FK→users)      │ created_at (TIMESTAMP)                      │
│ updated_at (TIMESTAMP)           │                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            USER_ACHIEVEMENTS                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ user_id (UUID, FK→users)                    │
│ achievement_id (UUID, FK→achievements) │ progress_value (INTEGER)              │
│ is_unlocked (BOOLEAN)            │ unlocked_at (TIMESTAMP)                     │
│ created_at (TIMESTAMP)           │                                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                               LEADERBOARDS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ user_id (UUID, FK→users)                    │
│ period (VARCHAR)                 │ xp (INTEGER)                                │
│ level (INTEGER)                  │ streak (INTEGER)                            │
│ lessons_completed (INTEGER)      │ rank (INTEGER)                              │
│ percentile (DECIMAL)             │ period_start (TIMESTAMP)                    │
│ period_end (TIMESTAMP)           │ calculated_at (TIMESTAMP)                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                               DAILY_GOALS                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ user_id (UUID, FK→users)                    │
│ date (DATE)                      │ target_minutes (INTEGER)                    │
│ target_lessons (INTEGER)         │ target_xp (INTEGER)                         │
│ completed_minutes (INTEGER)      │ completed_lessons (INTEGER)                 │
│ earned_xp (INTEGER)              │ is_achieved (BOOLEAN)                       │
│ achievement_percentage (DECIMAL) │ created_at (TIMESTAMP)                      │
│ updated_at (TIMESTAMP)           │                                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 STREAKS                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ user_id (UUID, FK→users)                    │
│ streak_type (VARCHAR)            │ current_count (INTEGER)                     │
│ longest_count (INTEGER)          │ last_activity_date (DATE)                   │
│ freeze_count (INTEGER)           │ is_active (BOOLEAN)                         │
│ started_at (TIMESTAMP)           │ last_updated_at (TIMESTAMP)                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            SOCIAL_FEATURES                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ user_id (UUID, FK→users)                    │
│ target_user_id (UUID, FK→users)  │ relationship_type (VARCHAR)                 │
│ status (VARCHAR)                 │ created_at (TIMESTAMP)                      │
│ updated_at (TIMESTAMP)           │                                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                             USER_SESSIONS                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ user_id (UUID, FK→users)                    │
│ session_date (DATE)              │ total_minutes (INTEGER)                     │
│ lessons_completed (INTEGER)      │ xp_earned (INTEGER)                         │
│ created_at (TIMESTAMP)           │                                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                             NOTIFICATIONS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                    │ user_id (UUID, FK→users)                    │
│ type (VARCHAR)                   │ title (VARCHAR)                             │
│ message (TEXT)                   │ data (JSONB)                                │
│ is_read (BOOLEAN)                │ created_at (TIMESTAMP)                      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key Relationships

### 1. **Core Learning Flow**
```
Users → User_Progress → Lessons → Subjects
  │         │
  └─────────┴→ Achievements (via User_Achievements)
```

### 2. **Gamification System**
```
Users (XP, Level, Streaks)
  ├── User_Progress (Lesson completion, scores)
  ├── User_Achievements (Badges earned)
  ├── Daily_Goals (Daily targets)
  ├── Streaks (Streak tracking)
  └── Leaderboards (Rankings)
```

### 3. **Social Features**
```
Users ←→ Social_Features (Friends, Follows)
  │
  └→ Notifications (Social updates)
```

### 4. **Progress Tracking**
```
Users → User_Sessions (Daily activity)
  │
  └→ User_Progress → Lessons → Subjects
```

## Data Flow Examples

### 1. **User Completes a Lesson**
1. User starts lesson → `user_progress` record created
2. User completes lesson → `user_progress` updated with score/time
3. User XP updated → `users.xp` incremented
4. User level recalculated → `users.level` updated (via trigger)
5. Achievement check → `user_achievements` updated if unlocked
6. Daily goal progress → `daily_goals` updated
7. Streak updated → `streaks` table updated
8. Leaderboard recalculated → `leaderboards` updated

### 2. **Social Interaction**
1. User adds friend → `social_features` record created
2. Friend request notification → `notifications` record created
3. Friend accepts → `social_features.status` updated
4. Both users can see each other's progress

### 3. **Daily Goal Achievement**
1. User completes daily target → `daily_goals.is_achieved` = true
2. Achievement notification → `notifications` created
3. Streak maintained → `streaks` updated
4. Leaderboard position → `leaderboards` recalculated

## Indexes and Performance

### Primary Indexes
- All tables have UUID primary keys
- Foreign key relationships are indexed
- Time-based queries (dates, timestamps) are indexed

### Search Indexes
- Full-text search on subjects and lessons
- Username and email lookups
- Leaderboard rankings

### Gamification Indexes
- XP, level, and streak for leaderboards
- Achievement progress tracking
- Daily goal calculations

## Security Model

### Row Level Security (RLS)
- **Users**: Can only access their own data
- **Subjects/Lessons**: Public read, admin write
- **Progress**: Users can only see their own
- **Social**: Users can see their connections
- **Leaderboards**: Public read
- **Notifications**: Users can only see their own

### Data Privacy
- Sensitive data (passwords) properly hashed
- User data isolated by RLS policies
- Admin functions protected by role checks
- Audit trail maintained via timestamps

This schema provides a solid foundation for a production-ready Duolingo-style learning platform with comprehensive gamification, social features, and progress tracking! 🎯
