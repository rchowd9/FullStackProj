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

];

export async function GET() {
  return NextResponse.json({ quests });
}
