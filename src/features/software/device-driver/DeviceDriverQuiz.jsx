import { useState } from 'react';
import { driverAudio } from './driverAudio';
import { QUIZ_QUESTIONS } from './driverData';
import styles from './DeviceDriverSim.module.css';

export default function DeviceDriverQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredMap, setAnsweredMap] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (option) => {
    if (answeredMap[currentIdx]) return;

    setSelectedOptionId(option.id);
    const isCorrect = option.isCorrect;

    if (isCorrect) {
      driverAudio.playSuccessAction();
      setScore((prev) => prev + 1);
    } else {
      driverAudio.playConfused();
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
    driverAudio.playClick();
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    driverAudio.playClick();
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setScore(0);
    setAnsweredMap({});
    setIsFinished(false);
  };

  const currentAnswer = answeredMap[currentIdx];

  if (isFinished) {
    const isPerfect = score === QUIZ_QUESTIONS.length;
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>
          {isPerfect ? '🏆' : '🌟'}
        </div>
        <h3 style={{ fontSize: '1.6rem', color: 'var(--color-text)', margin: '0 0 8px 0' }}>
          {isPerfect ? 'Superb! You Mastered Device Drivers!' : 'Great Effort!'}
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', margin: '0 0 16px 0' }}>
          You scored <strong>{score}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong>!
        </p>
        <p style={{ color: 'var(--color-text)', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
          {isPerfect
            ? 'You understand how the Computer, Device Driver helper, and Hardware devices communicate together!'
            : 'Try the interactive simulation again to see how the helper explains instructions!'}
        </p>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleRestart}
          style={{ margin: '0 auto' }}
        >
          🔄 Play Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
          🧩 Device Driver Quiz (Class 5)
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '4px 12px', background: 'var(--color-surface-raised)', borderRadius: '16px', fontSize: '0.85rem', color: 'var(--color-text)' }}>
            Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span style={{ padding: '4px 12px', background: 'var(--color-accent)', color: '#0b0e14', fontWeight: 'bold', borderRadius: '16px', fontSize: '0.85rem' }}>
            Score: {score}
          </span>
        </div>
      </div>

      {/* Question */}
      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-text)', lineHeight: 1.45 }}>
        {currentIdx + 1}. {currentQ.question}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentQ.options.map((opt) => {
          let btnBg = 'var(--color-surface-raised)';
          let btnBorder = 'var(--color-border)';
          let btnColor = 'var(--color-text)';

          if (currentAnswer) {
            if (opt.isCorrect) {
              btnBg = 'rgba(16, 185, 129, 0.15)';
              btnBorder = '#10b981';
              btnColor = '#10b981';
            } else if (currentAnswer.selectedId === opt.id && !currentAnswer.isCorrect) {
              btnBg = 'rgba(239, 68, 68, 0.15)';
              btnBorder = '#ef4444';
              btnColor = '#ef4444';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(opt)}
              disabled={Boolean(currentAnswer)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '10px',
                border: `1px solid ${btnBorder}`,
                background: btnBg,
                color: btnColor,
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: currentAnswer ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 120ms ease',
              }}
            >
              <span>{opt.text}</span>
              {currentAnswer && opt.isCorrect && <span>✅</span>}
              {currentAnswer && currentAnswer.selectedId === opt.id && !opt.isCorrect && <span>❌</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next */}
      {currentAnswer && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: currentAnswer.isCorrect
              ? 'rgba(16, 185, 129, 0.12)'
              : 'rgba(239, 68, 68, 0.12)',
            borderLeft: `4px solid ${currentAnswer.isCorrect ? '#10b981' : '#ef4444'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <strong>{currentAnswer.isCorrect ? '✅ Correct!' : '❌ Not quite!'}</strong>
            <div style={{ fontSize: '0.9rem', marginTop: '2px', color: 'var(--color-text)' }}>
              {currentQ.explanation}
            </div>
          </div>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleNext}
            style={{ padding: '8px 18px', fontSize: '0.9rem' }}
          >
            <span>{currentIdx + 1 === QUIZ_QUESTIONS.length ? 'See Results ➔' : 'Next Question ➔'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
