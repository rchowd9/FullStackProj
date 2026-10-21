'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CodeEditor from './components/CodeEditor';

type LeaderboardEntry = {
  name: string;
  xp: number;
  streak: number;
  badge: string;
};

const missions = [
  {
    title: 'AI Bootcamp',
    category: 'AI',
    difficulty: 'Beginner',
    xp: 120,
    description: 'Train your agent instincts and reason through real AI challenges.',
  },
  {
    title: 'ML Lab',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    xp: 240,
    description: 'Explore supervised learning, evaluation, and the model patterns behind prediction.',
  },
  {
    title: 'Data Mine',
    category: 'Data Mining',
    difficulty: 'Advanced',
    xp: 500,
    description: 'Uncover hidden relationships and patterns in large, noisy datasets.',
  },
  {
    title: 'Structure Station',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    xp: 360,
    description: 'Choose the right structure under pressure: queues, trees, graphs, and the costs behind each choice.',
  },
  {
    title: 'DBMS Dossier',
    category: 'DBMS',
    difficulty: 'Beginner',
    xp: 150,
    description: 'Manage schemas, relationships, and efficient storage with database fundamentals.',
  },
  {
    title: 'SQL Query Lab',
    category: 'SQL',
    difficulty: 'Intermediate',
    xp: 320,
    description: 'Practice joins, aggregates, window functions, and query performance.',
  },
  {
    title: 'Kernel Quest',
    category: 'Operating Systems',
    difficulty: 'Intermediate',
    xp: 300,
    description: 'Understand scheduling, memory, and process control inside the operating system.',
  },
  {
    title: 'Mobile Launchpad',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    xp: 340,
    description: 'Build reliable native apps with Kotlin, coroutines, Swift, and SwiftUI.',
  },
  {
    title: 'System Forge',
    category: 'System Design',
    difficulty: 'Advanced',
    xp: 520,
    description: 'Design scalable, resilient systems that handle growth and real-world traffic.',
  },
  {
    title: 'Cipher Vault',
    category: 'Cryptography',
    difficulty: 'Advanced',
    xp: 540,
    description: 'Explore hashes, encryption, and the secrets behind secure communication.',
  },

  {
    title: 'Architecture Analyzers',
    category: 'Computer Architecture',
    difficulty: 'Advanced',
    xp: 560,
    description: 'Discover how a computer is organized and designed.',
  },

  {
    title: 'Cyber Evangelists', 
    category: 'Cybersecurity',
    difficulty: 'Advanced',
    xp: 580,
    description: 'Find out how to protect your computers from attacks.',
  },

  {
    title: 'Tech Devs', 
    category: 'Software Engineering',
    difficulty: 'Advanced',
    xp: 580, 
    description: 'Design and write programs for computers and other devices.',
  },

  {
    title: 'Redistributed',  
    category: 'Distributed Systems',
    difficulty: 'Advanced',
    xp: 580,
    description: 'Collection of independent computers and devices that work together over a network.', 
  }, 

  {
    title: 'Networking Nerds',  
    category: 'Computer Networking',
    difficulty: 'Advanced',
    xp: 580,
    description: 'System of interconnected computing devices that communicate and share resources with one another.', 
  }, 

  {
    title: 'Object-Oriented',  
    category: 'OOP',
    difficulty: 'Advanced',
    xp: 580,
    description: 'Organizing complex programs by breaking them into objects.', 
  }, 


];

type InterviewQuestion = {
  id: string;
  mission: string;
  question: string;
  idealAnswer: string;
  checklist: string[];
  keywords: string[];
  language?: CodingLanguage;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  acceptance?: string;
  complexity?: {
    time: string;
    space: string;
    notes: string;
  };
  tags?: string[];
  hint?: string;
  starterCode?: string;
  examples?: { input: string; output: string }[];
};

const codingLanguages = ['Python', 'JavaScript', 'Java', 'C++', 'SQL'] as const;
type CodingLanguage = (typeof codingLanguages)[number];
type CodingStarterVariants = Partial<Record<CodingLanguage, string>>;

type InterviewResult = {
  score: number;
  label: string;
  feedback: string;
  answer: string;
};

type SubmissionHistoryItem = {
  id: string;
  submittedAt: string;
  elapsedSeconds: number;
  score: number;
  code: string;
};

