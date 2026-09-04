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

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => setLeaderboard(data.leaderboard ?? []))
      .catch(() => setLeaderboard([]));
  }, []);

  return (
    <main className="page-shell">
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
            <div className="avatar-badge">LVL 14</div>
            <div className="avatar-coin">◉</div>
            <h3>Player: Byte Knight</h3>
            <ul>
              <li>XP: 12,450</li>
              <li>Streak: 9 days</li>
              <li>Guild: Logic Legends</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="learning-strip">
        {concepts.map((concept) => (
          <span key={concept} className="chip">{concept}</span>
        ))}
      </section>

      <section id="missions" className="missions">
        <div className="section-heading">
          <p className="eyebrow">ACTIVE MISSIONS</p>
          <h2>Pick your next challenge</h2>
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
