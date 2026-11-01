-- Common backend SQL queries for Code Quest Academy.
-- These queries are intended as starter reads and writes for a Postgres-backed API.

-- 1) Fetch the next learning quests for a learner, including their completion state.
SELECT
  q.id,
  q.title,
  q.difficulty,
  q.category,
  q.concept,
  q.xp,
  lp.status AS learner_status,
  lp.attempts,
  lp.updated_at
FROM quests q
LEFT JOIN learner_progress lp
  ON lp.quest_id = q.id
 AND lp.learner_id = :learner_id
ORDER BY q.category, q.xp DESC;

-- 2) Update or insert a learner's progress for a completed quest.
INSERT INTO learner_progress (learner_id, quest_id, status, attempts, updated_at)
VALUES (:learner_id, :quest_id, 'completed', 1, NOW())
ON CONFLICT (learner_id, quest_id)
DO UPDATE SET
  status = EXCLUDED.status,
  attempts = learner_progress.attempts + 1,
  updated_at = NOW();

-- 3) Pull the top leaderboard entries for the public dashboard.
SELECT
  learner_name,
  xp,
  streak,
  badge,
  created_at
FROM leaderboard_entries
ORDER BY xp DESC, streak DESC, created_at ASC
LIMIT 10;

-- 4) List coding challenges by mission and difficulty.
SELECT
  id,
  mission,
  title,
  language,
  difficulty,
  acceptance,
  time_complexity,
  space_complexity
FROM coding_challenges
WHERE lower(mission) = lower(:mission)
ORDER BY difficulty, title;

-- 5) Aggregate learner progress by category.
SELECT
  q.category,
  COUNT(*) AS total_quests,
  COUNT(lp.quest_id) FILTER (WHERE lp.status = 'completed') AS completed_quests,
  ROUND(
    100.0 * COUNT(lp.quest_id) FILTER (WHERE lp.status = 'completed') / NULLIF(COUNT(*), 0),
    2
  ) AS completion_rate
FROM quests q
LEFT JOIN learner_progress lp
  ON lp.quest_id = q.id
 AND lp.learner_id = :learner_id
GROUP BY q.category
ORDER BY completion_rate DESC NULLS LAST;

-- 6) Show today's quest-goal progress for a learner.
-- Validate :daily_goal as a positive integer before running this query.
SELECT
  :daily_goal AS target_quests,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_quests,
  GREATEST(
    :daily_goal - COUNT(*) FILTER (WHERE status = 'completed'),
    0
  ) AS remaining_quests,
  ROUND(
    LEAST(
      100.0 * COUNT(*) FILTER (WHERE status = 'completed') / NULLIF(:daily_goal, 0),
      100.0
    ),
    2
  ) AS completion_percent
FROM learner_progress
WHERE learner_id = :learner_id
  AND updated_at >= CURRENT_DATE::timestamptz
  AND updated_at < (CURRENT_DATE + INTERVAL '1 day')::timestamptz;

-- 7) Return one row per day for the learner's seven-day activity calendar.
WITH calendar AS (
  SELECT day::date AS activity_date
  FROM generate_series(
    CURRENT_DATE - 6,
    CURRENT_DATE,
    INTERVAL '1 day'
  ) AS dates(day)
)
SELECT
  calendar.activity_date,
  COUNT(lp.quest_id) AS completed_quests
FROM calendar
LEFT JOIN learner_progress lp
  ON lp.learner_id = :learner_id
 AND lp.status = 'completed'
 AND lp.updated_at >= calendar.activity_date::timestamptz
 AND lp.updated_at < (calendar.activity_date + 1)::timestamptz
GROUP BY calendar.activity_date
ORDER BY calendar.activity_date;