const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'ai-agent-safety',
    mission: 'AI',
    question: 'How would you make an AI agent safe when it can call tools?',
    idealAnswer: 'I would limit each tool to the minimum permissions it needs, validate all inputs and outputs, log actions with IDs, add timeouts and rate limits, and require human approval for destructive or irreversible operations. I would also sandbox execution and treat tool use as an auditable workflow rather than a free-form command loop.',
    checklist: ['least privilege', 'input validation', 'human approval', 'audit trail', 'sandboxing'],
    keywords: ['permission', 'validate', 'human approval', 'audit', 'sandbox', 'rate limit', 'tool'],
  },
  {
    id: 'ml-production-drift',
    mission: 'Machine Learning',
    question: 'How do you diagnose a model that performs well in training but poorly in production?',
    idealAnswer: 'I would check for overfitting and data drift by comparing training and production distributions, label quality, and feature pipelines. Then I would validate the model against real world traffic, inspect metrics by segment, and decide whether the fix is retraining, regularization, feature engineering, or a pipeline correction.',
    checklist: ['overfitting', 'data drift', 'distribution', 'label quality', 'retraining'],
    keywords: ['overfitting', 'data drift', 'production', 'distribution', 'label', 'retrain', 'validation'],
  },
  {
    id: 'fullstack-nextjs-security',
    mission: 'Full Stack',
    question: 'How would you secure a Next.js app against XSS, CSRF, and SSRF?',
    idealAnswer: 'I would use framework protections like escaping server-rendered content, avoiding dangerouslySetInnerHTML, enforcing strict CSP, and validating cookies with secure and HttpOnly flags. For forms, I would validate CSRF tokens and use same-site cookies. For server-side fetches, I would block untrusted URLs, allow-list destinations, validate redirect targets, and never trust user-supplied URLs in outbound requests.',
    checklist: ['XSS', 'CSRF', 'SSRF', 'CSP', 'HttpOnly', 'allowlist'],
    keywords: ['xss', 'csrf', 'ssrf', 'csp', 'httponly', 'allowlist', 'redirect'],
  },
  {
    id: 'react-performance',
    mission: 'Frontend',
    question: 'How would you improve the performance of a slow React dashboard?',
    idealAnswer: 'I would start by measuring with the React profiler and browser devtools to identify the actual bottleneck. Then I would memoize heavy computations, render fewer items with virtualization, defer non-critical work, split code by route, and only fetch the data needed for the current view. I would also avoid unnecessary state updates and keep the render path lean.',
    checklist: ['profiling', 'memoization', 'virtualization', 'code splitting', 'data fetching'],
    keywords: ['react profiler', 'memo', 'virtualize', 'code splitting', 'fetch', 'render', 'bottleneck'],
  },
  {
    id: 'rest-vs-graphql',
    mission: 'APIs',
    question: 'When would you choose REST over GraphQL or vice versa?',
    idealAnswer: 'I choose REST for straightforward resource-based APIs, caching, and mature ecosystem tooling. I choose GraphQL when clients need flexible queries, nested data relationships, or reduced over-fetching across multiple screens. The decision depends on client complexity, cache strategy, schema governance, and whether the team is comfortable operating a more complex query layer.',
    checklist: ['REST', 'GraphQL', 'caching', 'over-fetching', 'schema'],
    keywords: ['rest', 'graphql', 'cache', 'over-fetch', 'schema', 'client'],
  },
  {
    id: 'rate-limiter',
    mission: 'Distributed Systems',
    question: 'How would you design a distributed rate limiter for a public API?',
    idealAnswer: 'I would use a centralized counter or token bucket backed by Redis, with a per-identifier key and a fixed window or sliding window strategy depending on accuracy requirements. I would include fairness, burst handling, and per-plan quotas, and I would ensure the limiter is replicated, observable, and resistant to time skew by using a consistent clock source and testable quotas.',
    checklist: ['redis', 'token bucket', 'sliding window', 'quota', 'fairness'],
    keywords: ['redis', 'token bucket', 'window', 'quota', 'distributed', 'rate limit', 'burst'],
  },
  {
    id: 'chat-scaling',
    mission: 'System Design',
    question: 'How would you design a real-time chat system that scales to millions of users?',
    idealAnswer: 'I would separate concerns into user presence, message storage, delivery, and push notifications. I would use durable storage for messages, a fan-out or stream-based delivery pattern, WebSockets for active sessions, and background workers for asynchronous notification. I would shard by user or room, add connection load balancing, and measure latency, backlog, and reconnect behavior under peak traffic.',
    checklist: ['websocket', 'message storage', 'fan-out', 'sharding', 'presence'],
    keywords: ['websocket', 'shard', 'fan-out', 'latency', 'presence', 'message', 'backlog'],
  },
  {
    id: 'database-indexing',
    mission: 'DBMS',
    question: 'An endpoint gets slow after a table grows tenfold. What do you inspect first?',
    idealAnswer: 'I would inspect the query plan and the access pattern first, because a missing index, bad join order, or an unbounded scan often explains the slowdown. After confirming the true bottleneck, I would add the most selective index that matches the filters and sort order, and then test both latency and write amplification before making a wider schema change.',
    checklist: ['query plan', 'index', 'join', 'scan', 'latency'],
    keywords: ['query plan', 'index', 'join', 'scan', 'latency', 'cardinality'],
  },
  {
    id: 'microservice-boundaries',
    mission: 'Software Engineering',
    question: 'How do you decide where to split a monolith into microservices?',
    idealAnswer: 'I would split by business capability and data ownership, not by technical convenience. The team should isolate domains with independent scaling and deployment needs, clear API contracts, and simpler failure isolation. If data or transactions are tightly coupled, it is often better to keep the components together until the domain boundaries are stable and the operational benefits outweigh the complexity.',
    checklist: ['business capability', 'ownership', 'bounded context', 'failure isolation', 'deployment'],
    keywords: ['domain', 'bounded context', 'ownership', 'deploy', 'failure isolation', 'transaction'],
  },
  {
    id: 'security-prioritization',
    mission: 'Cybersecurity',
    question: 'How would you prioritize vulnerabilities in a backlog?',
    idealAnswer: 'I would prioritize by exploitability, impact, exposure, and the presence of compensating controls, then verify fixes with a repeatable test. A low severity issue on an internet-facing service that is trivial to exploit may deserve earlier action than a high severity issue in an isolated environment. Risk scoring should always include business context and evidence, not just a CVSS label.',
    checklist: ['exploitability', 'impact', 'exposure', 'mitigations', 'verification'],
    keywords: ['exploitability', 'impact', 'exposure', 'mitigation', 'risk', 'verify'],
  },
  {
    id: 'hashing-vs-encryption',
    mission: 'Cryptography',
    question: 'Why should passwords be hashed instead of encrypted?',
    idealAnswer: 'Passwords must be verified one-way, not recovered, so a salted password hashing function such as Argon2, bcrypt, or scrypt is appropriate. Encryption is reversible and designed for secrets that the system must read later. A password hash should be slow, salted, and tuned to make brute force and offline guessing expensive while preserving the ability to compare credentials safely.',
    checklist: ['one-way', 'salt', 'slow hash', 'argon2', 'verify'],
    keywords: ['hash', 'salt', 'argon2', 'bcrypt', 'one-way', 'verify'],
  },
  {
    id: 'cache-design',
    mission: 'System Design',
    question: 'How would you design a scalable caching strategy for a high-traffic API?',
    idealAnswer: 'I would start by identifying what is expensive to compute or read and where the cache is most valuable. I would use a layered approach: in-memory caches for hot reads, CDN caching for static or semi-static responses, and a stale-while-revalidate strategy to balance freshness with latency. I would also include invalidation rules, cache key design, and observability around hit rate and latency so the policy is driven by evidence rather than guesswork.',
    checklist: ['hot reads', 'cdn', 'stale while revalidate', 'invalidation', 'hit rate'],
    keywords: ['cache', 'cdn', 'stale', 'invalidation', 'hit rate', 'latency'],
  },
  {
    id: 'oop-composition',
    mission: 'OOP',
    question: 'When is composition better than inheritance?',
    idealAnswer: 'Composition is better when behavior changes independently or when inheritance would create a rigid hierarchy that does not model the real domain. Small collaborating objects with clear interfaces make the system more flexible, easier to test, and less likely to inherit accidental behavior. Inheritance is best reserved for true subtype relationships where the base contract is stable and meaningful.',
    checklist: ['independent behavior', 'interfaces', 'flexible', 'testability', 'subtype'],
    keywords: ['composition', 'inheritance', 'interface', 'flexible', 'behaviour', 'subtype'],
  },
  {
    id: 'distributed-locks',
    mission: 'Distributed Systems',
    question: 'How would you design a distributed lock to protect a shared action without causing race conditions?',
    idealAnswer: 'I would use a lease-based lock with a unique owner ID, a short TTL, and a fencing token or monotonic counter so stale holders cannot proceed after expiry. The lock should be acquired with retries, timeouts, and idempotency checks at the business layer to avoid double processing. I would also ensure the critical path is short and that lock acquisition is observable with metrics and alerts.',
    checklist: ['lease', 'TTL', 'fencing token', 'idempotency', 'timeouts'],
    keywords: ['lease', 'ttl', 'fencing token', 'idempotent', 'lock', 'race condition', 'timeout'],
  },
  {
    id: 'sql-vs-nosql',
    mission: 'Databases',
    question: 'How do you decide whether to use a relational database or a NoSQL database for a new product?',
    idealAnswer: 'I start by modeling the access patterns and consistency needs. Relational systems are a strong fit for structured data, transactional correctness, rich joins, and complex reporting. NoSQL is better when write throughput, horizontal scaling, flexible schemas, or high-variance access patterns matter more than strict relational guarantees. In practice, I look for the strongest fit with the product’s query shape, invariants, and operational constraints before choosing a database.',
    checklist: ['transactions', 'joins', 'schema', 'scalability', 'consistency'],
    keywords: ['relational', 'nosql', 'transaction', 'joins', 'schema', 'consistency', 'scale'],
  },
  {
    id: 'event-driven-architecture',
    mission: 'System Design',
    question: 'When would you choose an event-driven architecture, and what are the trade-offs?',
    idealAnswer: 'I would choose event-driven architecture when components need loose coupling, asynchronous processing, or independent scaling. It works well for integrations, audit trails, and workflows that can tolerate eventual consistency. The trade-offs are complexity in message delivery guarantees, replay behavior, ordering, and observability. I would also ensure idempotent consumers, dead-letter handling, and clear contract versioning so the system remains manageable as it grows.',
    checklist: ['loose coupling', 'asynchronous', 'eventual consistency', 'idempotency', 'dead letter'],
    keywords: ['event-driven', 'asynchronous', 'eventual consistency', 'idempotent', 'dead letter', 'ordering', 'contract'],
  },
  {
    id: 'database-deadlock',
    mission: 'DBMS',
    question: 'How would you debug a deadlock in a database-heavy application?',
    idealAnswer: 'I would inspect the database lock and transaction logs to see which statements are waiting on which resources and whether there is a circular dependency. Then I would reduce lock scope, reorder access to resources consistently, and avoid long transactions that hold locks while doing expensive work. I would also review isolation levels, index usage, and whether any query patterns amplify contention under concurrency.',
    checklist: ['lock graph', 'transaction logs', 'deadlock', 'isolation level', 'indexing'],
    keywords: ['deadlock', 'lock', 'transaction', 'isolation', 'index', 'concurrency', 'wait'],
  },
  {
    id: 'observability',
    mission: 'DevOps',
    question: 'How do you instrument a distributed system so engineers can debug incidents quickly?',
    idealAnswer: 'I would ensure every request carries a correlation ID and that logs, traces, and metrics all share the same identifier. The system should emit structured logs, span requests across services, track key latency and error metrics, and alert on user-facing SLOs rather than just infrastructure thresholds. I also value dashboards that make dependencies explicit and runbooks that map symptoms to likely root causes so the team can move from signal to diagnosis quickly.',
    checklist: ['correlation id', 'traces', 'metrics', 'SLO', 'runbooks'],
    keywords: ['trace', 'metric', 'correlation id', 'slo', 'logs', 'observability', 'dashboard'],
  },
  {
    id: 'deployment-safety',
    mission: 'DevOps',
    question: 'How would you design a safe deployment strategy for a production service with low error tolerance?',
    idealAnswer: 'I would use progressive delivery with canary releases, automated checks, and rollback automation. The service should have health checks, synthetic monitoring, and feature flags so risky changes can be partially exposed before full rollout. I would also measure error rate, latency, and business metrics during the rollout and stop quickly if the signal diverges from expectations. The deployment process should treat rollback as a first-class operational requirement, not an emergency fallback.',
    checklist: ['canary', 'feature flags', 'rollback', 'health checks', 'monitoring'],
    keywords: ['canary', 'feature flag', 'rollback', 'health check', 'monitor', 'deploy', 'blast radius'],
  },
  {
    id: 'payment-idempotency',
    mission: 'Backend Engineering',
    question: 'A client retries a payment request after a timeout, but the first request may already have succeeded. How would you prevent charging the customer twice?',
    idealAnswer: 'I would require a client-generated idempotency key and persist it with the payment operation under a unique constraint. The key and result should be committed atomically so concurrent retries return the original outcome rather than starting a second charge. I would define a retention window, reject reuse with a different request payload, and make downstream provider calls idempotent where possible.',
    checklist: ['idempotency key', 'unique constraint', 'atomic persistence', 'concurrent retries', 'request consistency'],
    keywords: ['idempotency key', 'unique', 'atomic', 'concurrent', 'retry', 'duplicate', 'request payload'],
  },
  {
    id: 'api-authorization',
    mission: 'Backend Engineering',
    question: 'An API checks that a user is logged in, but users can still access another customer’s records by changing an ID in the URL. What would you change?',
    idealAnswer: 'Authentication only establishes who the caller is; every request also needs authorization for the specific resource and action. I would scope the database lookup by the authenticated tenant or owner, enforce role and relationship checks on the server, and avoid trusting IDs or roles supplied by the client. I would add negative tests for cross-tenant access and audit sensitive operations.',
    checklist: ['authentication vs authorization', 'resource ownership', 'tenant scoping', 'server-side checks', 'negative tests'],
    keywords: ['authentication', 'authorization', 'owner', 'tenant', 'server', 'role', 'test'],
  },
  {
    id: 'webhook-delivery',
    mission: 'Backend Engineering',
    question: 'How would you build webhook delivery that remains reliable when a customer endpoint is slow or temporarily unavailable?',
    idealAnswer: 'I would persist each event in a durable queue or outbox before acknowledging the source transaction, then deliver asynchronously with bounded exponential backoff and jitter. Delivery would be at least once, so consumers need stable event IDs and idempotent handling. I would cap retries, expose delivery status and replay controls, sign payloads, and monitor queue age and failure rates.',
    checklist: ['durable queue or outbox', 'asynchronous delivery', 'exponential backoff', 'idempotency', 'delivery monitoring'],
    keywords: ['queue', 'outbox', 'durable', 'backoff', 'retry', 'idempotent', 'event id', 'monitor'],
  },
  {
    id: 'cursor-pagination',
    mission: 'APIs',
    question: 'A feed is growing quickly and clients see duplicate or missing items while paging through it. How would you improve the pagination design?',
    idealAnswer: 'I would use cursor-based pagination over a stable, indexed ordering such as a timestamp plus a unique ID, rather than offsets that shift as rows are inserted or deleted. The cursor should encode the last-seen ordering values, and the query should use a matching composite index and a bounded page size. I would document consistency expectations and test inserts between page requests.',
    checklist: ['cursor-based pagination', 'stable ordering', 'unique tie-breaker', 'composite index', 'bounded page size'],
    keywords: ['cursor', 'stable', 'timestamp', 'unique', 'index', 'page size', 'offset', 'insert'],
  },
  {
    id: 'database-migration',
    mission: 'Databases',
    question: 'How would you safely add a required column to a large production table without taking the application offline?',
    idealAnswer: 'I would use an expand-and-contract migration. First add the nullable column without a disruptive rewrite, deploy code that writes both old and new representations, and backfill existing rows in small resumable batches. After validating completeness and updating readers, I would add the constraint in a database-supported low-locking way, then remove the old field in a later deploy. I would monitor locks, replication lag, and error rates throughout.',
    checklist: ['expand and contract', 'nullable first', 'dual write', 'batched backfill', 'monitoring'],
    keywords: ['expand', 'contract', 'nullable', 'dual write', 'backfill', 'batch', 'constraint', 'lock'],
  },
  {
    id: 'ios-arc-retain-cycles',
    mission: 'iOS Development',
    question: 'How does Swift Automatic Reference Counting work, and how would you diagnose and fix a retain cycle?',
    idealAnswer: 'ARC tracks strong references to class instances and deallocates an instance when its strong reference count reaches zero. A retain cycle occurs when objects keep each other alive through strong references, commonly when a closure strongly captures self. I would inspect the ownership graph with Xcode’s memory tools, then break the cycle with an appropriate weak or unowned reference or a capture list, choosing based on whether the reference can be absent. I would verify deinitialization and test the affected lifecycle.',
    checklist: ['strong references', 'reference count', 'retain cycle', 'weak or unowned', 'closure capture'],
    keywords: ['strong reference', 'reference count', 'retain cycle', 'weak', 'unowned', 'capture list', 'deinit'],
  },
  {
    id: 'ios-swift-concurrency',
    mission: 'iOS Development',
    question: 'How would you load data asynchronously in an iOS app while keeping UI updates safe and responsive?',
    idealAnswer: 'I would use Swift concurrency with async/await and structured child tasks where possible, and make the UI-facing model or update method MainActor-isolated. I would handle errors explicitly, cancel work when the screen or request is no longer relevant, and avoid blocking the main thread with network or CPU-heavy work. I would also define how overlapping requests are ordered so stale results do not replace newer state.',
    checklist: ['async/await', 'structured concurrency', 'MainActor', 'cancellation', 'stale results'],
    keywords: ['async', 'await', 'structured concurrency', 'mainactor', 'cancel', 'main thread', 'stale'],
  },
  {
    id: 'ios-swiftui-state',
    mission: 'iOS Development',
    question: 'How do you decide where state should live in a SwiftUI view hierarchy?',
    idealAnswer: 'I keep view-specific, short-lived state close to the view that owns it, using State for that source of truth. When a child needs to edit its parent’s value, I pass a Binding rather than creating a duplicate. For shared or longer-lived state, I use an observable model with a clear owner and inject it into the views that need it. This keeps data flow explicit and avoids conflicting copies of state.',
    checklist: ['single source of truth', '@State', '@Binding', 'observable model', 'explicit ownership'],
    keywords: ['source of truth', 'state', 'binding', 'observable', 'ownership', 'duplicate'],
  },
  {
    id: 'ios-offline-sync',
    mission: 'iOS Development',
    question: 'How would you design an iOS feature that remains useful offline and synchronizes safely when connectivity returns?',
    idealAnswer: 'I would make a local persistent store the source for immediate reads and writes, then record pending changes in an outbox or sync queue. When connectivity returns, a background-capable sync process would send idempotent operations, handle retries, and reconcile server changes using a defined conflict policy such as version checks or field-level merging. The UI should communicate sync status, and the implementation should be tested for duplicate delivery, interrupted sync, and stale data.',
    checklist: ['local persistence', 'sync queue', 'idempotent retries', 'conflict resolution', 'sync status'],
    keywords: ['offline', 'local persistence', 'queue', 'idempotent', 'retry', 'conflict', 'sync status'],
  },
  {
    id: 'graph-bfs-vs-dfs',
    mission: 'Graph Theory',
    question: 'When would you use breadth-first search instead of depth-first search, and what are their time complexities?',
    idealAnswer: 'Both traversals run in O(V + E) time with an adjacency list when they visit each reachable vertex and edge. BFS uses a FIFO queue to explore by distance from the start, so it finds a shortest path in an unweighted graph. DFS follows a path before backtracking and is useful for tasks such as reachability, cycle detection, and exploring components, but it does not generally find a shortest path.',
    checklist: ['O(V + E)', 'FIFO queue', 'unweighted shortest path', 'depth-first exploration', 'DFS does not guarantee shortest path'],
    keywords: ['bfs', 'dfs', 'queue', 'O(V + E)', 'unweighted', 'shortest path', 'backtracking'],
  },
  {
    id: 'graph-shortest-path-algorithms',
    mission: 'Graph Theory',
    question: 'How do you choose between BFS, Dijkstra’s algorithm, and Bellman-Ford for a shortest-path problem?',
    idealAnswer: 'For an unweighted graph, BFS finds shortest paths by edge count in O(V + E). For non-negative weighted edges, Dijkstra’s algorithm is appropriate and is commonly implemented with a min-priority queue. If negative edge weights are allowed, Bellman-Ford can handle them and detect reachable negative cycles, at a higher O(VE) time cost. I would verify the weight assumptions before selecting the algorithm.',
    checklist: ['BFS for unweighted graphs', 'Dijkstra for non-negative weights', 'Bellman-Ford for negative weights', 'negative-cycle detection', 'O(VE)'],
    keywords: ['bfs', 'dijkstra', 'bellman-ford', 'unweighted', 'non-negative', 'negative weights', 'negative cycle'],
  },
  {
    id: 'graph-topological-order',
    mission: 'Graph Theory',
    question: 'How would you determine a valid order for tasks with prerequisites, and what does it mean if no such order exists?',
    idealAnswer: 'I would model each task as a vertex and each prerequisite as a directed edge, then topologically sort the directed graph using Kahn’s algorithm or DFS. Kahn’s algorithm repeatedly removes zero-indegree vertices; if it cannot process every vertex, the remaining vertices include a dependency cycle and no valid order exists. With adjacency lists, the traversal takes O(V + E) time.',
    checklist: ['directed graph', 'prerequisite edges', 'topological sort', 'cycle detection', 'O(V + E)'],
    keywords: ['directed graph', 'prerequisite', 'topological sort', 'indegree', 'cycle', 'O(V + E)'],
  },
  {
    id: 'python-first-unique',
    mission: 'Python · Coding',
    language: 'Python',
    difficulty: 'Easy',
    acceptance: '98.9%',
    tags: ['Hash Map', 'Strings'],
    hint: 'Build a frequency map first, then scan the original string for the first character whose count is 1.',
    question: 'Write first_unique_index(text), returning the index of the first character that appears once, or -1 if none exists. Keep the solution O(n).',
    idealAnswer: `def first_unique_index(text: str) -> int:
    counts = {}
    for char in text:
        counts[char] = counts.get(char, 0) + 1

    for index, char in enumerate(text):
        if counts[char] == 1:
            return index
    return -1`,
    starterCode: `def first_unique_index(text: str) -> int:
    # Return the first unique character's index, or -1.
    pass`,
    examples: [
      { input: '"swiss"', output: '1' },
      { input: '"aabb"', output: '-1' },
    ],
    checklist: ['Count characters in one pass', 'Scan in original order', 'Handle no unique character', 'O(n) time'],
    keywords: ['counts', 'get', 'enumerate', 'return -1', 'O(n)'],
    complexity: {
      time: 'O(n)',
      space: 'O(k)',
      notes: 'k is the number of distinct characters stored in the frequency map.',
    },
  },
  {
    id: 'javascript-debounce',
    mission: 'JavaScript · Coding',
    language: 'JavaScript',
    difficulty: 'Medium',
    acceptance: '93.4%',
    tags: ['Closure', 'Timing'],
    hint: 'Use a closure to keep the timeout between calls and clear it before scheduling the next invocation.',
    question: 'Implement debounce(callback, delayMs). Return a function that delays invocation until calls stop for delayMs, uses only the latest arguments, and preserves the caller context.',
    idealAnswer: `function debounce(callback, delayMs) {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(context, args), delayMs);
  };
}`,
    starterCode: `function debounce(callback, delayMs) {
  // Return a function that invokes callback after calls pause.
}`,
    examples: [
      { input: 'Call with "a" at 0 ms and "b" at 50 ms; delay is 100 ms.', output: 'Callback runs once around 150 ms with "b".' },
      { input: 'Call once, then wait longer than delayMs.', output: 'Callback runs once with the original context and arguments.' },
    ],
    checklist: ['Keep the timer in a closure', 'Cancel the previous timer', 'Forward the latest arguments', 'Preserve this'],
    keywords: ['closure', 'clearTimeout', 'setTimeout', 'args', 'this'],
    complexity: {
      time: 'O(1) per call, excluding the callback',
      space: 'O(1)',
      notes: 'The closure retains one timer and the latest call arguments.',
    },
  },
  {
    id: 'java-merge-intervals',
    mission: 'Java · Coding',
    language: 'Java',
    difficulty: 'Medium',
    acceptance: '89.1%',
    tags: ['Sorting', 'Intervals'],
    hint: 'Sort by the start time first, then compare the current interval with the last merged one.',
    question: 'Implement mergeIntervals(int[][] intervals). Merge overlapping intervals, return them sorted by start, and handle an empty input. Target O(n log n) time.',
    idealAnswer: `static int[][] mergeIntervals(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];
    Arrays.sort(intervals, Comparator.comparingInt(interval -> interval[0]));

    List<int[]> merged = new ArrayList<>();
    for (int[] interval : intervals) {
        if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {
            merged.add(interval.clone());
        } else {
            int[] last = merged.get(merged.size() - 1);
            last[1] = Math.max(last[1], interval[1]);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}`,
    starterCode: `static int[][] mergeIntervals(int[][] intervals) {
    // Return sorted, merged intervals.
}`,
    examples: [
      { input: '[[1,3], [2,6], [8,10], [15,18]]', output: '[[1,6], [8,10], [15,18]]' },
      { input: '[]', output: '[]' },
    ],
    checklist: ['Sort by start', 'Merge when intervals overlap', 'Keep disjoint intervals', 'Handle empty input'],
    keywords: ['Arrays.sort', 'interval', 'Math.max', 'toArray', 'empty'],
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
      notes: 'Sorting dominates runtime; the merged output can contain all n intervals.',
    },
  },
  {
    id: 'cpp-two-sum',
    mission: 'C++ · Coding',
    language: 'C++',
    difficulty: 'Easy',
    acceptance: '95.7%',
    tags: ['Hash Map', 'Arrays'],
    hint: 'Keep a map of seen values to indices and check whether the complement has already appeared.',
    question: 'Implement twoSum(nums, target), returning the two distinct indices whose values sum to target. Assume exactly one solution and target O(n) time. Use std::vector and std::unordered_map.',
    idealAnswer: `vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
        int needed = target - nums[i];
        auto match = seen.find(needed);
        if (match != seen.end()) return {match->second, i};
        seen[nums[i]] = i;
    }
    return {};
}`,
    starterCode: `vector<int> twoSum(const vector<int>& nums, int target) {
    // Return the two matching indices.
}`,
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
    ],
    checklist: ['Use a hash map for seen values', 'Look up target minus current value', 'Return distinct indices', 'O(n) time'],
    keywords: ['unordered_map', 'find', 'target', 'return', 'O(n)'],
    complexity: {
      time: 'O(n) expected',
      space: 'O(n)',
      notes: 'Hash-map lookups are expected O(1); worst-case behavior depends on collisions.',
    },
  },
  {
    id: 'sql-customer-spend',
    mission: 'SQL · Coding',
    language: 'SQL',
    difficulty: 'Medium',
    acceptance: '86.2%',
    tags: ['SQL', 'Aggregation', 'Sorting'],
    hint: 'Join each order to its customer, aggregate by customer, then order the aggregate and limit the result.',
    question: 'Given customers(id, name) and orders(id, customer_id, total), write a PostgreSQL query returning the three customers with the highest lifetime spend. Include customer id, name, and total spend; break ties by customer id ascending.',
    idealAnswer: `SELECT
  c.id,
  c.name,
  SUM(o.total) AS lifetime_spend
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY lifetime_spend DESC, c.id ASC
LIMIT 3;`,
    starterCode: `-- Return the top three customers by lifetime spend.
SELECT
FROM customers AS c
JOIN orders AS o ON
GROUP BY
ORDER BY
LIMIT 3;`,
    examples: [
      { input: 'customers: (1, Ada), (2, Linus); orders: (1, 1, 20), (2, 1, 5), (3, 2, 18)', output: '1 | Ada | 25; 2 | Linus | 18' },
    ],
    checklist: ['Join customers to orders', 'SUM order totals', 'Group by customer id and name', 'Sort by spend descending with a stable tie-break', 'Limit to three rows'],
    keywords: ['join', 'sum', 'group by', 'order by', 'limit'],
    complexity: {
      time: 'O(m + n log n)',
      space: 'O(g)',
      notes: 'm orders and n grouped customers; a full scan and aggregate are followed by sorting groups. Actual plans and costs vary with indexes and the database engine.',
    },
  },
  {
    id: 'sql-above-department-average',
    mission: 'SQL · Coding',
    language: 'SQL',
    difficulty: 'Hard',
    acceptance: '72.8%',
    tags: ['SQL', 'Window Functions', 'CTEs'],
    hint: 'Compute the department average with a window function so each employee row remains available for comparison.',
    question: 'Given employees(id, name, department_id, salary), write a PostgreSQL query returning each employee whose salary is above their department average. Include id, name, department_id, and salary.',
    idealAnswer: `WITH employee_averages AS (
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
ORDER BY department_id, id;`,
    starterCode: `-- Return employees earning above their department average.
WITH employee_averages AS (
  SELECT
  FROM employees
)
SELECT
FROM employee_averages
WHERE
ORDER BY department_id, id;`,
    examples: [
      { input: 'employees: (1, Ada, 10, 120), (2, Grace, 10, 100), (3, Linus, 20, 90)', output: '1 | Ada | 10 | 120' },
    ],
    checklist: ['Use AVG as a window aggregate', 'Partition the average by department', 'Keep employee rows in the CTE', 'Filter salary above the computed average'],
    keywords: ['with', 'avg', 'over', 'partition by', 'where'],
    complexity: {
      time: 'O(n) expected; may be O(n log n) if rows must be sorted by department',
      space: 'O(n) worst case for window processing',
      notes: 'The query scans employees and the engine may sort or buffer partitions. Indexes and execution plans affect the actual cost.',
    },
  },
  {
    id: 'sql-unsold-products',
    mission: 'SQL · Coding',
    language: 'SQL',
    difficulty: 'Medium',
    acceptance: '81.5%',
    tags: ['SQL', 'Joins', 'NULL'],
    hint: 'Keep every product with a LEFT JOIN and filter to rows for which no order-item match exists.',
    question: 'Given products(id, name) and order_items(product_id, quantity), write a PostgreSQL query returning products that have never appeared in an order item. Return product id and name, ordered by id.',
    idealAnswer: `SELECT p.id, p.name
FROM products AS p
LEFT JOIN order_items AS oi ON oi.product_id = p.id
WHERE oi.product_id IS NULL
ORDER BY p.id;`,
    starterCode: `-- Return products that have never been ordered.
SELECT
FROM products AS p
LEFT JOIN order_items AS oi ON
WHERE
ORDER BY p.id;`,
    examples: [
      { input: 'products: (1, Keyboard), (2, Mouse); order_items: (1, 4)', output: '2 | Mouse' },
    ],
    checklist: ['Start from all products', 'LEFT JOIN order items by product id', 'Filter unmatched rows with IS NULL', 'Return product id and name'],
    keywords: ['left join', 'product_id', 'is null', 'select', 'order by'],
    complexity: {
      time: 'O(p + i) expected with a hash join; index-dependent otherwise',
      space: 'O(i) worst case for a hash join',
      notes: 'p is products and i is order_items. The planner may choose a different join strategy based on indexes and table statistics.',
    },
  },
  {
    id: 'javascript-breadth-first-search',
    mission: 'JavaScript · Coding',
    language: 'JavaScript',
    difficulty: 'Medium',
    acceptance: '84.6%',
    tags: ['Graphs', 'BFS', 'Queues'],
    hint: 'Mark a node visited when you enqueue it, not when you dequeue it, so each node enters the queue only once.',
    question: 'Implement breadthFirstSearch(graph, start) for an adjacency-list graph. Return nodes in BFS order, visiting each reachable node once and preserving each neighbor list’s order. Return an empty array if start is not in the graph.',
    idealAnswer: `function breadthFirstSearch(graph, start) {
  if (!Object.hasOwn(graph, start)) return [];

  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  for (let head = 0; head < queue.length; head += 1) {
    const node = queue[head];
    order.push(node);

    for (const neighbor of graph[node] ?? []) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }

  return order;
}`,
    starterCode: `function breadthFirstSearch(graph, start) {
  // Return each reachable node once in breadth-first order.
}`,
    examples: [
      { input: 'graph = { A: [B, C], B: [D], C: [D], D: [] }, start = A', output: '[A, B, C, D]' },
      { input: 'graph = { A: [B], B: [] }, start = Z', output: '[]' },
    ],
    checklist: ['Use a FIFO queue', 'Track visited nodes', 'Mark nodes when enqueued', 'Preserve neighbor order', 'Return an empty list for a missing start'],
    keywords: ['queue', 'visited', 'push', 'shift', 'neighbor', 'return', 'breadth'],
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
      notes: 'V is the number of reachable vertices and E is the number of edges scanned from them. A head index avoids the repeated shifting cost of Array.shift().',
    },
  },
  {
    id: 'javascript-genetic-algorithm',
    mission: 'JavaScript · Coding',
    language: 'JavaScript',
    difficulty: 'Hard',
    acceptance: '61.3%',
    tags: ['Genetic Algorithms', 'Optimization', 'Randomized'],
    hint: 'Keep the best chromosome unchanged (elitism), choose parents with a small tournament, then apply one-point crossover and bit-flip mutation.',
    question: 'Implement geneticAlgorithm(length, populationSize, generations, mutationRate) to approximately maximize the number of 1s in a fixed-length binary chromosome. Return the best chromosome as a string. Use tournament selection, one-point crossover, bit-flip mutation, and elitism. Assume length ≥ 1, populationSize ≥ 2, generations ≥ 0, and mutationRate is between 0 and 1.',
    idealAnswer: `function geneticAlgorithm(length, populationSize, generations, mutationRate) {
  const randomChromosome = () =>
    Array.from({ length }, () => (Math.random() < 0.5 ? 0 : 1));
  const fitness = (chromosome) =>
    chromosome.reduce((total, bit) => total + bit, 0);
  const tournamentSelect = (population) => {
    let best = population[Math.floor(Math.random() * population.length)];
    for (let pick = 1; pick < 3; pick += 1) {
      const candidate = population[Math.floor(Math.random() * population.length)];
      if (fitness(candidate) > fitness(best)) best = candidate;
    }
    return best;
  };

  let population = Array.from({ length: populationSize }, randomChromosome);

  for (let generation = 0; generation < generations; generation += 1) {
    const elite = population.reduce((best, chromosome) =>
      fitness(chromosome) > fitness(best) ? chromosome : best
    );
    const nextPopulation = [elite.slice()];

    while (nextPopulation.length < populationSize) {
      const firstParent = tournamentSelect(population);
      const secondParent = tournamentSelect(population);
      const crossoverPoint = Math.floor(Math.random() * length);
      const child = firstParent.map((bit, index) =>
        index < crossoverPoint ? bit : secondParent[index]
      );

      for (let index = 0; index < length; index += 1) {
        if (Math.random() < mutationRate) child[index] = 1 - child[index];
      }
      nextPopulation.push(child);
    }

    population = nextPopulation;
  }

  const best = population.reduce((currentBest, chromosome) =>
    fitness(chromosome) > fitness(currentBest) ? chromosome : currentBest
  );
  return best.join('');
}`,
    starterCode: `function geneticAlgorithm(length, populationSize, generations, mutationRate) {
  // Evolve binary chromosomes and return the best one as a string.
}`,
    examples: [
      { input: 'geneticAlgorithm(4, 20, 50, 0.01)', output: 'A binary string such as "1111" (results vary because the search is stochastic).' },
      { input: 'geneticAlgorithm(1, 10, 0, 0)', output: 'The best chromosome in the randomly initialized population.' },
    ],
    checklist: ['Initialize a population of binary chromosomes', 'Score chromosomes by number of 1s', 'Select parents with tournament selection', 'Use crossover and bit-flip mutation', 'Preserve the best chromosome with elitism'],
    keywords: ['population', 'fitness', 'tournament', 'crossover', 'mutation', 'elite', 'generation', 'random'],
    complexity: {
      time: 'O(G × P × L)',
      space: 'O(P × L)',
      notes: 'G is generations, P is population size, and L is chromosome length. Runtime excludes the cost of any more expensive fitness function.',
    },
  },
  {
    id: 'javascript-dijkstra-shortest-path',
    mission: 'JavaScript · Coding',
    language: 'JavaScript',
    difficulty: 'Hard',
    acceptance: '68.1%',
    tags: ['Graphs', 'Dijkstra', 'Shortest Path'],
    hint: 'Repeatedly settle the unvisited node with the smallest tentative distance, then relax each outgoing edge. This simple version scans all nodes to find that minimum.',
    question: 'Implement dijkstra(graph, start) for a weighted adjacency list such as { A: [{ to: "B", weight: 4 }] }. Return an object mapping every reachable node to its shortest distance from start, or an empty object if start is missing. Assume all weights are non-negative.',
    idealAnswer: `function dijkstra(graph, start) {
  if (!Object.hasOwn(graph, start)) return {};

  const distances = { [start]: 0 };
  const visited = new Set();

  while (true) {
    let current = null;
    for (const node of Object.keys(distances)) {
      if (!visited.has(node) &&
          (current === null || distances[node] < distances[current])) {
        current = node;
      }
    }
    if (current === null) break;

    visited.add(current);
    for (const edge of graph[current] ?? []) {
      const candidate = distances[current] + edge.weight;
      if (distances[edge.to] === undefined || candidate < distances[edge.to]) {
        distances[edge.to] = candidate;
      }
    }
  }

  return distances;
}`,
    starterCode: `function dijkstra(graph, start) {
  // Return the shortest distance from start to each reachable node.
}`,
    examples: [
      { input: 'graph = { A: [{to: B, weight: 4}, {to: C, weight: 1}], B: [], C: [{to: B, weight: 2}] }, start = A', output: '{ A: 0, B: 3, C: 1 }' },
      { input: 'graph = { A: [] }, start = Z', output: '{}' },
    ],
    checklist: ['Initialize the start distance to zero', 'Choose the unvisited node with minimum distance', 'Relax outgoing edges', 'Ignore unreachable nodes', 'Require non-negative weights'],
    keywords: ['distance', 'visited', 'minimum', 'relax', 'weight', 'shortest', 'non-negative'],
    complexity: {
      time: 'O(V² + E)',
      space: 'O(V)',
      notes: 'This approachable implementation scans tentative distances to select each node. A min-priority queue reduces the selection cost to O((V + E) log V) for sparse graphs.',
    },
  },
];

