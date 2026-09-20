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

const interviewWalkthroughs = [
  { mission: 'AI', question: 'How would you make an AI agent safe when it can call tools?', answer: 'Constrain tools behind permissions, validate arguments, log every call, and require confirmation for irreversible actions.', steps: ['Define the agent goal and the tools it actually needs.', 'Give each tool the smallest possible permission scope.', 'Validate inputs and outputs, then add timeouts and rate limits.', 'Keep an audit trail and add human approval for high-impact actions.'] },
  { mission: 'Machine Learning', question: 'How do you diagnose a model that performs well in training but poorly in production?', answer: 'Separate overfitting from data drift by comparing validation performance, production feature distributions, and label quality.', steps: ['Check the train-validation gap for overfitting.', 'Compare live features with the training distribution.', 'Verify that production labels still mean the same thing.', 'Choose retraining, regularization, or data fixes based on evidence.'] },
  { mission: 'Data Mining', question: 'How would you decide whether an association rule is useful?', answer: 'Look beyond support: use confidence, lift, and a business test to determine whether the relationship is actionable.', steps: ['Measure support to avoid rules based on rare noise.', 'Measure confidence to see how often the consequence follows.', 'Use lift to compare the rule with the baseline frequency.', 'Run an experiment before turning the pattern into a product decision.'] },
  { mission: 'Data Structures', question: 'When would you choose a hash map over a sorted array?', answer: 'Choose a hash map for fast average lookup by key; choose a sorted array when ordered traversal, compact memory, or binary search matters more.', steps: ['Name the dominant operation: lookup, insertion, deletion, or ordered iteration.', 'Compare average and worst-case time complexity.', 'Account for memory, cache locality, and whether stable ordering is required.', 'State the tradeoff and select the simplest structure that meets the workload.'] },
  { mission: 'DBMS', question: 'An endpoint is slow after the table grows tenfold. What do you inspect first?', answer: 'Start with the query plan and access pattern, then add or adjust indexes only when the evidence supports it.', steps: ['Capture the real query and its latency distribution.', 'Inspect the execution plan for scans, bad joins, or poor cardinality estimates.', 'Add a targeted index that matches filters and sort order.', 'Measure again and watch write cost, storage, and cache behavior.'] },
  { mission: 'Operating Systems', question: 'What happens during a context switch and why is it expensive?', answer: 'The kernel saves one process state and restores another; cache disruption and scheduler work add overhead beyond the register saves.', steps: ['Save registers, program counter, and scheduling state.', 'Choose the next runnable process.', 'Restore its state and switch address-space context if needed.', 'Explain that frequent switches reduce useful CPU work and locality.'] },
  { mission: 'System Design', question: 'How would you design a URL shortener for high read traffic?', answer: 'Separate the write and read paths, use a durable key mapping, cache hot redirects, and measure collision and availability behavior.', steps: ['Define redirect latency, durability, and scale targets.', 'Generate collision-safe IDs and persist the mapping.', 'Cache hot links close to readers.', 'Add replication, rate limits, and observability before optimizing further.'] },
  { mission: 'Cryptography', question: 'Why should passwords be hashed instead of encrypted?', answer: 'Passwords need one-way verification, not reversible recovery; a slow salted password hash limits offline guessing.', steps: ['Generate a unique salt for each password.', 'Use a password KDF such as Argon2, scrypt, or bcrypt.', 'Tune work factors for the current hardware.', 'Never log or store the original password or a fast unsalted hash.'] },
  { mission: 'Computer Architecture', question: 'Why can a faster CPU still run a program more slowly?', answer: 'Performance depends on memory stalls, branch behavior, cache locality, parallelism, and the workload, not clock speed alone.', steps: ['Profile where cycles are spent.', 'Check cache misses, branch mispredictions, and memory bandwidth.', 'Compare instruction-level and thread-level parallelism.', 'Optimize the bottleneck rather than assuming frequency is the limiter.'] },
  { mission: 'Cybersecurity', question: 'How would you prioritize vulnerabilities in a backlog?', answer: 'Rank them by exploitability, impact, exposure, and available mitigations, then verify fixes rather than chasing severity labels alone.', steps: ['Identify the affected asset and whether it is internet-facing.', 'Estimate realistic exploit likelihood and business impact.', 'Apply compensating controls while scheduling the permanent fix.', 'Retest and document residual risk after remediation.'] },
  { mission: 'Software Engineering', question: 'What makes a code review useful?', answer: 'A useful review protects behavior and maintainability through focused, evidence-based feedback, not personal style preference.', steps: ['Confirm the change has tests for the behavior it adds.', 'Check failure paths, interfaces, and operational impact.', 'Ask focused questions tied to a concrete risk.', 'Keep unrelated refactors out so the review stays legible.'] },
  { mission: 'Distributed Systems', question: 'How do you make a payment request safe to retry?', answer: 'Use an idempotency key recorded with the final result so repeated requests return the same outcome instead of charging twice.', steps: ['Require a client-generated unique key per logical payment.', 'Store the key, request fingerprint, and result durably.', 'Return the original result for a matching retry.', 'Reject reuse with different parameters and expire records carefully.'] },
  { mission: 'Computer Networking', question: 'What would you investigate when an API is intermittently slow?', answer: 'Break latency into DNS, connection, TLS, server, queue, and downstream timings instead of treating the request as one black box.', steps: ['Add a trace ID and inspect latency percentiles.', 'Separate client, network, and server timing.', 'Check connection reuse, DNS, queue depth, and downstream calls.', 'Fix the largest contributor and verify under realistic load.'] },
  { mission: 'OOP', question: 'When is composition better than inheritance?', answer: 'Composition is better when behavior should vary independently or when inheritance would create a brittle hierarchy.', steps: ['List the behaviors that need to change independently.', 'Model them as small collaborators with clear interfaces.', 'Inject those collaborators into the object that coordinates them.', 'Use inheritance only where the subtype truly preserves the base contract.'] },
];

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

  const currentSignal = signalStates[signalIndex];
  const readiness = Math.min(96, 58 + completedQuests.length * 7);

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
