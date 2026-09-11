import { NextResponse } from 'next/server';

const quests = [
  {
    id: 'ai-agent-goal',
    title: 'Agent Intent',
    difficulty: 'Beginner',
    xp: 120,
    category: 'AI',
    concept: 'Agents',
    prompt: 'What is the primary goal of an AI agent?',
    choices: ['To store data only', 'To perform tasks toward a goal using available inputs', 'To replace all software engineers', 'To avoid using models entirely'],
    correctAnswer: 'To perform tasks toward a goal using available inputs',
    explanation: 'AI agents are designed to interpret context and act to accomplish a goal, often using tools or reasoning.'
  },
  {
    id: 'ai-search',
    title: 'Search Strategy',
    difficulty: 'Intermediate',
    xp: 240,
    category: 'AI',
    concept: 'Reasoning',
    prompt: 'Which approach is most associated with AI systems that reason over multiple steps before responding?',
    choices: ['One-shot lookup', 'Chain-of-thought style planning', 'Manual spreadsheet entry', 'Hard-coded HTML'],
    correctAnswer: 'Chain-of-thought style planning',
    explanation: 'Modern AI systems often break a problem into intermediate reasoning steps before giving a final answer.'
  },
  {
  id: 'ai-rl-policy',
  title: 'Reward Route',
  difficulty: 'Intermediate',
  xp: 260,
  category: 'AI',
  concept: 'Reinforcement Learning',
  prompt: 'In reinforcement learning, what does a policy represent?',
  choices: ['A set of labels', 'A mapping from states to actions', 'A database schema', 'A loss function'],
  correctAnswer: 'A mapping from states to actions',
  explanation: 'A policy defines how an agent chooses actions based on the current state.'
},
  {
    id: 'ml-supervised',
    title: 'Labeled Learning',
    difficulty: 'Beginner',
    xp: 150,
    category: 'Machine Learning',
    concept: 'Supervised Learning',
    prompt: 'Which type of machine learning relies on labeled examples during training?',
    choices: ['Unsupervised learning', 'Supervised learning', 'Data mining only', 'Rule-based scripting'],
    correctAnswer: 'Supervised learning',
    explanation: 'Supervised learning uses labeled inputs and outputs so the model learns a mapping from examples to target labels.'
  },
  {
    id: 'ml-overfitting',
    title: 'Bias vs Variance',
    difficulty: 'Advanced',
    xp: 500,
    category: 'Machine Learning',
    concept: 'Model Evaluation',
    prompt: 'What is the main issue when a model performs very well on training data but poorly on new data?',
    choices: ['Underfitting', 'Overfitting', 'Data leakage', 'Feature scaling'],
    correctAnswer: 'Overfitting',
    explanation: 'Overfitting happens when the model learns noise or memorizes the training set instead of generalizing to unseen examples.'
  },
  {
  id: 'ml-regularization',
  title: 'Penalty Power',
  difficulty: 'Advanced',
  xp: 500,
  category: 'Machine Learning',
  concept: 'Regularization',
  prompt: 'Why is regularization used in machine learning?',
  choices: ['To increase model size', 'To prevent overfitting by penalizing complexity', 'To remove all features', 'To guarantee perfect accuracy'],
  correctAnswer: 'To prevent overfitting by penalizing complexity',
  explanation: 'Regularization discourages overly complex models that memorize training data.'
},
  {
    id: 'mining-association',
    title: 'Pattern Mining',
    difficulty: 'Intermediate',
    xp: 270,
    category: 'Data Mining',
    concept: 'Association Rules',
    prompt: 'What is the goal of association rule mining?',
    choices: ['To generate executable code', 'To find frequent relationships among items in data', 'To compress images', 'To compare CPU speeds'],
    correctAnswer: 'To find frequent relationships among items in data',
    explanation: 'Association rule mining discovers patterns like “customers who buy A also often buy B.”'
  },
  {
    id: 'mining-dimensions',
    title: 'Feature Clutter',
    difficulty: 'Advanced',
    xp: 420,
    category: 'Data Mining',
    concept: 'Dimensionality Reduction',
    prompt: 'Why is dimensionality reduction useful in data mining?',
    choices: ['It creates more labels automatically', 'It reduces noise and makes high-dimensional data easier to analyze', 'It turns all data into binary form', 'It guarantees perfect predictions'],
    correctAnswer: 'It reduces noise and makes high-dimensional data easier to analyze',
    explanation: 'Dimensionality reduction helps simplify large feature spaces while preserving the important structure in the data.'
  },
  {
    id: 'dbms-normalization',
    title: 'Schema Cleanup',
    difficulty: 'Beginner',
    xp: 130,
    category: 'DBMS',
    concept: 'Normalization',
    prompt: 'What is the main purpose of normalization in a database?',
    choices: ['To speed up all queries equally', 'To reduce redundancy and improve data integrity', 'To hide all table names', 'To convert SQL into JSON'],
    correctAnswer: 'To reduce redundancy and improve data integrity',
    explanation: 'Normalization organizes data to minimize duplication and keep records consistent across the database.'
  },
  {
    id: 'dbms-index',
    title: 'Index Boost',
    difficulty: 'Intermediate',
    xp: 260,
    category: 'DBMS',
    concept: 'Indexing',
    prompt: 'Why are database indexes created?',
    choices: ['To rewrite SQL queries', 'To speed up data lookup for common searches', 'To store backups permanently', 'To encrypt table rows'],
    correctAnswer: 'To speed up data lookup for common searches',
    explanation: 'Indexes let databases locate rows faster without scanning every record in a table.'
  },
  {
    id: 'os-scheduling',
    title: 'Scheduler Showdown',
    difficulty: 'Intermediate',
    xp: 280,
    category: 'Operating Systems',
    concept: 'Process Scheduling',
    prompt: 'What does a process scheduler decide?',
    choices: ['Which application should run next', 'How many users can log in', 'Whether a database is normalized', 'How to compress a file'],
    correctAnswer: 'Which application should run next',
    explanation: 'A scheduler manages CPU time allocation so processes get a fair and efficient share of execution.'
  },
  {
    id: 'os-memory',
    title: 'Memory Maze',
    difficulty: 'Advanced',
    xp: 430,
    category: 'Operating Systems',
    concept: 'Memory Management',
    prompt: 'Why is virtual memory important?',
    choices: ['It lets the system use more memory than may physically be available', 'It makes files smaller automatically', 'It prevents all CPU interrupts', 'It replaces the file system'],
    correctAnswer: 'It lets the system use more memory than may physically be available',
    explanation: 'Virtual memory extends logical memory space and helps systems run larger workloads by managing paging and swapping.'
  },
  {
    id: 'design-scalability',
    title: 'Scale Like a Pro',
    difficulty: 'Intermediate',
    xp: 310,
    category: 'System Design',
    concept: 'Scalability',
    prompt: 'What is scalability in system design?',
    choices: ['The ability to handle increased load without major redesign', 'A way to reduce storage cost only', 'The process of writing SQL queries', 'A method to prevent code compilation'],
    correctAnswer: 'The ability to handle increased load without major redesign',
    explanation: 'Scalable systems can grow with demand by adding capacity or distributing work efficiently.'
  },
  {
    id: 'design-caching',
    title: 'Cache Quest',
    difficulty: 'Advanced',
    xp: 470,
    category: 'System Design',
    concept: 'Caching',
    prompt: 'Why do large systems use caches?',
    choices: ['To remove the need for databases', 'To reduce repeated expensive work and improve latency', 'To guarantee security', 'To replace all load balancers'],
    correctAnswer: 'To reduce repeated expensive work and improve latency',
    explanation: 'Caching stores frequently accessed data closer to the caller so repeated requests can be served faster.'
  },
  {
  id: 'design-loadbalancing',
  title: 'Balance Beam',
  difficulty: 'Intermediate',
  xp: 310,
  category: 'System Design',
  concept: 'Load Balancing',
  prompt: 'What is the main purpose of a load balancer?',
  choices: ['To store backups', 'To distribute traffic across multiple servers', 'To compress logs', 'To remove caching'],
  correctAnswer: 'To distribute traffic across multiple servers',
  explanation: 'Load balancers improve reliability and performance by spreading workload.'
},

{
  id: 'crypto-symmetric',
  title: 'Key Match',
  difficulty: 'Intermediate',
  xp: 260,
  category: 'Cryptography',
  concept: 'Symmetric Encryption',
  prompt: 'What characterizes symmetric encryption?',
  choices: ['Different keys for encryption and decryption', 'Same key for encryption and decryption', 'No keys used', 'Only hashes are generated'],
  correctAnswer: 'Same key for encryption and decryption',
  explanation: 'Symmetric encryption uses one shared key for both operations.'
},

  {
    id: 'crypto-hash',
    title: 'Hashing Hunt',
    difficulty: 'Beginner',
    xp: 140,
    category: 'Cryptography',
    concept: 'Hash Functions',
    prompt: 'What is a hash function mainly used for?',
    choices: ['To encrypt data in reverse', 'To generate a fixed-size digest from input data', 'To store all user passwords in plain text', 'To create an index for a CPU'],
    correctAnswer: 'To generate a fixed-size digest from input data',
    explanation: 'A hash function maps input data to a fixed digest useful for integrity checks and password storage workflows.'
  },
  {
  id: 'crypto-rsa',
  title: 'RSA Reveal',
  difficulty: 'Advanced',
  xp: 480,
  category: 'Cryptography',
  concept: 'Public Key Cryptography',
  prompt: 'What makes RSA a public-key algorithm?',
  choices: ['It uses hashing only', 'It uses separate public and private keys', 'It stores keys in plain text', 'It requires no math'],
  correctAnswer: 'It uses separate public and private keys',
  explanation: 'RSA relies on key pairs for secure communication.'
},

{
  id: 'cyber-authentication',
  title: 'Auth Basics',
  difficulty: 'Beginner',
  xp: 150,
  category: 'Cybersecurity',
  concept: 'Authentication',
  prompt: 'What is the main purpose of authentication in cybersecurity?',
  choices: ['To identify and verify users', 'To encrypt all files', 'To delete unused accounts', 'To monitor CPU usage'],
  correctAnswer: 'To identify and verify users',
  explanation: 'Authentication ensures that only legitimate users can access systems or data.'
},

{
  id: 'cyber-phishing',
  title: 'Phishing Alert',
  difficulty: 'Intermediate',
  xp: 280,
  category: 'Cybersecurity',
  concept: 'Threats',
  prompt: 'Which attack tricks users into revealing sensitive information through fake emails or websites?',
  choices: ['Phishing', 'SQL injection', 'DDoS', 'Man-in-the-middle'],
  correctAnswer: 'Phishing',
  explanation: 'Phishing attacks impersonate trusted sources to steal credentials or personal data.'
},

{
  id: 'cyber-zero-trust',
  title: 'Zero Trust',
  difficulty: 'Advanced',
  xp: 480,
  category: 'Cybersecurity',
  concept: 'Access Control',
  prompt: 'What is the principle behind zero trust security?',
  choices: ['Always trust internal users', 'Never trust, always verify', 'Encrypt only external traffic', 'Allow anonymous access'],
  correctAnswer: 'Never trust, always verify',
  explanation: 'Zero trust requires continuous verification of all users and devices, regardless of location.'
},

{
  id: 'arch-cpu-components',
  title: 'CPU Core',
  difficulty: 'Beginner',
  xp: 140,
  category: 'Computer Architecture',
  concept: 'CPU',
  prompt: 'Which component of the CPU performs arithmetic and logical operations?',
  choices: ['Control Unit', 'ALU', 'Cache', 'Registers'],
  correctAnswer: 'ALU',
  explanation: 'The Arithmetic Logic Unit (ALU) handles mathematical and logical computations.'
},

{
  id: 'arch-cache',
  title: 'Cache Clarity',
  difficulty: 'Intermediate',
  xp: 290,
  category: 'Computer Architecture',
  concept: 'Memory Hierarchy',
  prompt: 'Why are CPU caches used?',
  choices: ['To store backups', 'To reduce latency by keeping frequently used data close', 'To replace RAM', 'To encrypt memory'],
  correctAnswer: 'To reduce latency by keeping frequently used data close',
  explanation: 'Caches provide faster access to data than main memory, improving performance.'
}, 

{
  id: 'arch-risc-vs-cisc',
  title: 'Instruction Styles',
  difficulty: 'Advanced',
  xp: 500,
  category: 'Computer Architecture',
  concept: 'Instruction Sets',
  prompt: 'What distinguishes RISC from CISC architectures?',
  choices: ['RISC uses simpler instructions executed faster', 'CISC avoids using instructions', 'RISC encrypts all instructions', 'CISC eliminates memory'],
  correctAnswer: 'RISC uses simpler instructions executed faster',
  explanation: 'RISC emphasizes a small set of simple instructions, while CISC uses more complex ones.'
},

{
  id: 'se-testing-pyramid',
  title: 'Pyramid Precision',
  difficulty: 'Advanced',
  xp: 510,
  category: 'Software Engineering',
  concept: 'Testing',
  prompt: 'Why is relying heavily on end-to-end tests risky?',
  choices: ['They run extremely fast', 'They are brittle and slow to execute', 'They eliminate the need for unit tests', 'They guarantee perfect coverage'],
  correctAnswer: 'They are brittle and slow to execute',
  explanation: 'End-to-end tests are expensive and prone to breaking, so balanced test layers are essential.'
}, 

{
  id: 'se-design-singleton',
  title: 'Singleton Scrutiny',
  difficulty: 'Advanced',
  xp: 500,
  category: 'Software Engineering',
  concept: 'Design Patterns',
  prompt: 'Why is the Singleton pattern often discouraged in large systems?',
  choices: ['It increases performance', 'It introduces hidden global state and tight coupling', 'It guarantees thread safety', 'It simplifies dependency injection'],
  correctAnswer: 'It introduces hidden global state and tight coupling',
  explanation: 'Singletons act like global variables, making testing and modular design more difficult.'
}, 

{
  id: 'se-event-sourcing',
  title: 'Event Echo',
  difficulty: 'Advanced',
  xp: 530,
  category: 'Software Engineering',
  concept: 'Architecture',
  prompt: 'What is a key advantage of event sourcing?',
  choices: ['It removes the need for databases', 'It provides a complete history of state changes', 'It eliminates concurrency issues', 'It guarantees constant-time queries'],
  correctAnswer: 'It provides a complete history of state changes',
  explanation: 'Event sourcing stores all events, enabling auditability and reconstruction of past states.'
},

{
  id: 'ds-cap-theorem',
  title: 'CAP Conundrum',
  difficulty: 'Advanced',
  xp: 550,
  category: 'Distributed Systems',
  concept: 'CAP Theorem',
  prompt: 'In a partitioned distributed system, why might an AP design be chosen over CP?',
  choices: ['To guarantee strict consistency', 'To maintain availability despite network failures', 'To reduce server count', 'To eliminate replication'],
  correctAnswer: 'To maintain availability despite network failures',
  explanation: 'AP systems prioritize availability when partitions occur, accepting eventual consistency.'
}, 

{
  id: 'ds-2pc-limitations',
  title: 'Commit Crisis',
  difficulty: 'Advanced',
  xp: 560,
  category: 'Distributed Systems',
  concept: 'Distributed Transactions',
  prompt: 'What is a major limitation of two-phase commit (2PC)?',
  choices: ['It scales infinitely', 'It can block indefinitely if the coordinator fails', 'It eliminates all network latency', 'It guarantees perfect fault tolerance'],
  correctAnswer: 'It can block indefinitely if the coordinator fails',
  explanation: '2PC is not fault-tolerant; coordinator failure can halt the entire transaction.'
}, 

{
  id: 'ds-lamport-clocks',
  title: 'Logical Time',
  difficulty: 'Advanced',
  xp: 570,
  category: 'Distributed Systems',
  concept: 'Clock Synchronization',
  prompt: 'What problem do Lamport clocks solve?',
  choices: ['Encrypting timestamps', 'Ordering events without relying on physical time', 'Reducing CPU usage', 'Guaranteeing global consistency'],
  correctAnswer: 'Ordering events without relying on physical time',
  explanation: 'Lamport clocks provide logical ordering in distributed systems where physical clocks may drift.'
}, 

{
  id: 'net-tcp-congestion',
  title: 'Congestion Chaos',
  difficulty: 'Advanced',
  xp: 560,
  category: 'Computer Networking',
  concept: 'TCP Internals',
  prompt: 'Which TCP congestion control phase is responsible for probing the network capacity by increasing the congestion window exponentially?',
  choices: ['Slow Start', 'Congestion Avoidance', 'Fast Recovery', 'Fast Retransmit'],
  correctAnswer: 'Slow Start',
  explanation: 'Slow Start exponentially increases cwnd until a threshold is reached, allowing TCP to probe available bandwidth.'
},

{
  id: 'net-bgp-convergence',
  title: 'BGP Breakdown',
  difficulty: 'Advanced',
  xp: 590,
  category: 'Computer Networking',
  concept: 'Routing Protocols',
  prompt: 'Why is BGP convergence notoriously slow in large-scale networks?',
  choices: ['It uses link-state flooding', 'It relies on path-vector updates and avoids periodic refreshes', 'It recalculates all shortest paths constantly', 'It encrypts all routing tables'],
  correctAnswer: 'It relies on path-vector updates and avoids periodic refreshes',
  explanation: 'BGP’s path-vector design and incremental updates cause slow convergence, especially under instability.'
},

{
  id: 'net-dns-cache-poison',
  title: 'DNS Danger',
  difficulty: 'Advanced',
  xp: 600,
  category: 'Computer Networking',
  concept: 'Security',
  prompt: 'What makes DNS cache poisoning particularly dangerous in distributed systems?',
  choices: ['DNS uses encrypted records', 'Poisoned entries propagate across resolvers and redirect massive traffic', 'DNS servers never replicate data', 'TTL values prevent caching'],
  correctAnswer: 'Poisoned entries propagate across resolvers and redirect massive traffic',
  explanation: 'Cache poisoning can spread incorrect mappings across DNS infrastructure, enabling large-scale redirection attacks.'
},

{
  id: 'oop-lsp-violation',
  title: 'Substitution Snare',
  difficulty: 'Advanced',
  xp: 580,
  category: 'OOP',
  concept: 'SOLID Principles',
  prompt: 'Which scenario violates the Liskov Substitution Principle (LSP)?',
  choices: ['A subclass requiring fewer preconditions', 'A subclass throwing unexpected exceptions for valid base-class inputs', 'A subclass extending functionality safely', 'A subclass overriding methods with compatible behavior'],
  correctAnswer: 'A subclass throwing unexpected exceptions for valid base-class inputs',
  explanation: 'LSP requires subclasses to behave consistently with base-class expectations; unexpected exceptions break substitutability.'
},

{
  id: 'oop-metaprogramming',
  title: 'Meta Madness',
  difficulty: 'Advanced',
  xp: 570,
  category: 'OOP',
  concept: 'Reflection',
  prompt: 'Why is runtime reflection considered dangerous in large OOP systems?',
  choices: ['It prevents polymorphism', 'It bypasses type safety and can break encapsulation', 'It disables inheritance', 'It forces static linking'],
  correctAnswer: 'It bypasses type safety and can break encapsulation',
  explanation: 'Reflection allows modifying or accessing private members, increasing risk of runtime errors and security issues.'
},

{
  id: 'oop-object-lifecycle',
  title: 'Lifecycle Labyrinth',
  difficulty: 'Advanced',
  xp: 590,
  category: 'OOP',
  concept: 'Memory & Lifecycle',
  prompt: 'In languages with manual memory management, what makes object lifecycle management particularly challenging?',
  choices: ['Objects never reference each other', 'Circular references can cause memory leaks without garbage collection', 'Constructors always free memory', 'Destructors run automatically at compile time'],
  correctAnswer: 'Circular references can cause memory leaks without garbage collection',
  explanation: 'Manual memory management requires careful handling of reference cycles to avoid leaks.'
},

];

