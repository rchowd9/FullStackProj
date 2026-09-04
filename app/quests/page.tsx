'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const searchParams = useSearchParams();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/quests')
      .then((res) => res.json())
      .then((data) => setQuests(data.quests ?? []));
  }, []);

  const selectedCategory = searchParams.get('category');
  const visibleQuests = selectedCategory
    ? quests.filter((quest) => quest.category === selectedCategory)
    : quests;

  const groupedQuests = Array.from(
    new Set(visibleQuests.map((quest) => quest.category))
  ).map((category) => ({
    category,
    items: visibleQuests.filter((quest) => quest.category === category),
  }));

  const handleAnswer = (questId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questId]: answer }));
    setSubmitted((prev) => ({ ...prev, [questId]: true }));
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
                    <span className="xp">+{quest.xp} XP</span>
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
                    <div className={`result ${isCorrect ? 'success' : 'error'}`}>
                      <strong>{isCorrect ? 'Correct!' : 'Not quite.'}</strong>
                      <span>{quest.explanation}</span>
                    </div>
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
