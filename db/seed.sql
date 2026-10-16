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
    '{
      "INNER JOIN on the customer key": "Correct. The join condition keeps only orders whose customer key matches a customer row.",
      "CROSS JOIN without a condition": "A CROSS JOIN pairs every order with every customer, including unrelated rows.",
      "UNION of both tables": "UNION combines compatible result rows; it does not match related records across tables.",
      "ORDER BY the customer name": "ORDER BY sorts a result but does not determine which orders have a matching customer."
    }'::jsonb
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
    '{
      "WHERE COUNT(*) > 5": "WHERE is evaluated before grouping, so it cannot filter the result of COUNT(*).",
      "HAVING COUNT(*) > 5": "Correct. HAVING filters grouped rows using aggregate values such as COUNT(*).",
      "ORDER BY COUNT(*) > 5": "ORDER BY sorts rows; it does not remove groups that fail a condition.",
      "LIMIT COUNT(*) > 5": "LIMIT expects a row count, not a condition for filtering aggregate groups."
    }'::jsonb
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
    '{
      "AVG(salary) OVER (PARTITION BY department_id)": "Correct. The window average adds each department average while preserving every employee row.",
      "GROUP BY department_id only": "Grouping only by department collapses employee rows into one row per department.",
      "DISTINCT salary": "DISTINCT removes duplicate salary values and does not calculate department averages.",
      "ORDER BY AVG(salary)": "Ordering by an aggregate does not add that aggregate alongside each employee row."
    }'::jsonb
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
    '{
      "A transaction with COMMIT or ROLLBACK": "Correct. A transaction commits both account updates together or rolls both back.",
      "A view": "A view presents query results; it does not make multiple updates atomic.",
      "An index": "An index can accelerate lookups but does not control whether related writes commit together.",
      "A non-transactional sequence": "A sequence generates values and does not make account updates atomic."
    }'::jsonb
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
    '{
      "Writes can become slower and storage use increases": "Correct. Index entries consume disk space and must be maintained as indexed data changes.",
      "Every query becomes constant time": "An index can speed up particular access patterns, but it does not change every query to constant time; some queries still scan or sort many rows.",
      "The table no longer needs constraints": "Indexes do not replace integrity rules such as foreign keys, CHECK constraints, or required-column constraints.",
      "The index automatically encrypts the rows": "An index is a lookup structure, not an encryption feature; it does not encrypt table data."
    }'::jsonb
  )
ON CONFLICT (id) DO UPDATE
SET choice_explanations = EXCLUDED.choice_explanations;

