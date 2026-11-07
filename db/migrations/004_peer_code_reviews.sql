-- Peer code review submissions and learner feedback.

CREATE TABLE IF NOT EXISTS peer_code_review_submissions (
  id UUID PRIMARY KEY,
  author_name VARCHAR(40) NOT NULL,
  title VARCHAR(120) NOT NULL,
  language VARCHAR(30) NOT NULL CHECK (language IN ('Python', 'JavaScript', 'Java', 'C++', 'C#', 'Kotlin', 'R', 'SQL')),
  review_prompt VARCHAR(500) NOT NULL,
  source_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS peer_code_reviews (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES peer_code_review_submissions(id) ON DELETE CASCADE,
  author_name VARCHAR(40) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment VARCHAR(1000) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS peer_code_review_submissions_created_idx
  ON peer_code_review_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS peer_code_reviews_submission_created_idx
  ON peer_code_reviews (submission_id, created_at ASC);
