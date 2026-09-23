-- Starter data for Code Quest Academy.
-- Run schema.sql before this file.

INSERT INTO quests (
  id, title, difficulty, xp, category, concept, prompt, choices,
  correct_answer, explanation, choice_explanations
) VALUES (
  'ds-graph-bfs',
  'Shortest Route',
  'Advanced',
  520,
  'Data Structures',
  'Graphs',
  'In an unweighted social graph, you need the fewest connection hops between two people. Which algorithm is the natural first choice?',
  '["Breadth-first search", "Depth-first search only", "Insertion sort", "Binary search on names"]'::jsonb,
  'Breadth-first search',
  'Breadth-first search explores the graph level by level, so the first time it reaches a node it has found the fewest-edge path from the start.',
  '{
    "Breadth-first search": "Correct. Each frontier represents one additional hop.",
    "Depth-first search only": "DFS can find a path but does not guarantee the fewest hops without extra work.",
    "Insertion sort": "Sorting is not a graph traversal strategy.",
    "Binary search on names": "Binary search needs ordered random-access data, not graph connections."
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO leaderboard_entries (learner_name, xp, streak, badge) VALUES
  ('Byte Knight', 12450, 9, 'Logic Legend'),
  ('Pixel Sage', 11680, 7, 'Bug Slayer'),
  ('Null Ninja', 9820, 6, 'Compiler Whisperer'),
  ('Hash Hero', 8610, 5, 'Data Ranger');
