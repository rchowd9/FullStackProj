'use client';

import Link from 'next/link';
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
    description: 'System of interconnected computing devices that communicate and share resources with one another.', 
  }, 


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

export default function HomePage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

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
          </div>
        </div>
      </section>

      <section className="command-bar" aria-label="Your learning progress">
        <div className="command-label"><span className="pulse-dot" /> DAILY RUN <strong>Tuesday, September 9</strong></div>
        <div className="command-stat"><span>Cycle progress</span><strong>{completedQuests.length}/12 quests</strong></div>
        <div className="command-stat"><span>Next reward</span><strong>+500 XP <small>at 12 quests</small></strong></div>
        <Link href="/quests" className="command-action">Resume run <span>→</span></Link>
      </section>

      <section className="learning-strip">
        {concepts.map((concept) => (
          <span key={concept} className="chip">{concept}</span>
        ))}
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
        <Link href="/quests?category=System%20Design" className="primary button-link">Take the challenge</Link>
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
