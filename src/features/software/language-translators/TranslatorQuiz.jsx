import { useState } from 'react';
import { soundFx } from './audioEffects';
import { QUIZ_QUESTIONS } from './translatorData';
import styles from './LanguageTranslatorSim.module.css';

export default function TranslatorQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredMap, setAnsweredMap] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (option) => {
    if (answeredMap[currentIdx]) return; // Already answered this question

    setSelectedOption(option.id);
    const isCorrect = option.isCorrect;

    if (isCorrect) {
      soundFx.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundFx.playRetry();
    }

    setAnsweredMap((prev) => ({
      ...prev,
      [currentIdx]: {
        selectedId: option.id,
        isCorrect,
      },
    }));
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setAnsweredMap({});
    setIsFinished(false);
  };

  const currentAnswer = answeredMap[currentIdx];

  if (isFinished) {
    const isPerfect = score === QUIZ_QUESTIONS.length;
    return (
      <div className={styles.quizCard}>
        <div className={styles.quizFinishedCard}>
          <div className={styles.quizTrophy}>{isPerfect ? '🏆' : '🌟'}</div>
          <h3 className={styles.quizResultTitle}>
            {isPerfect ? 'Outstanding Job! Perfect Score!' : 'Great Effort!'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            You scored <strong>{score}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong>!
          </p>
          <p style={{ maxWidth: '480px', color: 'var(--color-text)', lineHeight: 1.5 }}>
            {isPerfect
              ? 'You have mastered the concepts of Compilers, Interpreters, and Assemblers for Class 5 Computer Science!'
              : 'Review the concept cards or replay the interactive simulation to boost your understanding!'}
          </p>
          <button
            type="button"
            className={styles.primaryActionBtn}
            onClick={handleRestart}
            style={{ marginTop: '12px' }}
          >
            🔄 Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizCard}>
      {/* Quiz Header */}
      <div className={styles.quizHeader}>
        <h3 className={styles.quizTitle}>🧩 Class 5 Learning Challenge</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className={styles.stepCounterBadge}>
            Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span className={styles.quizScoreBadge}>Score: {score}</span>
        </div>
      </div>

      {/* Question */}
      <div className={styles.questionBox}>
        {currentIdx + 1}. {currentQ.question}
      </div>

      {/* Options List */}
      <div className={styles.quizOptionsList}>
        {currentQ.options.map((option) => {
          let btnClass = styles.quizOptionBtn;
          if (currentAnswer) {
            if (option.isCorrect) {
              btnClass += ` ${styles.quizOptionCorrect}`;
            } else if (currentAnswer.selectedId === option.id && !currentAnswer.isCorrect) {
              btnClass += ` ${styles.quizOptionWrong}`;
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              className={btnClass}
              onClick={() => handleSelectOption(option)}
              disabled={Boolean(currentAnswer)}
            >
              <span>{option.text}</span>
              {currentAnswer && option.isCorrect && <span>✅</span>}
              {currentAnswer && currentAnswer.selectedId === option.id && !option.isCorrect && (
                <span>❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {currentAnswer && (
        <div
          className={`${styles.feedbackBanner} ${
            currentAnswer.isCorrect
              ? styles.feedbackBannerSuccess
              : styles.feedbackBannerRetry
          }`}
        >
          <span>{currentAnswer.isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
            {currentQ.explanation}
          </span>
        </div>
      )}

      {/* Next Question Button */}
      {currentAnswer && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            onClick={handleNext}
          >
            <span>{currentIdx + 1 === QUIZ_QUESTIONS.length ? 'View Final Results ➔' : 'Next Question ➔'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
