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

    return `This misses the ${quest.concept} concept because it does not describe the behavior being tested. The correct idea is "${quest.correctAnswer}".`;
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
