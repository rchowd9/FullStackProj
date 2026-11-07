'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

const reviewLanguages = ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'Kotlin', 'R', 'SQL'] as const;

type PeerReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewSubmission = {
  id: string;
  author: string;
  title: string;
  language: (typeof reviewLanguages)[number];
  prompt: string;
  code: string;
  createdAt: string;
  reviews: PeerReview[];
};

export default function PeerReviewsPage() {
  const [submissions, setSubmissions] = useState<ReviewSubmission[]>([]);
  const [author, setAuthor] = useState('Byte Knight');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<(typeof reviewLanguages)[number]>('JavaScript');
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { author: string; rating: number; comment: string }>>({});
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviewingId, setReviewingId] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/reviews')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? 'Could not load peer reviews.');
        setSubmissions(data.submissions);
        setShared(data.shared);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Could not load peer reviews.');
      })
      .finally(() => setLoading(false));
  }, []);

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit', author, title, language, prompt, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not share your code.');
      setSubmissions((current) => [data.submission, ...current].slice(0, 50));
      setShared(data.shared);
      setTitle('');
      setPrompt('');
      setCode('');
      setStatus(data.shared
        ? 'Your code is shared with the peer review board.'
        : 'Submission saved for this server session. Add Upstash Redis to share it across deployments.');
    } catch (submitError: unknown) {
      setError(submitError instanceof Error ? submitError.message : 'Could not share your code.');
    } finally {
      setSaving(false);
    }
  };

  const submitReview = async (event: FormEvent<HTMLFormElement>, submissionId: string) => {
    event.preventDefault();
    const draft = reviewDrafts[submissionId] ?? { author, rating: 5, comment: '' };
    setReviewingId(submissionId);
    setError('');
    setStatus('');
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'review', submissionId, ...draft }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not submit your feedback.');
      setSubmissions((current) => current.map((submission) =>
        submission.id === submissionId ? data.submission : submission
      ));
      setShared(data.shared);
      setReviewDrafts((current) => ({
        ...current,
        [submissionId]: { ...draft, comment: '' },
      }));
      setStatus('Feedback added. Thanks for helping another learner.');
    } catch (reviewError: unknown) {
      setError(reviewError instanceof Error ? reviewError.message : 'Could not submit your feedback.');
    } finally {
      setReviewingId('');
    }
  };

  return (
    <main className="page-shell review-page">
      <nav className="top-nav" aria-label="Primary navigation">
        <Link href="/" className="brand-mark"><span className="brand-orb">CQ</span> Code Quest</Link>
        <div className="nav-links">
          <Link href="/">Academy</Link>
          <Link href="/quests">Quest board</Link>
          <span className="profile-pill"><span className="online-dot" /> Peer reviews</span>
        </div>
      </nav>

      <section className="review-hero">
        <p className="eyebrow">LEARN TOGETHER</p>
        <h1>Peer code review</h1>
        <p>Share a solution, ask for focused feedback, and help another learner improve their code.</p>
      </section>

      <div className={`review-storage-note ${shared ? 'is-shared' : ''}`} role="status">
        <strong>{shared ? 'Shared review board' : 'Development review board'}</strong>
        <span>
          {shared
            ? 'Submissions and feedback are stored in Upstash Redis and visible to other learners.'
            : 'Without Upstash Redis, review data is temporary and limited to this server instance.'}
        </span>
      </div>

      {error && <p className="review-alert error" role="alert">{error}</p>}
      {status && <p className="review-alert success" role="status">{status}</p>}

      <section className="review-layout" aria-label="Peer code review board">
        <form className="review-submit-card" onSubmit={submitCode}>
          <p className="eyebrow">REQUEST FEEDBACK</p>
          <h2>Share your code</h2>
          <p className="review-form-intro">Post a focused question and a code sample for other learners to review. Don’t include secrets or personal information.</p>
          <label>
            Display name
            <input value={author} onChange={(event) => setAuthor(event.target.value)} minLength={2} maxLength={40} required />
          </label>
          <label>
            Submission title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Optimizing my binary search" minLength={5} maxLength={120} required />
          </label>
          <label>
            Language
            <select value={language} onChange={(event) => setLanguage(event.target.value as (typeof reviewLanguages)[number])}>
              {reviewLanguages.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            What would you like feedback on?
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the approach or question reviewers should focus on." minLength={10} maxLength={500} required />
          </label>
          <label>
            Code sample
            <textarea className="review-code-input" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Paste up to 16,000 characters of code" maxLength={16_000} required spellCheck={false} />
          </label>
          <button className="review-submit-button" type="submit" disabled={saving}>
            {saving ? 'Sharing…' : 'Share for review'}
          </button>
        </form>

        <section className="review-board" aria-labelledby="review-board-title">
          <div className="review-board-heading">
            <div>
              <p className="eyebrow">COMMUNITY FEEDBACK</p>
              <h2 id="review-board-title">Open submissions</h2>
            </div>
            <span>{submissions.length} / 50</span>
          </div>
          {loading ? (
            <p className="review-empty-state">Loading submissions…</p>
          ) : submissions.length === 0 ? (
            <div className="review-empty-state">
              <strong>Be the first to share.</strong>
              <p>Post a small code sample and tell the community what feedback would help.</p>
            </div>
          ) : (
            <div className="review-submission-list">
              {submissions.map((submission) => (
                <article key={submission.id} className="review-submission-card">
                  <div className="review-submission-heading">
                    <div>
                      <span className="review-language">{submission.language}</span>
                      <h3>{submission.title}</h3>
                    </div>
                    <span className="review-count">{submission.reviews.length} / 20 reviews</span>
                  </div>
                  <p className="review-byline">Shared by {submission.author} · {new Date(submission.createdAt).toLocaleDateString()}</p>
                  <p className="review-question">{submission.prompt}</p>
                  <pre className="review-code"><code>{submission.code}</code></pre>

                  {submission.reviews.length > 0 && (
                    <div className="peer-feedback-list">
                      <h4>Peer feedback</h4>
                      {submission.reviews.map((review) => (
                        <article key={review.id} className="peer-feedback">
                          <div>
                            <strong>{review.author}</strong>
                            <span aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                          </div>
                          <p>{review.comment}</p>
                        </article>
                      ))}
                    </div>
                  )}

                  {submission.reviews.length < 20 && (
                    <form className="peer-review-form" onSubmit={(event) => submitReview(event, submission.id)}>
                      <h4>Leave constructive feedback</h4>
                      <label>
                        Display name
                        <input
                          value={reviewDrafts[submission.id]?.author ?? author}
                          onChange={(event) => setReviewDrafts((current) => ({
                            ...current,
                            [submission.id]: {
                              author: event.target.value,
                              rating: current[submission.id]?.rating ?? 5,
                              comment: current[submission.id]?.comment ?? '',
                            },
                          }))}
                          minLength={2}
                          maxLength={40}
                          required
                        />
                      </label>
                      <label>
                        Rating
                        <select
                          value={reviewDrafts[submission.id]?.rating ?? 5}
                          onChange={(event) => setReviewDrafts((current) => ({
                            ...current,
                            [submission.id]: {
                              author: current[submission.id]?.author ?? author,
                              rating: Number(event.target.value),
                              comment: current[submission.id]?.comment ?? '',
                            },
                          }))}
                        >
                          {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}
                        </select>
                      </label>
                      <label>
                        Feedback
                        <textarea
                          value={reviewDrafts[submission.id]?.comment ?? ''}
                          onChange={(event) => setReviewDrafts((current) => ({
                            ...current,
                            [submission.id]: {
                              author: current[submission.id]?.author ?? author,
                              rating: current[submission.id]?.rating ?? 5,
                              comment: event.target.value,
                            },
                          }))}
                          placeholder="Share one strength and one actionable suggestion."
                          minLength={8}
                          maxLength={1_000}
                          required
                        />
                      </label>
                      <button type="submit" disabled={reviewingId === submission.id}>
                        {reviewingId === submission.id ? 'Sending…' : 'Submit feedback'}
                      </button>
                    </form>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
