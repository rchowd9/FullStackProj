import styles from './QuestFeedback.module.css';

type QuestFeedbackProps = {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  choices: { text: string; explanation: string }[];
};

export default function QuestFeedback({
  isCorrect,
  selectedAnswer,
  correctAnswer,
  explanation,
  choices,
}: QuestFeedbackProps) {
  return (
    <section
      className={`${styles.feedback} ${isCorrect ? styles.success : styles.error}`}
      aria-live="polite"
      aria-label={isCorrect ? 'Correct answer feedback' : 'Incorrect answer feedback'}
    >
      <div className={styles.heading}>
        <span className={styles.statusIcon} aria-hidden="true">
          {isCorrect ? '✓' : '!'}
        </span>
        <div>
          <h3>{isCorrect ? 'Correct! Nice work.' : 'Not quite. Study the distinction.'}</h3>
          <p>{explanation}</p>
        </div>
      </div>

      {!isCorrect && (
        <div className={styles.answerGrid}>
          <div className={styles.answerCard}>
            <span>Your answer</span>
            <strong>{selectedAnswer}</strong>
          </div>
          <div className={`${styles.answerCard} ${styles.correctAnswer}`}>
            <span>Correct answer</span>
            <strong>{correctAnswer}</strong>
          </div>
        </div>
      )}

      <details className={styles.choiceDetails} open>
        <summary>Review each choice</summary>
        <ul className={styles.choiceList}>
          {choices.map((choice) => (
            <li key={choice.text}>
              <strong>{choice.text}</strong>
              <span>{choice.explanation}</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
