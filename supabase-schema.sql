-- =============================================
-- LearnForce Supabase Database Schema
-- Duolingo-style Learning Platform
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    
    -- Gamification fields
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
    total_lessons_completed INTEGER DEFAULT 0 CHECK (total_lessons_completed >= 0),
    total_time_spent_minutes INTEGER DEFAULT 0 CHECK (total_time_spent_minutes >= 0),
    
    -- Preferences
    daily_goal_minutes INTEGER DEFAULT 15 CHECK (daily_goal_minutes > 0),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language_preference VARCHAR(10) DEFAULT 'en',
    
    -- Timestamps
    last_active_at TIMESTAMP WITH TIME ZONE,
    streak_freeze_count INTEGER DEFAULT 0 CHECK (streak_freeze_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE
);

-- =============================================
-- 2. SUBJECTS TABLE
-- =============================================
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    color_hex VARCHAR(7) DEFAULT '#3B82F6',
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    
    -- Content
    total_lessons INTEGER DEFAULT 0 CHECK (total_lessons >= 0),
    estimated_hours DECIMAL(4,1) DEFAULT 0 CHECK (estimated_hours >= 0),
    
    -- Organization
    category VARCHAR(50) NOT NULL, -- 'programming', 'language', 'business', etc.
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}'
);

-- =============================================
-- 3. LESSONS TABLE
-- =============================================
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Content
    content JSONB NOT NULL, -- Flexible lesson content structure
    lesson_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'fill_blank', 'translation', etc.
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    
    -- Gamification
    xp_reward INTEGER DEFAULT 10 CHECK (xp_reward > 0),
    time_estimate_minutes INTEGER DEFAULT 5 CHECK (time_estimate_minutes > 0),
    
    -- Organization
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    
    -- Prerequisites
    prerequisite_lesson_ids UUID[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Constraints
    UNIQUE(subject_id, slug)
);

-- =============================================
-- 4. USER_PROGRESS TABLE
-- =============================================
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    
    -- Progress tracking
    is_completed BOOLEAN DEFAULT FALSE,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    time_spent_seconds INTEGER CHECK (time_spent_seconds >= 0),
    attempts INTEGER DEFAULT 1 CHECK (attempts > 0),
    
    -- Gamification
    xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
    streak_bonus INTEGER DEFAULT 0 CHECK (streak_bonus >= 0),
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, lesson_id),
    CHECK (completed_at IS NULL OR completed_at >= started_at)
);

-- =============================================
-- 5. ACHIEVEMENTS TABLE
-- =============================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    
    -- Achievement criteria
    category VARCHAR(50) NOT NULL, -- 'streak', 'xp', 'lessons', 'time', 'social', 'special'
    requirement_type VARCHAR(50) NOT NULL, -- 'count', 'consecutive', 'score', 'time'
    requirement_value INTEGER NOT NULL CHECK (requirement_value > 0),
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0 CHECK (xp_reward >= 0),
    badge_rarity VARCHAR(20) DEFAULT 'common' CHECK (badge_rarity IN ('common', 'rare', 'epic', 'legendary')),
    
    -- Organization
    is_active BOOLEAN DEFAULT TRUE,
    is_hidden BOOLEAN DEFAULT FALSE, -- Hidden until unlocked
    order_index INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- 6. USER_ACHIEVEMENTS TABLE
-- =============================================
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Progress tracking
    progress_value INTEGER DEFAULT 0 CHECK (progress_value >= 0),
    is_unlocked BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, achievement_id),
    CHECK (unlocked_at IS NULL OR is_unlocked = TRUE)
);

-- =============================================
-- 7. LEADERBOARDS TABLE
-- =============================================
CREATE TABLE leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Ranking data
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    lessons_completed INTEGER DEFAULT 0 CHECK (lessons_completed >= 0),
    
    -- Calculated fields
    rank INTEGER,
    percentile DECIMAL(5,2),
    
    -- Timestamps
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, period, period_start),
    CHECK (period_end > period_start)
);

-- =============================================
-- 8. DAILY_GOALS TABLE
-- =============================================
CREATE TABLE daily_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Goal details
    date DATE NOT NULL,
    target_minutes INTEGER NOT NULL CHECK (target_minutes > 0),
    target_lessons INTEGER DEFAULT 1 CHECK (target_lessons > 0),
    target_xp INTEGER DEFAULT 100 CHECK (target_xp > 0),
    
    -- Progress tracking
    completed_minutes INTEGER DEFAULT 0 CHECK (completed_minutes >= 0),
    completed_lessons INTEGER DEFAULT 0 CHECK (completed_lessons >= 0),
    earned_xp INTEGER DEFAULT 0 CHECK (earned_xp >= 0),
    
    -- Status
    is_achieved BOOLEAN DEFAULT FALSE,
    achievement_percentage DECIMAL(5,2) DEFAULT 0 CHECK (achievement_percentage >= 0 AND achievement_percentage <= 100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, date)
);

