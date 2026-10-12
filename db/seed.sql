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

INSERT INTO quests (
  id, title, difficulty, xp, category, concept, prompt, choices,
  correct_answer, explanation, choice_explanations
) VALUES
  (
    'sql-join',
    'Join the Records',
    'Beginner',
    160,
    'SQL',
    'INNER JOIN',
    'You need only orders that have a matching customer row. Which SQL operation expresses that relationship?',
    '["INNER JOIN on the customer key", "CROSS JOIN without a condition", "UNION of both tables", "ORDER BY the customer name"]'::jsonb,
    'INNER JOIN on the customer key',
    'An INNER JOIN returns rows where the join condition matches in both tables.',
    '{}'::jsonb
  ),
  (
    'sql-group-having',
    'Aggregate Filter',
    'Intermediate',
    280,
    'SQL',
    'GROUP BY and HAVING',
    'Which clause filters grouped results to departments with more than five employees?',
    '["WHERE COUNT(*) > 5", "HAVING COUNT(*) > 5", "ORDER BY COUNT(*) > 5", "LIMIT COUNT(*) > 5"]'::jsonb,
    'HAVING COUNT(*) > 5',
    'HAVING filters groups after aggregation; WHERE filters individual rows before GROUP BY.',
    '{}'::jsonb
  ),
  (
    'sql-window-function',
    'Keep Each Row',
    'Advanced',
    460,
    'SQL',
    'Window Functions',
    'You need each employee row alongside the average salary for that employee’s department. Which approach preserves individual rows?',
    '["AVG(salary) OVER (PARTITION BY department_id)", "GROUP BY department_id only", "DISTINCT salary", "ORDER BY AVG(salary)"]'::jsonb,
    'AVG(salary) OVER (PARTITION BY department_id)',
    'A window aggregate computes a value across each department partition while retaining each employee row.',
    '{}'::jsonb
  ),
  (
    'sql-transaction',
    'Atomic Transfer',
    'Intermediate',
    320,
    'SQL',
    'Transactions',
    'A bank transfer must debit one account and credit another, or neither change should persist. Which database feature should wrap both updates?',
    '["A transaction with COMMIT or ROLLBACK", "A view", "An index", "A non-transactional sequence"]'::jsonb,
    'A transaction with COMMIT or ROLLBACK',
    'A transaction makes related writes atomic: commit both changes together or roll them back together.',
    '{}'::jsonb
  ),
  (
    'sql-index-tradeoff',
    'Index Tradeoff',
    'Intermediate',
    300,
    'SQL',
    'Indexing',
    'What is a common tradeoff when adding an index to speed up reads on a frequently updated table?',
    '["Writes can become slower and storage use increases", "Every query becomes constant time", "The table no longer needs constraints", "The index automatically encrypts the rows"]'::jsonb,
    'Writes can become slower and storage use increases',
    'Indexes take storage and must be maintained on inserts, updates, and deletes, so they trade write cost for selected read improvements.',
    '{}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO coding_challenges (
  id, mission, title, language, difficulty, prompt, starter_code,
  reference_solution, examples, checklist, keywords, tags, hint, acceptance,
  time_complexity, space_complexity, complexity_notes
) VALUES
  (
    'sql-customer-spend',
    'SQL · Coding',
    'Top Customer Spend',
    'SQL',
    'Medium',
    'Given customers(id, name) and orders(id, customer_id, total), write a PostgreSQL query returning the three customers with the highest lifetime spend. Include customer id, name, and total spend; break ties by customer id ascending.',
    E'-- Return the top three customers by lifetime spend.\nSELECT\nFROM customers AS c\nJOIN orders AS o ON\nGROUP BY\nORDER BY\nLIMIT 3;',
    $$SELECT
  c.id,
  c.name,
  SUM(o.total) AS lifetime_spend
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY lifetime_spend DESC, c.id ASC
LIMIT 3;$$,
    '[{"input":"customers: (1, Ada), (2, Linus); orders: (1, 1, 20), (2, 1, 5), (3, 2, 18)","output":"1 | Ada | 25; 2 | Linus | 18"}]'::jsonb,
    '["Join customers to orders","SUM order totals","Group by customer id and name","Sort by spend descending with a stable tie-break","Limit to three rows"]'::jsonb,
    '["join","sum","group by","order by","limit"]'::jsonb,
    '["SQL","Aggregation","Sorting"]'::jsonb,
    'Join each order to its customer, aggregate by customer, then order the aggregate and limit the result.',
    '86.2%',
    'O(m + n log n)',
    'O(g)',
    'm is orders and n is grouped customers; a full scan and aggregate are followed by sorting groups. Actual plans and costs vary with indexes and the database engine.'
  ),
  (
    'sql-above-department-average',
    'SQL · Coding',
    'Above Department Average',
    'SQL',
    'Hard',
    'Given employees(id, name, department_id, salary), write a PostgreSQL query returning each employee whose salary is above their department average. Include id, name, department_id, and salary.',
    E'-- Return employees earning above their department average.\nWITH employee_averages AS (\n  SELECT\n  FROM employees\n)\nSELECT\nFROM employee_averages\nWHERE\nORDER BY department_id, id;',
    $$WITH employee_averages AS (
  SELECT
    id,
    name,
    department_id,
    salary,
    AVG(salary) OVER (PARTITION BY department_id) AS department_average
  FROM employees
)
SELECT id, name, department_id, salary
FROM employee_averages
WHERE salary > department_average
ORDER BY department_id, id;$$,
    '[{"input":"employees: (1, Ada, 10, 120), (2, Grace, 10, 100), (3, Linus, 20, 90)","output":"1 | Ada | 10 | 120"}]'::jsonb,
    '["Use AVG as a window aggregate","Partition the average by department","Keep employee rows in the CTE","Filter salary above the computed average"]'::jsonb,
    '["with","avg","over","partition by","where"]'::jsonb,
    '["SQL","Window Functions","CTEs"]'::jsonb,
    'Compute the department average with a window function so each employee row remains available for comparison.',
    '72.8%',
    'O(n) expected; may be O(n log n) if rows must be sorted by department',
    'O(n) worst case for window processing',
    'The query scans employees and the engine may sort or buffer partitions. Indexes and execution plans affect the actual cost.'
  ),
  (
    'sql-unsold-products',
    'SQL · Coding',
    'Find Unsold Products',
    'SQL',
    'Medium',
    'Given products(id, name) and order_items(product_id, quantity), write a PostgreSQL query returning products that have never appeared in an order item. Return product id and name, ordered by id.',
    E'-- Return products that have never been ordered.\nSELECT\nFROM products AS p\nLEFT JOIN order_items AS oi ON\nWHERE\nORDER BY p.id;',
    $$SELECT p.id, p.name
FROM products AS p
LEFT JOIN order_items AS oi ON oi.product_id = p.id
WHERE oi.product_id IS NULL
ORDER BY p.id;$$,
    '[{"input":"products: (1, Keyboard), (2, Mouse); order_items: (1, 4)","output":"2 | Mouse"}]'::jsonb,
    '["Start from all products","LEFT JOIN order items by product id","Filter unmatched rows with IS NULL","Return product id and name"]'::jsonb,
    '["left join","product_id","is null","select","order by"]'::jsonb,
    '["SQL","Joins","NULL"]'::jsonb,
    'Keep every product with a LEFT JOIN and filter to rows for which no order-item match exists.',
    '81.5%',
    'O(p + i) expected with a hash join; index-dependent otherwise',
    'O(i) worst case for a hash join',
    'p is products and i is order_items. The planner may choose a different join strategy based on indexes and table statistics.'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO leaderboard_entries (learner_name, xp, streak, badge) VALUES
  ('Byte Knight', 12450, 9, 'Logic Legend'),
  ('Pixel Sage', 11680, 7, 'Bug Slayer'),
  ('Null Ninja', 9820, 6, 'Compiler Whisperer'),
  ('Hash Hero', 8610, 5, 'Data Ranger');