const choiceExplanations: Record<string, Record<string, string>> = {
  'ai-agent-goal': {
    'To store data only': 'Wrong because storage is one possible tool, not an agent\'s goal. Agents use context and available tools to take actions toward an objective.',
    'To replace all software engineers': 'Wrong because an agent is defined by goal-directed behavior, not by replacing a profession. It can assist people while still operating within a specific task.',
    'To avoid using models entirely': 'Wrong because agents commonly rely on models to interpret inputs and choose actions. Avoiding models does not describe an agent\'s purpose.'
  },
  'ai-search': {
    'One-shot lookup': 'Wrong because a lookup retrieves an answer in one step and does not describe breaking a problem into intermediate reasoning steps.',
    'Manual spreadsheet entry': 'Wrong because manual data entry is a human workflow, not a reasoning strategy used by an AI system.',
    'Hard-coded HTML': 'Wrong because HTML defines document structure and does not provide multi-step planning or reasoning.'
  },
  'ai-rl-policy': {
    'A set of labels': 'Wrong because labels describe data or categories; a reinforcement learning policy must guide the agent\'s behavior.',
    'A database schema': 'Wrong because a schema describes stored data, while a policy decides what action to take from a state.',
    'A loss function': 'Wrong because a loss function measures error during learning; it is not the state-to-action rule used to act.'
  },
  'ml-supervised': {
    'Unsupervised learning': 'Wrong because unsupervised learning works without target labels and instead looks for structure in unlabeled data.',
    'Data mining only': 'Wrong because data mining is a broad set of discovery techniques, not the specific learning setup defined by labeled examples.',
    'Rule-based scripting': 'Wrong because hand-written rules do not learn a mapping from labeled input-output examples.'
  },
  'ml-overfitting': {
    'Underfitting': 'Wrong because underfitting means the model is too simple to perform well even on training data, which is the opposite pattern.',
    'Data leakage': 'Wrong because leakage is an evaluation-data problem that can make results misleading; it is not the name for memorizing training examples.',
    'Feature scaling': 'Wrong because scaling changes feature ranges to help optimization. It does not explain poor performance on unseen data after strong training performance.'
  },
  'ml-regularization': {
    'To increase model size': 'Wrong because regularization discourages unnecessary complexity rather than expanding the model.',
    'To remove all features': 'Wrong because regularization may shrink some weights, but it does not require deleting every feature.',
    'To guarantee perfect accuracy': 'Wrong because regularization manages generalization tradeoffs; no technique guarantees perfect predictions.'
  },
  'mining-association': {
    'To generate executable code': 'Wrong because association rules describe relationships in data; they do not compile or generate application code.',
    'To compress images': 'Wrong because image compression reduces file size, while association mining looks for items that occur together.',
    'To compare CPU speeds': 'Wrong because hardware benchmarking is unrelated to discovering co-occurrence patterns in records.'
  },
  'mining-dimensions': {
    'It creates more labels automatically': 'Wrong because dimensionality reduction transforms features; it does not create supervised target labels.',
    'It turns all data into binary form': 'Wrong because reducing dimensions selects or combines features and does not require binary encoding.',
    'It guarantees perfect predictions': 'Wrong because fewer, cleaner features can help analysis, but prediction accuracy is never guaranteed.'
  },
  'dbms-normalization': {
    'To speed up all queries equally': 'Wrong because normalization can add joins and does not make every query faster.',
    'To hide all table names': 'Wrong because access control and permissions protect schema details; normalization organizes the data itself.',
    'To convert SQL into JSON': 'Wrong because serialization changes representation, while normalization reduces repeated data and update anomalies.'
  },
  'dbms-index': {
    'To rewrite SQL queries': 'Wrong because indexes support the database query engine; they do not rewrite the SQL a developer sends.',
    'To store backups permanently': 'Wrong because backups preserve recoverable copies, while indexes are lookup structures that can be rebuilt.',
    'To encrypt table rows': 'Wrong because encryption protects confidentiality; an index is designed to locate matching rows efficiently.'
  },
  'os-scheduling': {
    'How many users can log in': 'Wrong because login capacity is an authentication and resource policy concern, not the CPU scheduler\'s immediate decision.',
    'Whether a database is normalized': 'Wrong because normalization is a database design choice and has nothing to do with selecting the next runnable process.',
    'How to compress a file': 'Wrong because compression is an application or system service; scheduling decides which process receives CPU time.'
  },
  'os-memory': {
    'It makes files smaller automatically': 'Wrong because file compression changes file representation, while virtual memory manages addresses and pages for running programs.',
    'It prevents all CPU interrupts': 'Wrong because interrupts are part of CPU and device coordination; virtual memory does not eliminate them.',
    'It replaces the file system': 'Wrong because the file system manages persistent files, while virtual memory manages a process\'s logical memory space.'
  },
  'design-scalability': {
    'A way to reduce storage cost only': 'Wrong because storage efficiency can help, but scalability is about handling growth in demand across system resources.',
    'The process of writing SQL queries': 'Wrong because SQL is a data-access language; scalability concerns how the whole system grows under load.',
    'A method to prevent code compilation': 'Wrong because compilation is a build concern and has no relationship to serving more users or requests.'
  },
  'design-caching': {
    'To remove the need for databases': 'Wrong because caches usually complement databases and can be repopulated; they are not the system\'s durable source of truth.',
    'To guarantee security': 'Wrong because caching is primarily a performance technique and can even introduce security concerns if data is shared incorrectly.',
    'To replace all load balancers': 'Wrong because caches store reusable results, while load balancers distribute requests across service instances.'
  },
  'design-loadbalancing': {
    'To store backups': 'Wrong because backup systems preserve data for recovery; a load balancer routes live requests.',
    'To compress logs': 'Wrong because log compression reduces storage usage and does not distribute application traffic.',
    'To remove caching': 'Wrong because caching and load balancing solve different performance problems and are commonly used together.'
  },
  'crypto-symmetric': {
    'Different keys for encryption and decryption': 'Wrong because that describes asymmetric encryption. Symmetric encryption reuses one shared secret key.',
    'No keys used': 'Wrong because encryption requires a secret key to transform and recover protected data.',
    'Only hashes are generated': 'Wrong because hashing creates a one-way digest, while symmetric encryption supports reversible encryption and decryption.'
  },
  'crypto-hash': {
    'To encrypt data in reverse': 'Wrong because a hash is not reversible encryption; it produces a digest that is designed to be difficult to invert.',
    'To store all user passwords in plain text': 'Wrong because password systems should store salted password hashes, never the original plain-text passwords.',
    'To create an index for a CPU': 'Wrong because a hash function maps data to a digest for integrity or lookup uses; it does not create a CPU index.'
  },
  'crypto-rsa': {
    'It uses hashing only': 'Wrong because RSA uses public-key operations based on a key pair; hashing alone does not provide its encryption or signature behavior.',
    'It stores keys in plain text': 'Wrong because key storage is an operational security issue, not what makes an algorithm public-key.',
    'It requires no math': 'Wrong because RSA depends on number theory and modular arithmetic, especially operations involving large prime factors.'
  },
  'cyber-authentication': {
    'To encrypt all files': 'Wrong because encryption protects data confidentiality, while authentication establishes who a user is.',
    'To delete unused accounts': 'Wrong because account lifecycle management is separate from verifying a user\'s identity at sign-in.',
    'To monitor CPU usage': 'Wrong because CPU monitoring is observability, not an identity and access control function.'
  },
  'cyber-phishing': {
    'SQL injection': 'Wrong because SQL injection targets an application\'s database queries, rather than persuading a person to surrender information.',
    'DDoS': 'Wrong because a DDoS overwhelms a service with traffic; it does not primarily use deceptive messages to steal credentials.',
    'Man-in-the-middle': 'Wrong because that attack intercepts communication between parties, while phishing impersonates a trusted source to trick the victim.'
  },
  'cyber-zero-trust': {
    'Always trust internal users': 'Wrong because zero trust rejects location-based assumptions and verifies internal users just as it verifies external users.',
    'Encrypt only external traffic': 'Wrong because encryption scope is not the zero-trust principle; verification and least privilege apply regardless of network location.',
    'Allow anonymous access': 'Wrong because zero trust requires strong identity checks rather than treating unknown users as trusted.'
  },
  'arch-cpu-components': {
    'Control Unit': 'Wrong because the control unit directs instruction execution; it does not perform the arithmetic or logical calculation itself.',
    'Cache': 'Wrong because cache stores frequently needed data and instructions close to the CPU; it is not the calculation unit.',
    'Registers': 'Wrong because registers hold small, fast pieces of data, while the ALU performs operations on those values.'
  },
  'arch-cache': {
    'To store backups': 'Wrong because backups are durable recovery copies, while CPU caches hold temporary copies for faster access.',
    'To replace RAM': 'Wrong because cache is a smaller, faster layer that works alongside RAM rather than replacing its capacity.',
    'To encrypt memory': 'Wrong because encryption protects confidentiality; cache primarily reduces the time needed to reach frequently used data.'
  },
  'arch-risc-vs-cisc': {
    'CISC avoids using instructions': 'Wrong because CISC does use instructions; its distinction is that those instructions may be more complex and feature-rich.',
    'RISC encrypts all instructions': 'Wrong because RISC describes instruction-set design, not an encryption requirement.',
    'CISC eliminates memory': 'Wrong because both architectures use memory; instruction complexity does not remove the memory hierarchy.'
  },
  'se-testing-pyramid': {
    'They run extremely fast': 'Wrong because end-to-end tests usually involve real services and I/O, which makes them slower than unit tests.',
    'They eliminate the need for unit tests': 'Wrong because broad tests do not replace the fast, focused feedback and isolation provided by unit tests.',
    'They guarantee perfect coverage': 'Wrong because an end-to-end path covers only selected workflows and cannot guarantee every behavior is exercised.'
  },
  'se-design-singleton': {
    'It increases performance': 'Wrong because a shared instance does not inherently improve performance and can introduce contention or hidden dependencies.',
    'It guarantees thread safety': 'Wrong because singleton construction and shared mutable state still require explicit synchronization.',
    'It simplifies dependency injection': 'Wrong because global access hides dependencies, making injection, replacement, and testing more difficult.'
  },
  'se-event-sourcing': {
    'It removes the need for databases': 'Wrong because event sourcing is a persistence model and still requires storage for the event log and often projections.',
    'It eliminates concurrency issues': 'Wrong because events still need ordering and conflict handling; recording history does not remove concurrency.',
    'It guarantees constant-time queries': 'Wrong because reconstructing state or querying projections has costs that depend on the event and read model design.'
  },
  'ds-cap-theorem': {
    'To guarantee strict consistency': 'Wrong because an AP choice accepts eventual consistency during a partition in order to keep serving requests.',
    'To reduce server count': 'Wrong because CAP concerns consistency, availability, and partitions, not the number of servers used.',
    'To eliminate replication': 'Wrong because distributed availability generally relies on replication; AP does not remove it.'
  },
  'ds-2pc-limitations': {
    'It scales infinitely': 'Wrong because coordination and participant messaging add overhead, so 2PC does not scale without limit.',
    'It eliminates all network latency': 'Wrong because 2PC requires multiple network rounds and is therefore affected by network latency.',
    'It guarantees perfect fault tolerance': 'Wrong because a failed coordinator can leave participants waiting, which is the protocol\'s classic blocking limitation.'
  },
  'ds-lamport-clocks': {
    'Encrypting timestamps': 'Wrong because Lamport clocks assign logical counters; they do not provide confidentiality for timestamp data.',
    'Reducing CPU usage': 'Wrong because logical clocks help reason about event order and are not primarily an optimization for computation.',
    'Guaranteeing global consistency': 'Wrong because Lamport clocks capture a partial ordering, not a globally consistent state or total knowledge.'
  },
  'net-tcp-congestion': {
    'Congestion Avoidance': 'Wrong because congestion avoidance increases cwnd more cautiously, typically linearly, after the initial exponential probing phase.',
    'Fast Recovery': 'Wrong because fast recovery responds to detected packet loss; it is not the phase that performs exponential startup growth.',
    'Fast Retransmit': 'Wrong because fast retransmit resends a suspected lost segment after duplicate acknowledgments, rather than probing capacity.'
  },
  'net-bgp-convergence': {
    'It uses link-state flooding': 'Wrong because BGP is a path-vector protocol; link-state flooding describes a different routing approach.',
    'It recalculates all shortest paths constantly': 'Wrong because BGP exchanges path-vector updates incrementally and is not constantly running a link-state shortest-path calculation.',
    'It encrypts all routing tables': 'Wrong because encryption is unrelated to the update and path-selection behavior that affects convergence speed.'
  },
  'net-dns-cache-poison': {
    'DNS uses encrypted records': 'Wrong because ordinary DNS records are not inherently protected by encryption, and encryption would not itself describe poisoning impact.',
    'DNS servers never replicate data': 'Wrong because resolver caches and replicated infrastructure are precisely why a false mapping can spread widely.',
    'TTL values prevent caching': 'Wrong because TTL values control cache lifetime; they do not prevent caching or guarantee that a poisoned entry is harmless.'
  },
  'oop-lsp-violation': {
    'A subclass requiring fewer preconditions': 'Wrong because accepting at least the inputs the base type accepts preserves substitutability.',
    'A subclass extending functionality safely': 'Wrong because compatible extensions do not violate LSP when existing base-class expectations still hold.',
    'A subclass overriding methods with compatible behavior': 'Wrong because compatible overrides preserve the contract clients rely on and are consistent with LSP.'
  },
  'oop-metaprogramming': {
    'It prevents polymorphism': 'Wrong because reflection can inspect or alter runtime types; it does not inherently prevent polymorphic dispatch.',
    'It disables inheritance': 'Wrong because inheritance still exists, but reflection can bypass the boundaries that make inherited code predictable.',
    'It forces static linking': 'Wrong because reflection is a runtime mechanism and is not defined by how code is linked.'
  },
  'oop-object-lifecycle': {
    'Objects never reference each other': 'Wrong because objects commonly reference one another, and those relationships are part of the lifecycle challenge.',
    'Constructors always free memory': 'Wrong because constructors initialize objects; freeing memory is a separate responsibility handled by destruction or explicit release.',
    'Destructors run automatically at compile time': 'Wrong because destruction happens during execution, and manual-memory languages require deliberate lifetime management.'
  }
};

export async function GET() {
  return NextResponse.json({
    quests: quests.map((quest) => ({
      ...quest,
      choiceExplanations: {
        ...choiceExplanations[quest.id],
        [quest.correctAnswer]: quest.explanation,
      },
    })),
  });
}