const normalizeText = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const interviewQuestionIds = new Set(interviewQuestions.map((question) => question.id));
const codingQuestionIds = new Set(interviewQuestions.filter((question) => question.language).map((question) => question.id));
const isCodingLanguage = (value: unknown): value is CodingLanguage =>
  codingLanguages.some((language) => language === value);

const codingStarterVariants: Record<string, CodingStarterVariants> = {
  'python-first-unique': {
    Python: interviewQuestions.find((question) => question.id === 'python-first-unique')?.starterCode ?? '',
    JavaScript: `function firstUniqueIndex(text) {
  // Return the first unique character's index, or -1.
}`,
    Java: `static int firstUniqueIndex(String text) {
    // Return the first unique character's index, or -1.
}`,
    'C++': `int firstUniqueIndex(const std::string& text) {
    // Return the first unique character's index, or -1.
}`,
  },
  'javascript-debounce': {
    Python: `def debounce(callback, delay_ms):
    # Return a callable that invokes callback after calls pause.
    pass`,
    JavaScript: interviewQuestions.find((question) => question.id === 'javascript-debounce')?.starterCode ?? '',
    Java: `static <T> Consumer<T> debounce(Consumer<T> callback, long delayMs) {
    // Return a debounced consumer that forwards the latest value.
}`,
    'C++': `template <typename Callback>
auto debounce(Callback callback, std::chrono::milliseconds delay) {
    // Return a callable that invokes callback after calls pause.
}`,
  },
  'java-merge-intervals': {
    Python: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    # Return sorted, merged intervals.
    pass`,
    JavaScript: `function mergeIntervals(intervals) {
  // Return sorted, merged intervals.
}`,
    Java: interviewQuestions.find((question) => question.id === 'java-merge-intervals')?.starterCode ?? '',
    'C++': `std::vector<std::vector<int>> mergeIntervals(std::vector<std::vector<int>>& intervals) {
    // Return sorted, merged intervals.
}`,
  },
  'cpp-two-sum': {
    Python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Return the two matching indices.
    pass`,
    JavaScript: `function twoSum(nums, target) {
  // Return the two matching indices.
}`,
    Java: `static int[] twoSum(int[] nums, int target) {
    // Return the two matching indices.
}`,
    'C++': interviewQuestions.find((question) => question.id === 'cpp-two-sum')?.starterCode ?? '',
  },
  'sql-customer-spend': {
    SQL: interviewQuestions.find((question) => question.id === 'sql-customer-spend')?.starterCode ?? '',
  },
  'sql-above-department-average': {
    SQL: interviewQuestions.find((question) => question.id === 'sql-above-department-average')?.starterCode ?? '',
  },
  'sql-unsold-products': {
    SQL: interviewQuestions.find((question) => question.id === 'sql-unsold-products')?.starterCode ?? '',
  },
  'javascript-breadth-first-search': {
    Python: `def breadth_first_search(graph: dict[str, list[str]], start: str) -> list[str]:
    # Return reachable nodes in breadth-first order.
    pass`,
    JavaScript: interviewQuestions.find((question) => question.id === 'javascript-breadth-first-search')?.starterCode ?? '',
    Java: `static List<String> breadthFirstSearch(Map<String, List<String>> graph, String start) {
    // Return reachable nodes in breadth-first order.
}`,
    'C++': `std::vector<std::string> breadthFirstSearch(
    const std::unordered_map<std::string, std::vector<std::string>>& graph,
    const std::string& start
) {
    // Return reachable nodes in breadth-first order.
}`,
  },
  'javascript-genetic-algorithm': {
    Python: `def genetic_algorithm(length: int, population_size: int, generations: int, mutation_rate: float) -> str:
    # Evolve binary chromosomes and return the best one as a string.
    pass`,
    JavaScript: interviewQuestions.find((question) => question.id === 'javascript-genetic-algorithm')?.starterCode ?? '',
    Java: `static String geneticAlgorithm(int length, int populationSize, int generations, double mutationRate) {
    // Evolve binary chromosomes and return the best one as a string.
}`,
    'C++': `std::string geneticAlgorithm(int length, int populationSize, int generations, double mutationRate) {
    // Evolve binary chromosomes and return the best one as a string.
}`,
  },
  'javascript-dijkstra-shortest-path': {
    Python: `def dijkstra(graph: dict[str, list[tuple[str, int]]], start: str) -> dict[str, int]:
    # Return shortest distances from start to each reachable node.
    pass`,
    JavaScript: interviewQuestions.find((question) => question.id === 'javascript-dijkstra-shortest-path')?.starterCode ?? '',
    Java: `static Map<String, Integer> dijkstra(
        Map<String, List<Edge>> graph,
        String start
) {
    // Return shortest distances from start to each reachable node.
}`,
    'C++': `std::unordered_map<std::string, int> dijkstra(
    const std::unordered_map<std::string, std::vector<std::pair<std::string, int>>>& graph,
    const std::string& start
) {
    // Return shortest distances from start to each reachable node.
}`,
  },
};

