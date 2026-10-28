-- Additional backend tracking for learner sessions.
-- This table records how long a learner spends in active problem-solving sessions.

CREATE TABLE IF NOT EXISTS learner_sessions (
  id BIGSERIAL PRIMARY KEY,
  learner_id VARCHAR(120) NOT NULL,
  session_name VARCHAR(160) NOT NULL DEFAULT 'Study Session',
  quest_id VARCHAR(120) REFERENCES quests(id) ON DELETE SET NULL,
  minutes_spent INTEGER NOT NULL DEFAULT 0 CHECK (minutes_spent >= 0),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS learner_sessions_learner_started_idx
  ON learner_sessions (learner_id, started_at DESC);

CREATE INDEX IF NOT EXISTS learner_sessions_quest_idx
  ON learner_sessions (quest_id, started_at DESC);