-- =============================================
-- 9. STREAKS TABLE
-- =============================================
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Streak details
    streak_type VARCHAR(50) NOT NULL, -- 'daily_learning', 'weekly_goal', 'monthly_goal'
    current_count INTEGER DEFAULT 0 CHECK (current_count >= 0),
    longest_count INTEGER DEFAULT 0 CHECK (longest_count >= 0),
    
    -- Tracking
    last_activity_date DATE,
    freeze_count INTEGER DEFAULT 0 CHECK (freeze_count >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, streak_type)
);

-- =============================================
-- 10. SOCIAL_FEATURES TABLE
-- =============================================
CREATE TABLE social_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Relationship type
    relationship_type VARCHAR(20) NOT NULL CHECK (relationship_type IN ('friend', 'follow', 'block')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, target_user_id),
    CHECK (user_id != target_user_id)
);

-- =============================================
-- 11. ADDITIONAL TABLES
-- =============================================

-- User sessions for streak tracking
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    total_minutes INTEGER DEFAULT 0 CHECK (total_minutes >= 0),
    lessons_completed INTEGER DEFAULT 0 CHECK (lessons_completed >= 0),
    xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, session_date)
);

-- Notifications system
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'achievement', 'streak', 'friend_request', 'goal_reminder'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_xp ON users(xp DESC);
CREATE INDEX idx_users_level ON users(level DESC);
CREATE INDEX idx_users_streak ON users(current_streak DESC);

-- Subjects indexes
CREATE INDEX idx_subjects_category ON subjects(category);
CREATE INDEX idx_subjects_active ON subjects(is_active) WHERE is_active = TRUE;

-- Lessons indexes
CREATE INDEX idx_lessons_subject_id ON lessons(subject_id);
CREATE INDEX idx_lessons_type ON lessons(lesson_type);
CREATE INDEX idx_lessons_active ON lessons(is_active) WHERE is_active = TRUE;

-- User progress indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_subject_id ON user_progress(subject_id);
CREATE INDEX idx_user_progress_completed ON user_progress(is_completed) WHERE is_completed = TRUE;

-- Leaderboards indexes
CREATE INDEX idx_leaderboards_period ON leaderboards(period);
CREATE INDEX idx_leaderboards_rank ON leaderboards(period, rank);
CREATE INDEX idx_leaderboards_xp ON leaderboards(period, xp DESC);

-- Daily goals indexes
CREATE INDEX idx_daily_goals_user_date ON daily_goals(user_id, date);
CREATE INDEX idx_daily_goals_date ON daily_goals(date);

-- Streaks indexes
CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_streaks_type ON streaks(streak_type);

-- Social features indexes
CREATE INDEX idx_social_user_id ON social_features(user_id);
CREATE INDEX idx_social_target_user_id ON social_features(target_user_id);
CREATE INDEX idx_social_relationship ON social_features(relationship_type, status);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Subjects policies (public read, admin write)
CREATE POLICY "Anyone can view active subjects" ON subjects
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage subjects" ON subjects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND is_premium = TRUE -- Assuming premium users are admins
        )
    );

-- Lessons policies (public read, admin write)
CREATE POLICY "Anyone can view active lessons" ON lessons
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage lessons" ON lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND is_premium = TRUE
        )
    );

-- User progress policies (users can only access their own)
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view active achievements" ON achievements
    FOR SELECT USING (is_active = TRUE);

-- User achievements policies (users can only access their own)
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own achievements" ON user_achievements
    FOR ALL USING (auth.uid() = user_id);

-- Leaderboards policies (public read)
CREATE POLICY "Anyone can view leaderboards" ON leaderboards
    FOR SELECT USING (TRUE);

-- Daily goals policies (users can only access their own)
CREATE POLICY "Users can view their own daily goals" ON daily_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own daily goals" ON daily_goals
    FOR ALL USING (auth.uid() = user_id);

-- Streaks policies (users can only access their own)
CREATE POLICY "Users can view their own streaks" ON streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own streaks" ON streaks
    FOR ALL USING (auth.uid() = user_id);