const getCodingLanguages = (question: InterviewQuestion) =>
  codingLanguages.filter((language) => Boolean(codingStarterVariants[question.id]?.[language]));

const getStarterCode = (question: InterviewQuestion, language: CodingLanguage) =>
  codingStarterVariants[question.id]?.[language] ?? question.starterCode ?? '';

const isInterviewResult = (value: unknown): value is InterviewResult =>
  typeof value === 'object'
  && value !== null
  && 'score' in value
  && typeof value.score === 'number'
  && Number.isFinite(value.score)
  && 'label' in value
  && typeof value.label === 'string'
  && 'feedback' in value
  && typeof value.feedback === 'string'
  && 'answer' in value
  && typeof value.answer === 'string';

const evaluateInterviewAnswer = (question: InterviewQuestion, response: string) => {
  const trimmed = response.trim();

  if (!trimmed) {
    return {
      score: 0,
      label: 'No answer yet',
      feedback: 'Write a concrete response and mention the key decision points before evaluating it.',
      answer: question.idealAnswer,
    };
  }

  const normalizedResponse = normalizeText(trimmed);
  const matchedKeywords = question.keywords.filter((keyword) => normalizedResponse.includes(normalizeText(keyword)));
  const keywordCoverage = Math.round((matchedKeywords.length / question.keywords.length) * 100);
  const hasStructure = question.language
    ? question.language === 'SQL'
      ? /\b(?:select|from|with)\b/i.test(trimmed)
      : /(?:\breturn\b|\bfunction\b|\bdef\b|\bfor\b|\bif\b|=>)/i.test(trimmed)
    : /(first|next|then|finally|because|for example|in summary|if|when)/i.test(trimmed);
  const score = Math.min(100, keywordCoverage + (hasStructure ? 10 : 0) + (trimmed.length > 160 ? 5 : 0));

  const label = question.language
    ? score >= 85 ? 'Strong rubric match' : score >= 65 ? 'Good rubric match' : 'Review the implementation'
    : score >= 85 ? 'Strong answer' : score >= 65 ? 'Solid answer' : 'Needs more depth';
  const missingPoints = question.checklist
    .filter((item) => !matchedKeywords.some((keyword) => normalizeText(item).includes(normalizeText(keyword))))
    .slice(0, 2);
  const feedback = question.language
    ? `Text-based rubric matched ${matchedKeywords.length}/${question.keywords.length} implementation signals. ${matchedKeywords.length === question.keywords.length ? 'All tracked signals are present.' : 'Compare your solution with the checklist and sample cases.'} Code is not executed; verify the sample cases yourself.`
    : matchedKeywords.length === question.keywords.length
      ? 'You covered the key pillars of a strong answer. Your response is clear and decision-oriented.'
      : `You touched ${matchedKeywords.length}/${question.keywords.length} important points. Add ${missingPoints.join(' and ')} to make the answer more complete.`;

  return {
    score: Math.round(score),
    label,
    feedback,
    answer: question.idealAnswer,
  };
};

