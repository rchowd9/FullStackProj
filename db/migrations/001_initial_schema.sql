-- Initial relational schema for Code Quest Academy.
-- Apply this migration before 002_add_indexes.sql.

CREATE TABLE IF NOT EXISTS quests (
  id VARCHAR(120) PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  difficulty VARCHAR(30) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  xp INTEGER NOT NULL CHECK (xp >= 0),
  category VARCHAR(80) NOT NULL,
  concept VARCHAR(120) NOT NULL,
  prompt TEXT NOT NULL,
  choices JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  choice_explanations JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS learner_progress (
  learner_id VARCHAR(120) NOT NULL,
  quest_id VARCHAR(120) NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'missed')),
  attempts INTEGER NOT NULL DEFAULT 1 CHECK (attempts > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (learner_id, quest_id)
);

CREATE TABLE IF NOT EXISTS coding_challenges (
  id VARCHAR(120) PRIMARY KEY,
  mission VARCHAR(120) NOT NULL,
  title VARCHAR(160) NOT NULL,
  language VARCHAR(30) NOT NULL CHECK (language IN ('Python', 'JavaScript', 'Java', 'C++', 'SQL')),
  difficulty VARCHAR(30) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  prompt TEXT NOT NULL,
  starter_code TEXT NOT NULL,
  reference_solution TEXT NOT NULL,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  hint TEXT NOT NULL DEFAULT '',
  acceptance VARCHAR(20),
  time_complexity TEXT NOT NULL,
  space_complexity TEXT NOT NULL,
  complexity_notes TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id BIGSERIAL PRIMARY KEY,
  learner_name VARCHAR(120) NOT NULL,
  xp INTEGER NOT NULL CHECK (xp >= 0),
  streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
  badge VARCHAR(120) NOT NULL DEFAULT 'Rookie',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
