-- Code Quest Academy relational persistence schema.
-- The current prototype uses localStorage and Redis; this schema is ready for a database-backed migration.

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

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id BIGSERIAL PRIMARY KEY,
  learner_name VARCHAR(120) NOT NULL,
  xp INTEGER NOT NULL CHECK (xp >= 0),
  streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
  badge VARCHAR(120) NOT NULL DEFAULT 'Rookie',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS learner_progress_status_idx
  ON learner_progress (learner_id, status);

CREATE INDEX IF NOT EXISTS leaderboard_xp_idx
  ON leaderboard_entries (xp DESC, created_at ASC);