const concepts = [
  'Variables',
  'Loops',
  'Conditionals',
  'Functions',
  'Recursion',
  'Data Structures',
  'Big-O',
  'Debugging',
];

const masteryMap = [
  { label: 'Algorithms', value: 86, tone: 'cyan' },
  { label: 'Databases', value: 72, tone: 'violet' },
  { label: 'Systems', value: 63, tone: 'gold' },
  { label: 'Security', value: 58, tone: 'lime' },
];

const habitBoard = [
  { label: 'Practice streak', value: 7, total: 7, note: '7-day run' },
  { label: 'Daily challenges', value: 4, total: 5, note: '1 left today' },
  { label: 'Concept review', value: 9, total: 10, note: 'Nearly mastered' },
];

const signalStates = [
  { label: 'Pattern detected', title: 'You are ready for a systems jump.', detail: 'Your database and algorithm signals are strong enough to attempt a distributed-systems scenario.', action: 'Open systems lab', href: '/quests?category=Distributed%20Systems' },
  { label: 'Weak signal', title: 'Turn one miss into momentum.', detail: 'Reviewing one tricky concept now gives your recall a better chance than starting another easy quest.', action: 'Review missed quests', href: '/quests?mode=review' },
  { label: 'High voltage', title: 'Your streak has launch energy.', detail: 'A three-question daily run is the fastest route to the next reward checkpoint today.', action: 'Start daily run', href: '/quests?mode=daily' },
];