-- Social features policies
CREATE POLICY "Users can view their own social connections" ON social_features
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = target_user_id);

CREATE POLICY "Users can manage their own social connections" ON social_features
    FOR ALL USING (auth.uid() = user_id);

-- User sessions policies (users can only access their own)
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" ON user_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Notifications policies (users can only access their own)
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp_and_level()
RETURNS TRIGGER AS $$
DECLARE
    new_level INTEGER;
    xp_for_level INTEGER;
BEGIN
    -- Calculate new level based on XP
    new_level := 1;
    xp_for_level := 1000;
    
    WHILE NEW.xp >= xp_for_level LOOP
        new_level := new_level + 1;
        xp_for_level := xp_for_level + (1000 * POWER(1.2, new_level - 1));
    END LOOP;
    
    -- Update level if it changed
    IF new_level != OLD.level THEN
        NEW.level := new_level;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update level when XP changes
CREATE TRIGGER trigger_update_user_level
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_xp_and_level();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_daily_goals_updated_at BEFORE UPDATE ON daily_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_social_features_updated_at BEFORE UPDATE ON social_features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert sample subjects
INSERT INTO subjects (name, slug, description, category, color_hex, difficulty_level) VALUES
('JavaScript Fundamentals', 'javascript-fundamentals', 'Learn the basics of JavaScript programming', 'programming', '#F7DF1E', 1),
('React Development', 'react-development', 'Master React components and hooks', 'programming', '#61DAFB', 2),
('AWS Cloud Computing', 'aws-cloud', 'Amazon Web Services cloud platform', 'cloud', '#FF9900', 3),
('English Grammar', 'english-grammar', 'Improve your English grammar skills', 'language', '#4CAF50', 1),
('Spanish for Beginners', 'spanish-beginners', 'Learn Spanish from scratch', 'language', '#E91E63', 1);

-- Insert sample achievements
INSERT INTO achievements (name, description, category, requirement_type, requirement_value, xp_reward, badge_rarity) VALUES
('First Steps', 'Complete your first lesson', 'lessons', 'count', 1, 50, 'common'),
('Streak Master', 'Maintain a 7-day streak', 'streak', 'consecutive', 7, 100, 'rare'),
('XP Collector', 'Earn 1000 XP', 'xp', 'count', 1000, 200, 'epic'),
('Dedicated Learner', 'Spend 10 hours learning', 'time', 'count', 600, 150, 'rare'),
('Social Butterfly', 'Add 5 friends', 'social', 'count', 5, 75, 'common'),
('Perfectionist', 'Score 100% on 10 lessons', 'lessons', 'count', 10, 300, 'legendary');

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- User dashboard view
CREATE VIEW user_dashboard AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.avatar_url,
    u.xp,
    u.level,
    u.current_streak,
    u.longest_streak,
    u.total_lessons_completed,
    u.total_time_spent_minutes,
    u.daily_goal_minutes,
    u.last_active_at,
    -- Calculate daily goal progress
    COALESCE(dg.achievement_percentage, 0) as daily_goal_progress,
    -- Get recent achievements
    (SELECT COUNT(*) FROM user_achievements ua WHERE ua.user_id = u.id AND ua.is_unlocked = TRUE) as achievements_count
FROM users u
LEFT JOIN daily_goals dg ON u.id = dg.user_id AND dg.date = CURRENT_DATE;

-- Subject progress view
CREATE VIEW subject_progress AS
SELECT 
    s.id as subject_id,
    s.name as subject_name,
    s.slug,
    s.color_hex,
    s.total_lessons,
    u.id as user_id,
    COUNT(up.lesson_id) as completed_lessons,
    ROUND(COUNT(up.lesson_id)::DECIMAL / NULLIF(s.total_lessons, 0) * 100, 2) as progress_percentage,
    COALESCE(SUM(up.xp_earned), 0) as total_xp_earned
FROM subjects s
CROSS JOIN users u
LEFT JOIN user_progress up ON s.id = up.subject_id AND u.id = up.user_id AND up.is_completed = TRUE
GROUP BY s.id, s.name, s.slug, s.color_hex, s.total_lessons, u.id;

-- =============================================
-- COMPLETION
-- =============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create indexes for full-text search
CREATE INDEX idx_subjects_search ON subjects USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX idx_lessons_search ON lessons USING gin(to_tsvector('english', title || ' ' || description));

COMMENT ON SCHEMA public IS 'LearnForce - Duolingo-style Learning Platform Database Schema';