INSERT INTO quests (
  id, title, difficulty, xp, category, concept, prompt, choices,
  correct_answer, explanation, choice_explanations
) VALUES
  (
    'sql-null-check',
    'Find Missing Values',
    'Beginner',
    180,
    'SQL',
    'NULL Handling',
    'Which condition correctly finds rows where a customer email has not been provided?',
    '["email = NULL", "email IS NULL", "email == NULL", "email IN (NULL)"]'::jsonb,
    'email IS NULL',
    'NULL represents an unknown or missing value, so SQL uses IS NULL rather than ordinary equality comparisons.',
    '{
      "email = NULL": "Ordinary equality with NULL evaluates to unknown, not true; use IS NULL to test for missing values.",
      "email IS NULL": "Correct. IS NULL explicitly tests whether a value is missing.",
      "email == NULL": "SQL uses = for ordinary equality, and equality with NULL still does not test for missing values.",
      "email IN (NULL)": "IN uses equality-style matching, which cannot match an unknown NULL value."
    }'::jsonb
  ),
  (
    'sql-foreign-key',
    'Protect References',
    'Intermediate',
    300,
    'SQL',
    'Foreign Keys',
    'An orders table stores customer_id. Which constraint prevents an order from referring to a customer that does not exist?',
    '["A CHECK constraint on the order total", "A FOREIGN KEY from orders.customer_id to customers.id", "An ORDER BY on customer_id", "A non-unique index on orders.customer_id"]'::jsonb,
    'A FOREIGN KEY from orders.customer_id to customers.id',
    'A foreign key enforces referential integrity by requiring each non-null customer_id to match a referenced customer row.',
    '{
      "A CHECK constraint on the order total": "A CHECK constraint validates a row expression, such as a non-negative total; it does not verify a customer row exists.",
      "A FOREIGN KEY from orders.customer_id to customers.id": "Correct. The foreign key requires each referenced customer to exist.",
      "An ORDER BY on customer_id": "ORDER BY only sorts query output and does not constrain stored data.",
      "A non-unique index on orders.customer_id": "An index can help lookups but does not enforce that the referenced customer exists."
    }'::jsonb
  ),
  (
    'sql-upsert',
    'Insert or Update',
    'Intermediate',
    320,
    'SQL',
    'Conflict Handling',
    'In PostgreSQL, which clause inserts a row unless its unique key already exists, in which case it updates the existing row?',
    '["ON CONFLICT (...) DO UPDATE", "GROUP BY ... HAVING", "UNION ALL", "CREATE OR REPLACE VIEW"]'::jsonb,
    'ON CONFLICT (...) DO UPDATE',
    'PostgreSQL upserts use INSERT ... ON CONFLICT with a conflict target and a DO UPDATE action.',
    '{
      "ON CONFLICT (...) DO UPDATE": "Correct. PostgreSQL handles a uniqueness conflict by updating the existing row.",
      "GROUP BY ... HAVING": "These clauses aggregate and filter query results; they do not handle insert conflicts.",
      "UNION ALL": "UNION ALL combines query result sets and does not update a row that conflicts with a unique key.",
      "CREATE OR REPLACE VIEW": "This defines a view and does not insert or update table rows."
    }'::jsonb
  )
ON CONFLICT (id) DO UPDATE
SET choice_explanations = EXCLUDED.choice_explanations;

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
  ),
  (
    'sql-monthly-revenue',
    'SQL · Coding',
    'Monthly Revenue',
    'SQL',
    'Medium',
    'Given orders(id, created_at TIMESTAMPTZ, total NUMERIC), write a PostgreSQL query returning total revenue for each UTC calendar month in 2025. Include the month as a date and revenue, ordered chronologically.',
    E'-- Return revenue by UTC calendar month for 2025.\nSELECT\nFROM orders\nWHERE\nGROUP BY\nORDER BY;',
    $$SELECT
  date_trunc('month', created_at AT TIME ZONE 'UTC')::date AS month,
  SUM(total) AS revenue
FROM orders
WHERE created_at >= TIMESTAMPTZ '2025-01-01 00:00:00+00'
  AND created_at < TIMESTAMPTZ '2026-01-01 00:00:00+00'
GROUP BY date_trunc('month', created_at AT TIME ZONE 'UTC')::date
ORDER BY month;$$,
    '[{"input":"orders: (2025-01-04T00:00:00Z, 20), (2025-01-29T12:00:00Z, 5), (2025-02-01T00:00:00Z, 18)","output":"2025-01-01 | 25; 2025-02-01 | 18"}]'::jsonb,
    '["Filter timestamps to the half-open 2025 UTC range","Convert timestamps to UTC before grouping","Group and sum totals by month","Order results by month"]'::jsonb,
    '["date_trunc","at time zone","sum","group by","order by"]'::jsonb,
    '["SQL","Aggregation","Dates"]'::jsonb,
    'Filter with inclusive start and exclusive end timestamps, then group by the UTC month and sum each group.',
    '70.4%',
    'O(n + g log g) expected',
    'O(g)',
    'n is the number of qualifying orders and g is the number of months returned. The database may use an index for the timestamp range; actual plans and costs depend on data and statistics.'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO leaderboard_entries (learner_name, xp, streak, badge) VALUES
  ('Byte Knight', 12450, 9, 'Logic Legend'),
  ('Pixel Sage', 11680, 7, 'Bug Slayer'),
  ('Null Ninja', 9820, 6, 'Compiler Whisperer'),
  ('Hash Hero', 8610, 5, 'Data Ranger');