const challengeTopics = Array.from(new Set(
  interviewQuestions.flatMap((question) => question.tags ?? [question.mission])
)).sort();

const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export default function HomePage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [shareStatus, setShareStatus] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [signalIndex, setSignalIndex] = useState(0);
  const [leaderboardStatus, setLeaderboardStatus] = useState('');
  const [interviewAnswers, setInterviewAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      interviewQuestions
        .filter((question) => question.language && question.starterCode)
        .map((question) => [question.id, question.starterCode ?? ''])
    )
  );
  const [selectedLanguages, setSelectedLanguages] = useState<Record<string, CodingLanguage>>(() =>
    interviewQuestions.reduce<Record<string, CodingLanguage>>((languages, question) => {
      if (question.language) languages[question.id] = question.language;
      return languages;
    }, {})
  );
  const [interviewResults, setInterviewResults] = useState<Record<string, InterviewResult>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [savedChallenges, setSavedChallenges] = useState<Record<string, boolean>>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('All difficulties');
  const [selectedTopic, setSelectedTopic] = useState('All topics');
  const [interviewSearch, setInterviewSearch] = useState('');
  const [needsReviewOnly, setNeedsReviewOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
  const [elapsedByChallenge, setElapsedByChallenge] = useState<Record<string, number>>({});
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([]);
  const [codingPracticeLoaded, setCodingPracticeLoaded] = useState(false);
  const [studyCoach, setStudyCoach] = useState({ focus: 'System Design', note: 'Keep momentum and complete a strong daily run.' });

  const currentSignal = signalStates[signalIndex];
  const readiness = Math.min(96, 58 + completedQuests.length * 7);
  const filteredInterviewQuestions = interviewQuestions
    .map((question, index) => ({
      question,
      index,
      codingNumber: question.language
        ? interviewQuestions.slice(0, index).filter((previous) => Boolean(previous.language)).length + 1
        : null,
    }))
    .filter(({ question }) => {
      const difficulty = question.difficulty ?? 'Practice';
      const topics = question.tags ?? [question.mission];
      const searchText = [question.question, question.mission, ...topics].join(' ').toLowerCase();
      return (selectedDifficulty === 'All difficulties' || difficulty === selectedDifficulty)
        && (selectedTopic === 'All topics' || topics.includes(selectedTopic))
        && (!savedOnly || Boolean(savedChallenges[question.id]))
        && (!needsReviewOnly || !interviewResults[question.id] || !interviewAnswers[question.id]?.trim())
        && (!interviewSearch.trim() || searchText.includes(interviewSearch.trim().toLowerCase()));
    });
  const reviewedInterviewCount = interviewQuestions.filter((question) =>
    Boolean(interviewResults[question.id] && interviewAnswers[question.id]?.trim())
  ).length;

  useEffect(() => {
    const savedProgress = window.localStorage.getItem('code-quest:progress');
    if (!savedProgress) {
      setStudyCoach({ focus: 'System Design', note: 'You are ready for a higher-difficulty systems sprint.' });
      return;
    }

    try {
      const parsed = JSON.parse(savedProgress) as { completedIds?: string[]; missedIds?: string[] };
      const missedCount = Array.isArray(parsed.missedIds) ? parsed.missedIds.length : 0;
      const focus = missedCount > 0
        ? 'Review queue'
        : 'System Design';
      const note = missedCount > 0
        ? `You have ${missedCount} missed challenge${missedCount === 1 ? '' : 's'} to revisit before the next streak push.`
        : 'Your momentum is strong. Maintain the streak and push into a harder systems challenge.';

      setStudyCoach({ focus, note });
    } catch {
      setStudyCoach({ focus: 'System Design', note: 'Your momentum is strong. Maintain the streak and push into a harder systems challenge.' });
    }
  }, [completedQuests.length]);

  const handleInterviewEvaluation = (question: InterviewQuestion) => {
    const result = evaluateInterviewAnswer(question, interviewAnswers[question.id] ?? '');
    setInterviewResults((prev) => ({ ...prev, [question.id]: result }));
  };

  const toggleHint = (questionId: string) => {
    setShowHints((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleSavedChallenge = (questionId: string) => {
    setSavedChallenges((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const changeCodingLanguage = (questionId: string, language: CodingLanguage) => {
    setSelectedLanguages((previous) => ({ ...previous, [questionId]: language }));
  };

  const focusRandomPrompt = () => {
    const prompt = filteredInterviewQuestions[Math.floor(Math.random() * filteredInterviewQuestions.length)];
    if (prompt) {
      document.getElementById(`interview-${prompt.question.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const submitChallengeForReview = (question: InterviewQuestion) => {
    const result = evaluateInterviewAnswer(question, interviewAnswers[question.id] ?? '');
    const elapsedSeconds = elapsedByChallenge[question.id] ?? 0;

    setInterviewResults((prev) => ({ ...prev, [question.id]: result }));
    setSubmissionHistory((previous) => [
      {
        id: question.id,
        submittedAt: new Date().toISOString(),
        elapsedSeconds,
        score: result.score,
        code: interviewAnswers[question.id] ?? '',
      },
      ...previous,
    ].slice(0, 100));
    setActiveTimerId((activeId) => activeId === question.id ? null : activeId);
  };

  const shareProgress = async () => {
    const shareUrl = `${window.location.origin}/?player=Byte%20Knight&cleared=${completedQuests.length}`;
    const shareData = {
      title: 'Byte Knight\'s Code Quest progress',
      text: `${completedQuests.length} quests cleared in Code Quest Academy.`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus('Progress shared');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('Snapshot link copied');
      }
    } catch {
      setShareStatus('Sharing cancelled');
    }
  };

  const saveLeaderboardScore = async () => {
    setLeaderboardStatus('Saving...');

    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Byte Knight',
          xp: 12_450 + completedQuests.length * 120,
          streak: 9,
          badge: completedQuests.length >= 9 ? 'Interview Ready' : 'Logic Legend',
        }),
      });

      if (!response.ok) throw new Error('Unable to save score');

      const data = await response.json();
      setLeaderboard(data.leaderboard ?? []);
      setLeaderboardStatus('Score saved');
    } catch {
      setLeaderboardStatus('Could not save score');
    }
  };

  useEffect(() => {
    const savedProgress = window.localStorage.getItem('code-quest:progress');

    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress) as { completedIds?: unknown };
        if (Array.isArray(parsed.completedIds)) {
          setCompletedQuests(parsed.completedIds.filter((id): id is string => typeof id === 'string'));
        }
      } catch {
        window.localStorage.removeItem('code-quest:progress');
      }
    }
  }, []);

  useEffect(() => {
    const savedPractice = window.localStorage.getItem('code-quest:coding-practice');
    if (savedPractice) {
      try {
        const parsed = JSON.parse(savedPractice) as {
          savedChallenges?: unknown;
          elapsedByChallenge?: unknown;
          submissionHistory?: unknown;
          interviewAnswers?: unknown;
          interviewResults?: unknown;
          selectedLanguages?: unknown;
        };

        if (parsed.savedChallenges && typeof parsed.savedChallenges === 'object' && !Array.isArray(parsed.savedChallenges)) {
          setSavedChallenges(Object.fromEntries(
            Object.entries(parsed.savedChallenges).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean')
          ));
        }
        if (parsed.elapsedByChallenge && typeof parsed.elapsedByChallenge === 'object' && !Array.isArray(parsed.elapsedByChallenge)) {
          const elapsed = Object.fromEntries(
            Object.entries(parsed.elapsedByChallenge).filter((entry): entry is [string, number] =>
              typeof entry[1] === 'number' && Number.isFinite(entry[1]) && entry[1] >= 0
            )
          );
          setElapsedByChallenge(elapsed);
        }
        if (Array.isArray(parsed.submissionHistory)) {
          setSubmissionHistory(parsed.submissionHistory.filter((item): item is SubmissionHistoryItem =>
            typeof item === 'object'
            && item !== null
            && 'id' in item
            && typeof item.id === 'string'
            && 'submittedAt' in item
            && typeof item.submittedAt === 'string'
            && 'elapsedSeconds' in item
            && typeof item.elapsedSeconds === 'number'
            && 'score' in item
            && typeof item.score === 'number'
            && 'code' in item
            && typeof item.code === 'string'
          ));
        }
        if (parsed.interviewAnswers && typeof parsed.interviewAnswers === 'object' && !Array.isArray(parsed.interviewAnswers)) {
          const answers: Record<string, string> = {};
          for (const [id, value] of Object.entries(parsed.interviewAnswers)) {
            if (interviewQuestionIds.has(id) && typeof value === 'string') answers[id] = value;
          }
          setInterviewAnswers((current) => ({ ...current, ...answers }));
        }
        if (parsed.interviewResults && typeof parsed.interviewResults === 'object' && !Array.isArray(parsed.interviewResults)) {
          const results: Record<string, InterviewResult> = {};
          for (const [id, value] of Object.entries(parsed.interviewResults)) {
            if (interviewQuestionIds.has(id) && isInterviewResult(value)) results[id] = value;
          }
          setInterviewResults(results);
        }
        if (parsed.selectedLanguages && typeof parsed.selectedLanguages === 'object' && !Array.isArray(parsed.selectedLanguages)) {
          const languages: Record<string, CodingLanguage> = {};
          for (const [id, value] of Object.entries(parsed.selectedLanguages)) {
            if (codingQuestionIds.has(id) && isCodingLanguage(value)) languages[id] = value;
          }
          setSelectedLanguages((current) => ({ ...current, ...languages }));
        }
      } catch {
        window.localStorage.removeItem('code-quest:coding-practice');
      }
    }
    setCodingPracticeLoaded(true);
  }, []);

  useEffect(() => {
    if (codingPracticeLoaded) {
      window.localStorage.setItem('code-quest:coding-practice', JSON.stringify({
        savedChallenges,
        elapsedByChallenge,
        submissionHistory,
        interviewAnswers,
        interviewResults,
        selectedLanguages,
      }));
    }
  }, [codingPracticeLoaded, savedChallenges, elapsedByChallenge, submissionHistory, interviewAnswers, interviewResults, selectedLanguages]);

  useEffect(() => {
    if (!activeTimerId) return;

    const interval = window.setInterval(() => {
      setElapsedByChallenge((previous) => ({
        ...previous,
        [activeTimerId]: (previous[activeTimerId] ?? 0) + 1,
      }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [activeTimerId]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => setLeaderboard(data.leaderboard ?? []))
      .catch(() => setLeaderboard([]));

    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status === 'online' ? 'edge online' : 'degraded'))
      .catch(() => setApiStatus('unavailable'));
  }, []);

  return (
    <main className="page-shell">
      <nav className="top-nav" aria-label="Primary navigation">
        <Link href="/" className="brand-mark"><span className="brand-orb">CQ</span> Code Quest</Link>
        <div className="nav-links">
          <a href="#missions">Missions</a>
          <Link href="/quests">Quest board</Link>
          <span className="profile-pill"><span className="online-dot" /> Byte Knight</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">LEVEL UP YOUR BRAIN</p>
          <h1>Code Quest Academy</h1>
          <p className="subtitle">
            Learn computer science through quests, boss fights, and absurdly satisfying pixel-powered challenges.
          </p>

          <div className="cta-row">
            <Link href="/quests" className="primary button-link">
              Start Quest
            </Link>
            <a href="#missions" className="secondary button-link">
              View syllabus
            </a>
          </div>

          <div className="stats">
            <div>
              <strong>24k+</strong>
              <span>students</span>
            </div>
            <div>
              <strong>82%</strong>
              <span>retention</span>
            </div>
            <div>
              <strong>3x</strong>
              <span>more fun</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="avatar-card">
            <div className="avatar-badge">LVL 14 <span>• ON A ROLL</span></div>
            <div className="avatar-coin">◉</div>
            <h3>Player: Byte Knight</h3>
            <ul>
              <li><span>XP earned</span><strong>{12_450 + completedQuests.length * 120}</strong></li>
              <li><span>Streak</span><strong>9 days</strong></li>
              <li><span>Guild</span><strong>Logic Legends</strong></li>
            </ul>
            <div className="level-progress"><span style={{ width: `${Math.min(100, 42 + completedQuests.length * 8)}%` }} /></div>
            <small className="progress-caption">{completedQuests.length} quests cleared this cycle</small>
            <button className="share-progress" onClick={shareProgress}>Share progress <span>↗</span></button>
            {shareStatus && <small className="share-status" role="status">{shareStatus}</small>}
          </div>
        </div>
      </section>

      <section className="command-bar" aria-label="Your learning progress">
        <div className="command-label"><span className="pulse-dot" /> DAILY RUN <strong>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date())}</strong></div>
        <div className="command-stat"><span>Cycle progress</span><strong>{completedQuests.length}/12 quests</strong></div>
        <div className="command-stat"><span>API layer</span><strong className="service-status">{apiStatus}</strong></div>
        <div className="command-stat"><span>Next reward</span><strong>+500 XP <small>at 12 quests</small></strong></div>
        <Link href="/quests" className="command-action">Resume run <span>→</span></Link>
      </section>

      <section className="signal-console" aria-label="Adaptive learning signal">
        <div className="signal-orbit" aria-hidden="true"><span>{readiness}%</span><small>READY</small></div>
        <div className="signal-copy">
          <p className="eyebrow">SIGNAL SCAN / PERSONALIZED</p>
          <p className="signal-label">{currentSignal.label}</p>
          <h2>{currentSignal.title}</h2>
          <p>{currentSignal.detail}</p>
          <Link href={currentSignal.href} className="signal-action">{currentSignal.action} <span>↗</span></Link>
        </div>
        <button className="scan-button" onClick={() => setSignalIndex((index) => (index + 1) % signalStates.length)} aria-label="Scan for another learning signal">
          <span>↻</span> Scan again
        </button>
      </section>

      <section className="learning-strip">
        {concepts.map((concept) => (
          <span key={concept} className="chip">{concept}</span>
        ))}
      </section>

      <section className="study-coach" aria-label="Adaptive study coach">
        <div>
          <p className="eyebrow">ADAPTIVE STUDY COACH</p>
          <h3>Current focus: {studyCoach.focus}</h3>
        </div>
        <p>{studyCoach.note}</p>
      </section>

      <section className="feature-grid" aria-label="Progress and habit features">
        <motion.article
          className="feature-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="panel-header">
            <div>
              <p className="eyebrow">SKILL MAP</p>
              <h3>Mastery radar</h3>
            </div>
            <span className="panel-badge">+12% this week</span>
          </div>

          <div className="mastery-list">
            {masteryMap.map((skill) => (
              <div key={skill.label} className="mastery-row">
                <div className="mastery-meta">
                  <span>{skill.label}</span>
                  <strong>{skill.value}%</strong>
                </div>
                <div className="progress-bar">
                  <motion.span
                    className={`progress-fill ${skill.tone}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.value}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          className="feature-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
        >
          <div className="panel-header">
            <div>
              <p className="eyebrow">STREAK ENGINE</p>
              <h3>Weekly momentum</h3>
            </div>
            <span className="panel-badge panel-badge-alt">Goal: 5/5</span>
          </div>

          <div className="habit-list">
            {habitBoard.map((habit) => (
              <div key={habit.label} className="habit-row">
                <div className="habit-topline">
                  <span>{habit.label}</span>
                  <strong>{habit.value}/{habit.total}</strong>
                </div>
                <div className="progress-bar compact">
                  <motion.span
                    className="progress-fill lime"
                    initial={{ width: 0 }}
                    animate={{ width: `${(habit.value / habit.total) * 100}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
                <small>{habit.note}</small>
              </div>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="achievement-panel" aria-label="Achievements and milestone rewards">
        <div className="panel-header">
          <div>
            <p className="eyebrow">ACHIEVEMENTS</p>
            <h3>Milestone vault</h3>
          </div>
          <span className="panel-badge panel-badge-alt">{Math.min(4, completedQuests.length + 1)} unlocked</span>
        </div>

        <div className="achievement-list">
          {[
            { title: 'First Win', unlocked: completedQuests.length >= 1, detail: 'Clear your first quest' },
            { title: 'Momentum Builder', unlocked: completedQuests.length >= 3, detail: 'Complete 3 consecutive challenge sets' },
            { title: 'Systems Scout', unlocked: completedQuests.length >= 6, detail: 'Earn a systems-focused streak' },
            { title: 'Interview Ready', unlocked: completedQuests.length >= 9, detail: 'Finish 9 missions and review the lab' },
          ].map((achievement) => (
            <div key={achievement.title} className={`achievement-item ${achievement.unlocked ? 'active' : ''}`}>
              <span className="achievement-icon">{achievement.unlocked ? '✓' : '★'}</span>
              <div>
                <strong>{achievement.title}</strong>
                <small>{achievement.detail}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="missions" className="missions">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ACTIVE MISSIONS</p>
            <h2>Pick your next challenge</h2>
          </div>
          <Link href="/quests" className="text-link">View all missions →</Link>
        </div>

        <div className="mission-grid">
          {missions.map((mission) => (
            <article key={mission.title} className="mission-card">
              <div className="mission-topline">
                <span className="difficulty">{mission.difficulty}</span>
                <span className="xp">+{mission.xp} XP</span>
              </div>
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
              <div className="mission-meta"><span>▰ 3 checkpoints</span><span>◷ 8 min</span></div>
              <Link
                href={{
                  pathname: '/quests',
                  query: { category: mission.category },
                }}
                className="mission-button"
              >
                Enter mission
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-summary-strip" aria-label="Coding practice features">
        <div className="summary-pill">
          <span className="summary-kicker">Practice time</span>
          <strong>{formatDuration(Object.values(elapsedByChallenge).reduce((total, seconds) => total + seconds, 0))}</strong>
        </div>
        <div className="summary-pill">
          <span className="summary-kicker">Saved</span>
          <strong>{Object.values(savedChallenges).filter(Boolean).length} challenges</strong>
        </div>
        <div className="summary-pill">
          <span className="summary-kicker">Submissions</span>
          <strong>{submissionHistory.length} attempts</strong>
        </div>
        <div className="summary-pill">
          <span className="summary-kicker">Hints</span>
          <strong>{Object.values(showHints).filter(Boolean).length} opened</strong>
        </div>
      </section>

      <section id="interview-lab" className="interview-lab">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INTERVIEW LAB</p>
            <h2>Answer the question, then grade your response</h2>
          </div>
          <span className="panel-badge panel-badge-alt">{interviewQuestions.length} skill drills</span>
        </div>
        <p className="interview-intro">Practice interview explanations and solve coding challenges in a syntax-aware editor. Submissions are checked with a text-based rubric, not executed.</p>
        <div className="interview-progress" aria-live="polite">
          <strong>{reviewedInterviewCount}/{interviewQuestions.length}</strong>
          <span>prompts reviewed</span>
          <span className="interview-progress-track" aria-hidden="true">
            <span style={{ width: `${(reviewedInterviewCount / interviewQuestions.length) * 100}%` }} />
          </span>
          <small>Drafts save automatically on this device.</small>
        </div>
        <div className="problem-filters" aria-label="Filter coding problems">
          <label className="problem-search">
            <span>Search prompts</span>
            <input
              type="search"
              value={interviewSearch}
              onChange={(event) => setInterviewSearch(event.target.value)}
              placeholder="Try BFS, genetic algorithms, or graphs..."
            />
          </label>
          <label>
            <span>Difficulty</span>
            <select value={selectedDifficulty} onChange={(event) => setSelectedDifficulty(event.target.value)}>
              <option>All difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
              <option>Practice</option>
            </select>
          </label>
          <label>
            <span>Topic</span>
            <select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)}>
              <option>All topics</option>
              {challengeTopics.map((topic) => <option key={topic}>{topic}</option>)}
            </select>
          </label>
          <button type="button" className={`saved-filter ${savedOnly ? 'active' : ''}`} onClick={() => setSavedOnly((current) => !current)}>
            {savedOnly ? 'Showing saved' : 'Saved only'} ({Object.values(savedChallenges).filter(Boolean).length})
          </button>
          <button type="button" className={`saved-filter ${needsReviewOnly ? 'active' : ''}`} onClick={() => setNeedsReviewOnly((current) => !current)}>
            {needsReviewOnly ? 'Needs review' : 'Not reviewed'} ({interviewQuestions.length - reviewedInterviewCount})
          </button>
          <button type="button" className="saved-filter random-prompt" onClick={focusRandomPrompt} disabled={filteredInterviewQuestions.length === 0}>
            Pick random prompt
          </button>
          <span className="filter-count">Showing {filteredInterviewQuestions.length} of {interviewQuestions.length} prompts</span>
        </div>
        <div className="interview-grid">
          {filteredInterviewQuestions.length === 0 && (
            <p className="empty-problems">No prompts match these filters. Try another search, difficulty, or topic.</p>
          )}
          {filteredInterviewQuestions.map(({ question: interview, index, codingNumber }) => {
            const result = interviewResults[interview.id];
            const answer = interviewAnswers[interview.id] ?? '';
            const editorLanguage = selectedLanguages[interview.id] ?? interview.language ?? 'JavaScript';
            const questionSubmissions = submissionHistory.filter((submission) => submission.id === interview.id);
            const isCodingChallenge = Boolean(interview.language);

            return (
              <article id={`interview-${interview.id}`} key={interview.id} className="interview-question-card">
                <div className="leetcode-header">
                  <div className="leetcode-title-group">
                    <span className={`leetcode-badge ${interview.difficulty?.toLowerCase() ?? 'practice'}`}>{interview.difficulty ?? 'Practice'}</span>
                    <strong>{interview.language ? `Problem ${codingNumber}` : 'Concept prompt'}</strong>
                  </div>
                  <div className="leetcode-meta">
                    <span className="acceptance-pill">{interview.acceptance ?? 'Top 90%'}</span>
                    <button type="button" className="mini-toggle" onClick={() => toggleSavedChallenge(interview.id)}>
                      {savedChallenges[interview.id] ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>

                <div className="interview-question-header">
                  <span className="interview-number">
                    {String(isCodingChallenge ? codingNumber : index + 1).padStart(2, '0')}
                  </span>
                  <div className="interview-heading">
                    <small>{interview.language ? `${editorLanguage} · CODING CHALLENGE` : interview.mission}</small>
                    <strong>{interview.question}</strong>
                  </div>
                </div>

                {interview.tags && (
                  <div className="tag-row">
                    {interview.tags.map((tag) => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                )}

                {interview.hint && (
                  <div className={`hint-panel ${showHints[interview.id] ? 'open' : ''}`}>
                    <button type="button" className="hint-toggle" onClick={() => toggleHint(interview.id)}>
                      {showHints[interview.id] ? 'Hide hint' : 'Show hint'}
                    </button>
                    {showHints[interview.id] && <p>{interview.hint}</p>}
                  </div>
                )}

                {interview.starterCode && interview.examples && (
                  <div className="interview-coding-prompt">
                    <div className="interview-starter">
                      <strong>Starter code · {interview.language}</strong>
                      <pre><code>{interview.starterCode}</code></pre>
                    </div>
                    <div className="interview-examples">
                      <strong>Sample cases</strong>
                      {interview.examples.map((example) => (
                        <div key={example.input}>
                          <code>{example.input}</code>
                          <span aria-hidden="true">→</span>
                          <code>{example.output}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {interview.language
                  ? <>
                      <label className="interview-language-control">
                        <span>Editor language</span>
                        <select
                          value={editorLanguage}
                          onChange={(event) => {
                            if (isCodingLanguage(event.target.value)) {
                              changeCodingLanguage(interview.id, event.target.value);
                            }
                          }}
                          aria-label={`Editor language for ${interview.question}`}
                        >
                          {codingLanguages.map((language) => <option key={language} value={language}>{language}</option>)}
                        </select>
                        <small>Changing languages updates syntax highlighting; it does not translate your code.</small>
                      </label>
                      <CodeEditor
                        language={editorLanguage}
                        value={answer}
                        onChange={(value) => setInterviewAnswers((prev) => ({ ...prev, [interview.id]: value }))}
                      />
                    </>
                  : <textarea
                      className="interview-response"
                      value={answer}
                      onChange={(event) => setInterviewAnswers((prev) => ({ ...prev, [interview.id]: event.target.value }))}
                      placeholder="Type your answer here..."
                      aria-label={`${interview.mission} interview response`}
                      rows={5}
                    />}

                <div className="interview-actions">
                  {isCodingChallenge ? (
                    <>
                      <button
                        type="button"
                        className="interview-action-button"
                        onClick={() => submitChallengeForReview(interview)}
                        disabled={!answer.trim()}
                      >
                        Submit for review
                      </button>
                      <div className="challenge-timer" role="group" aria-label={`${editorLanguage} challenge timer`}>
                        <span aria-live="off">{formatDuration(elapsedByChallenge[interview.id] ?? 0)}</span>
                        {activeTimerId === interview.id ? (
                          <button type="button" onClick={() => setActiveTimerId(null)}>Pause</button>
                        ) : (
                          <button type="button" onClick={() => setActiveTimerId(interview.id)}>Start timer</button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTimerId((activeId) => activeId === interview.id ? null : activeId);
                            setElapsedByChallenge((previous) => ({ ...previous, [interview.id]: 0 }));
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </>
                  ) : (
                    <button type="button" className="interview-action-button" onClick={() => handleInterviewEvaluation(interview)}>
                      Evaluate answer
                    </button>
                  )}
                  <button
                    type="button"
                    className="interview-action-button secondary"
                    onClick={() => {
                      setInterviewAnswers((prev) => ({ ...prev, [interview.id]: '' }));
                      setInterviewResults((prev) => {
                        const next = { ...prev };
                        delete next[interview.id];
                        return next;
                      });
                    }}
                  >
                    Clear
                  </button>
                </div>

                {isCodingChallenge && questionSubmissions.length > 0 && (
                  <details className="submission-history">
                    <summary>Submission history ({questionSubmissions.length})</summary>
                    <ol>
                      {questionSubmissions.slice(0, 5).map((submission, submissionIndex) => (
                        <li key={`${submission.submittedAt}-${submissionIndex}`}>
                          <span>{submission.submittedAt.slice(0, 16).replace('T', ' ')} UTC</span>
                          <strong>{submission.score}% rubric</strong>
                          <small>{formatDuration(submission.elapsedSeconds)} elapsed</small>
                          <pre><code>{submission.code}</code></pre>
                        </li>
                      ))}
                    </ol>
                  </details>
                )}

                {result && (
                  <div className={`interview-result ${result.score >= 80 ? 'success' : result.score >= 60 ? 'warning' : 'error'}`}>
                    <div className="interview-score-row">
                      <strong>{result.score}%</strong>
                      <span>{result.label}</span>
                    </div>
                    <p>{result.feedback}</p>
                    <div className="optimal-answer">
                      <strong>{interview.language ? 'Reference solution' : 'Most optimal answer'}</strong>
                      {interview.language
                        ? <>
                            <pre className="interview-reference-code"><code>{result.answer}</code></pre>
                            {interview.complexity && (
                              <div className="complexity-summary" aria-label="Reference solution complexity">
                                <strong>Complexity</strong>
                                <span>Time: {interview.complexity.time}</span>
                                <span>Space: {interview.complexity.space}</span>
                                <small>{interview.complexity.notes}</small>
                              </div>
                            )}
                          </>
                        : <p>{result.answer}</p>}
                    </div>
                  </div>
                )}

                <ul className="interview-checklist">
                  {interview.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="daily-challenge">
        <div className="daily-art"><span>DAILY</span><strong>⚡</strong><small>RUN 09</small></div>
        <div className="daily-copy">
          <p className="eyebrow">LIMITED-TIME CHALLENGE</p>
          <h2>The Cache is Lava</h2>
          <p>Architect a caching strategy before latency melts your service. Three scenarios. One clean design.</p>
          <div className="daily-rewards"><span>+350 XP</span><span>Rare badge</span><span>Ends in 08:42:16</span></div>
        </div>
        <Link href="/quests?mode=daily" className="primary button-link">Take the challenge</Link>
      </section>

      <section className="leaderboard-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HALL OF FAME</p>
            <h2>Global leaderboard</h2>
          </div>
          <div className="leaderboard-actions">
            <button type="button" className="leaderboard-save" onClick={saveLeaderboardScore}>Save my score</button>
            {leaderboardStatus && <small role="status">{leaderboardStatus}</small>}
          </div>
        </div>

        <div className="leaderboard-list">
          {leaderboard.map((entry, index) => (
            <div key={`${entry.name}-${index}`} className="leaderboard-row">
              <span className="leaderboard-rank">#{index + 1}</span>
              <div className="leaderboard-name-wrap">
                <strong>{entry.name}</strong>
                <small>{entry.badge}</small>
              </div>
              <span className="leaderboard-xp">{entry.xp} XP</span>
              <span className="leaderboard-streak">{entry.streak} day streak</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
