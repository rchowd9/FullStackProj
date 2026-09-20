'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
    title: 'Kernel Quest',
    category: 'Operating Systems',
    difficulty: 'Intermediate',
    xp: 300,
    description: 'Understand scheduling, memory, and process control inside the operating system.',
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
];

const normalizeText = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

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
  const hasStructure = /(first|next|then|finally|because|for example|in summary|if|when)/i.test(trimmed);
  const score = Math.min(100, keywordCoverage + (hasStructure ? 10 : 0) + (trimmed.length > 160 ? 5 : 0));

  const label = score >= 85 ? 'Strong answer' : score >= 65 ? 'Solid answer' : 'Needs more depth';
  const feedback = matchedKeywords.length === question.keywords.length
    ? 'You covered the key pillars of a strong answer. Your response is clear and decision-oriented.'
    : `You touched ${matchedKeywords.length}/${question.keywords.length} important points. Add ${question.checklist.filter((item) => !matchedKeywords.some((keyword) => normalizeText(item).includes(normalizeText(keyword)))).slice(0, 2).join(' and ')} to make the answer more complete.`;

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

export default function HomePage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [shareStatus, setShareStatus] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [signalIndex, setSignalIndex] = useState(0);
  const [interviewAnswers, setInterviewAnswers] = useState<Record<string, string>>({});
  const [interviewResults, setInterviewResults] = useState<Record<string, { score: number; label: string; feedback: string; answer: string }>>({});
  const [studyCoach, setStudyCoach] = useState({ focus: 'System Design', note: 'Keep momentum and complete a strong daily run.' });

  const currentSignal = signalStates[signalIndex];
  const readiness = Math.min(96, 58 + completedQuests.length * 7);

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

      <section id="interview-lab" className="interview-lab">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INTERVIEW LAB</p>
            <h2>Answer the question, then grade your response</h2>
          </div>
          <span className="panel-badge panel-badge-alt">{interviewQuestions.length} skill drills</span>
        </div>
        <p className="interview-intro">Write your own answer for each interview prompt, then compare it to the strongest answer and use the feedback to tighten your reasoning.</p>
        <div className="interview-grid">
          {interviewQuestions.map((interview, index) => {
            const result = interviewResults[interview.id];
            const answer = interviewAnswers[interview.id] ?? '';

            return (
              <article key={interview.id} className="interview-question-card">
                <div className="interview-question-header">
                  <span className="interview-number">0{index + 1}</span>
                  <div className="interview-heading">
                    <small>{interview.mission}</small>
                    <strong>{interview.question}</strong>
                  </div>
                </div>

                <textarea
                  className="interview-response"
                  value={answer}
                  onChange={(event) => setInterviewAnswers((prev) => ({ ...prev, [interview.id]: event.target.value }))}
                  placeholder="Type your answer here..."
                  rows={5}
                />

                <div className="interview-actions">
                  <button type="button" className="interview-action-button" onClick={() => handleInterviewEvaluation(interview)}>
                    Evaluate answer
                  </button>
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

                {result && (
                  <div className={`interview-result ${result.score >= 80 ? 'success' : result.score >= 60 ? 'warning' : 'error'}`}>
                    <div className="interview-score-row">
                      <strong>{result.score}%</strong>
                      <span>{result.label}</span>
                    </div>
                    <p>{result.feedback}</p>
                    <div className="optimal-answer">
                      <strong>Most optimal answer</strong>
                      <p>{result.answer}</p>
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
          <p className="eyebrow">HALL OF FAME</p>
          <h2>Global leaderboard</h2>
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
