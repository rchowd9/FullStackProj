'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

type Quest = {
  id: string;
  title: string;
  difficulty: string;
  xp: number;
  category: string;
  concept: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
};

export default function QuestsPage() {
  return (
    <Suspense fallback={<main className="page-shell quest-page"><p>Loading quests...</p></main>}>
      <QuestsContent />
    </Suspense>
  );
}

function QuestsContent() {
  const searchParams = useSearchParams();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All levels');
  const [reviewMisses, setReviewMisses] = useState(false);

  useEffect(() => {
    const savedProgress = window.localStorage.getItem('code-quest:progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress) as { completedIds?: unknown; missedIds?: unknown };
        if (Array.isArray(parsed.completedIds)) {
          setCompletedIds(parsed.completedIds.filter((id): id is string => typeof id === 'string'));
        }
        if (Array.isArray(parsed.missedIds)) {
          setMissedIds(parsed.missedIds.filter((id): id is string => typeof id === 'string'));
        }
      } catch {
        window.localStorage.removeItem('code-quest:progress');
      }
    }
    setProgressLoaded(true);

    fetch('/api/quests')
      .then((res) => res.json())
      .then((data) => setQuests(data.quests ?? []));
  }, []);

  useEffect(() => {
    if (progressLoaded) {
      window.localStorage.setItem('code-quest:progress', JSON.stringify({ completedIds, missedIds }));
    }
  }, [completedIds, missedIds, progressLoaded]);

  const selectedCategory = searchParams.get('category');
  const visibleQuests = quests.filter((quest) => {
    const matchesCategory = !selectedCategory || quest.category === selectedCategory;
    const matchesDifficulty = difficulty === 'All levels' || quest.difficulty === difficulty;
    const matchesReview = !reviewMisses || missedIds.includes(quest.id);
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch = !searchTerm || `${quest.title} ${quest.concept} ${quest.prompt}`.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesDifficulty && matchesReview && matchesSearch;
  });

  const groupedQuests = Array.from(
    new Set(visibleQuests.map((quest) => quest.category))
  ).map((category) => ({
    category,
    items: visibleQuests.filter((quest) => quest.category === category),
  }));

  const handleAnswer = (questId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questId]: answer }));
    setSubmitted((prev) => ({ ...prev, [questId]: true }));

    const quest = quests.find((item) => item.id === questId);
    if (quest?.correctAnswer === answer) {
      setCompletedIds((previous) => previous.includes(questId) ? previous : [...previous, questId]);
      setMissedIds((previous) => previous.filter((id) => id !== questId));
    } else {
      setMissedIds((previous) => previous.includes(questId) ? previous : [...previous, questId]);
    }
  };

  const explainChoice = (quest: Quest, choice: string) => {
    if (choice === quest.correctAnswer) {
      return `Correct: ${quest.correctAnswer} is the principle that best answers this question.`;
    }

    if (quest.id === 'oop-lsp-violation') {
      if (choice === 'A subclass requiring fewer preconditions') {
        return 'This is the opposite of the LSP issue. A subclass should not impose stronger constraints than the base type; it must accept the same valid inputs without adding new requirements.';
      }

      if (choice === 'A subclass extending functionality safely') {
        return 'Adding behavior is fine only when it remains compatible with the base class contract. This choice describes valid extension, not an LSP violation.';
      }

      if (choice === 'A subclass overriding methods with compatible behavior') {
        return 'Compatible overriding is part of good polymorphism. The real LSP violation is when a subclass breaks expected behavior for valid base-class inputs.';
      }
    }

    const conceptExplanations: Record<string, string> = {
      Agents: 'This misses the Agents concept because it treats the system as a passive data store instead of a goal-driven component that acts on information to accomplish tasks.',
      Reasoning: 'This misses the Reasoning concept because it assumes a one-step lookup instead of multi-step inference or planning before making a decision.',
      'Reinforcement Learning': 'This misses the Reinforcement Learning concept because a policy is the mapping from states to actions, not labels, schemas, or loss functions.',
      'Supervised Learning': 'This misses Supervised Learning because it relies on labeled examples to learn the mapping from inputs to outputs, not unlabeled discovery or hard-coded rules.',
      'Model Evaluation': 'This misses Model Evaluation because it is about how well a model generalizes to new data, not about feature scaling or label leakage.',
      Regularization: 'This misses Regularization because the point is controlling complexity to avoid overfitting, not increasing model size or removing features entirely.',
      'Association Rules': 'This misses Association Rules because the goal is discovering relationships among data patterns, not generating code or comparing hardware metrics.',
      'Dimensionality Reduction': 'This misses Dimensionality Reduction because it simplifies high-dimensional data by reducing noise and preserving key structure, not creating labels or guaranteeing perfect predictions.',
      Normalization: 'This misses Normalization because its purpose is to reduce redundancy and improve integrity, not to change query speed or convert data formats.',
      Indexing: 'This misses Indexing because indexes improve lookup performance for common queries, not rewriting SQL or encrypting rows.',
      'Process Scheduling': 'This misses Process Scheduling because it is about choosing which process runs next, not user authentication or file compression.',
      'Memory Management': 'This misses Memory Management because virtual memory expands the effective address space and handles paging, not compression or file system replacement.',
      Scalability: 'This misses Scalability because it is about handling growth without major redesign, not just reducing storage cost or writing SQL.',
      Caching: 'This misses Caching because caches reduce repeated expensive work and latency, not replacing the database or guaranteeing security guarantees.',
      'Load Balancing': 'This misses Load Balancing because its job is to distribute traffic across servers so no single node becomes overloaded.',
      'Symmetric Encryption': 'This misses Symmetric Encryption because it uses one shared key for both encrypting and decrypting data.',
      'Hash Functions': 'This misses Hash Functions because they produce a fixed-size digest for integrity and verification rather than reversible encryption.',
      'Public Key Cryptography': 'This misses Public Key Cryptography because RSA relies on a pair of keys, one public and one private, to support secure communication.',
      Authentication: 'This misses Authentication because it is about validating identity, not encrypting files or monitoring system load.',
      Threats: 'This misses the Threats concept because phishing is a deception attack that tricks users into revealing information, not a different class of infrastructure disruption.',
      'Access Control': 'This misses Access Control because zero trust means never assuming trust and always verifying identity and context.',
      CPU: 'This misses the CPU concept because the ALU is the component that performs arithmetic and logical operations.',
      'Memory Hierarchy': 'This misses Memory Hierarchy because caches reduce latency by keeping the most-used data near the processor.',
      'Instruction Sets': 'This misses Instruction Sets because RISC emphasizes a smaller set of simpler instructions designed for faster execution.',
      Testing: 'This misses Testing because end-to-end tests are often brittle and slower than smaller, more focused tests, which is the testing risk being described.',
      'Design Patterns': 'This misses Design Patterns because Singleton introduces hidden global state and tight coupling rather than clean dependency flow.',
      Architecture: 'This misses the Architecture concept because event sourcing preserves a complete history of state transitions, which supports auditing and reconstruction.',
      'CAP Theorem': 'This misses CAP Theorem because the issue is choosing availability during a network partition rather than strict consistency.',
      'Distributed Transactions': 'This misses Distributed Transactions because two-phase commit can block indefinitely when the coordinator fails.',
      'Clock Synchronization': 'This misses Clock Synchronization because Lamport clocks provide event ordering without needing perfect physical time.',
      'TCP Internals': 'This misses TCP Internals because Slow Start is the phase that probes network capacity by increasing the congestion window exponentially.',
      'Routing Protocols': 'This misses Routing Protocols because BGP convergence is slow when path-vector updates and delayed refreshes dominate the network response.',
      Security: 'This misses the Security concept because DNS cache poisoning spreads bad mappings across resolvers and can redirect traffic at scale.',
      'SOLID Principles': 'This misses the SOLID Principles concept because the key problem is substitutability: a subclass must honor the base contract and not break valid inputs.',
      Reflection: 'This misses Reflection because runtime reflection can bypass type safety and encapsulation, breaking assumptions in large systems.',
      'Memory & Lifecycle': 'This misses Memory & Lifecycle because manual memory management problems often arise from reference cycles and leaks rather than from constructors alone.'
    };

    return `This misses the ${quest.concept} concept because ${conceptExplanations[quest.concept] ?? `it does not match the behavior described by "${quest.correctAnswer}".`}`;
  };

  return (
    <main className="page-shell quest-page">
      <section className="quest-header">
        <p className="eyebrow">MISSION CONTROL</p>
        <h1>{selectedCategory ? `${selectedCategory} Quest Board` : 'Quest Board'}</h1>
        <p className="subtitle">
          {selectedCategory
            ? `Focus on ${selectedCategory} challenges and earn XP.`
            : 'Answer challenges to earn XP and unlock new topics.'}
        </p>
      </section>

      <section className="quest-toolbar" aria-label="Quest filters">
        <label className="search-field">
          <span>⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search concepts, missions..." />
        </label>
        <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} aria-label="Filter by difficulty">
          <option>All levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <button className={`review-toggle ${reviewMisses ? 'active' : ''}`} onClick={() => setReviewMisses((current) => !current)}>
          Review misses <strong>{missedIds.length}</strong>
        </button>
        <div className="quest-summary"><strong>{completedIds.length}</strong> cleared <span>•</span> <strong>{quests.length - completedIds.length}</strong> remaining</div>
      </section>

      <div className="quest-list">
        {groupedQuests.map((group) => (
          <div key={group.category} className="category-group">
            <div className="category-header">
              <p className="eyebrow">CATEGORY</p>
              <h2>{group.category}</h2>
            </div>

            {group.items.map((quest) => {
              const selected = selectedAnswers[quest.id];
              const isCorrect = selected === quest.correctAnswer;

              return (
                <article key={quest.id} className="quest-card">
                  <div className="mission-topline">
                    <span className="difficulty">{quest.difficulty}</span>
                    <span className={completedIds.includes(quest.id) ? 'completed-label' : 'xp'}>{completedIds.includes(quest.id) ? '✓ CLEARED' : `+${quest.xp} XP`}</span>
                  </div>

                  <p className="concept-tag">{quest.concept}</p>
                  <h2>{quest.title}</h2>
                  <p className="prompt">{quest.prompt}</p>

                  <div className="choices">
                    {quest.choices.map((choice) => {
                      const active = selected === choice;
                      const right = choice === quest.correctAnswer;

                      let className = 'choice';
                      if (submitted[quest.id]) {
                        if (right) className += ' correct';
                        if (active && !right) className += ' wrong';
                      } else if (active) {
                        className += ' selected';
                      }

                      return (
                        <button
                          key={choice}
                          className={className}
                          onClick={() => handleAnswer(quest.id, choice)}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>

                  {submitted[quest.id] && (
                    <>
                      <div className={`result ${isCorrect ? 'success' : 'error'}`}>
                        <strong>{isCorrect ? 'Correct!' : 'Not quite. Study the distinction:'}</strong>
                        <span>{quest.explanation}</span>
                      </div>
                      <div className="choice-explanations">
                        {quest.choices.filter((choice) => choice !== quest.correctAnswer).map((choice) => (
                          <p key={choice}><strong>{choice}</strong><span>{explainChoice(quest, choice)}</span></p>
                        ))}
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
