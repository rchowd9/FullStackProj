-- Materialized-friendly database views for the backend dashboard.

CREATE OR REPLACE VIEW learner_dashboard AS
SELECT
  lp.learner_id,
  q.id AS quest_id,
  q.title,
  q.category,
  q.difficulty,
  q.xp,
  lp.status,
  lp.attempts,
  lp.updated_at
FROM learner_progress lp
JOIN quests q
  ON q.id = lp.quest_id;

CREATE OR REPLACE VIEW quest_completion_summary AS
SELECT
  q.category,
  q.difficulty,
  COUNT(*) AS total_quests,
  COUNT(lp.quest_id) FILTER (WHERE lp.status = 'completed') AS completed_quests,
  ROUND(
    100.0 * COUNT(lp.quest_id) FILTER (WHERE lp.status = 'completed') / NULLIF(COUNT(*), 0),
    2
  ) AS completion_rate
FROM quests q
LEFT JOIN learner_progress lp
  ON lp.quest_id = q.id
GROUP BY q.category, q.difficulty
ORDER BY q.category, q.difficulty;

CREATE OR REPLACE VIEW leaderboard_snapshot AS
SELECT
  learner_name,
  xp,
  streak,
  badge,
  ROW_NUMBER() OVER (ORDER BY xp DESC, streak DESC, created_at ASC) AS rank,
  created_at
FROM leaderboard_entries;
