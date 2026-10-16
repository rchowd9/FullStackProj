-- Indexes for common progress, quest, challenge, and leaderboard lookups.

CREATE INDEX IF NOT EXISTS learner_progress_status_idx
  ON learner_progress (learner_id, status);

CREATE INDEX IF NOT EXISTS quests_category_difficulty_idx
  ON quests (category, difficulty);

CREATE INDEX IF NOT EXISTS coding_challenges_mission_difficulty_idx
  ON coding_challenges (mission, difficulty);

CREATE INDEX IF NOT EXISTS leaderboard_xp_idx
  ON leaderboard_entries (xp DESC, created_at ASC);
