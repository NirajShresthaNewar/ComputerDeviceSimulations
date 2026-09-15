import { useState } from 'react';
import { osAudio } from './osAudio';
import { QUIZ_QUESTIONS } from './osData';
import styles from './OperatingSystemSim.module.css';

export default function OsSummaryAndQuiz() {
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
      osAudio.playSuccessFanfare();
      setScore((prev) => prev + 1);
    } else {
      osAudio.playAccessDenied();
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
    osAudio.playClick();
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    osAudio.playClick();
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setScore(0);
    setAnsweredMap({});
    setIsFinished(false);
  };

  const currentAnswer = answeredMap[currentIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. LARGE VISUAL SUMMARY DIAGRAM */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '28px 20px',
          textAlign: 'center',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '6px' }}>🖥️</div>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)', margin: '0 0 6px 0' }}>
          The Operating System: Manager of the Computer
        </h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '640px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
          Just like a school principal manages classes, teachers, and activities, the Operating System coordinates all computer resources!
        </p>

        {/* 5 Function Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            textAlign: 'left',
          }}
        >
          <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🧠</div>
            <strong style={{ color: 'var(--color-text)' }}>Memory Management</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Allocates RAM blocks to apps when opening, frees memory when closing.
            </p>
          </div>

          <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>📁</div>
            <strong style={{ color: 'var(--color-text)' }}>File Management</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Helps create, organize, move, rename, find, and delete files &amp; folders.
            </p>
          </div>

          <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🖨️</div>
            <strong style={{ color: 'var(--color-text)' }}>Device Management</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Controls hardware devices and uses device drivers to talk to them.
            </p>
          </div>

          <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>⚙️</div>
            <strong style={{ color: 'var(--color-text)' }}>Process Management</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Shares CPU time between running programs so you can multitask smoothly.
            </p>
          </div>

          <div style={{ background: 'var(--color-surface-raised)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🔐</div>
            <strong style={{ color: 'var(--color-text)' }}>Privacy &amp; Security</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Protects private files with passwords and controls user folder permissions.
            </p>
          </div>
        </div>
      </div>

      {/* 2. QUIZ SECTION */}
      {!isFinished ? (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)' }}>
              🧩 Operating System Quiz (Class 5)
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '3px 10px', background: 'var(--color-surface-raised)', borderRadius: '12px', fontSize: '0.8rem' }}>
                Q {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span style={{ padding: '3px 10px', background: 'var(--color-accent)', color: '#000', fontWeight: 'bold', borderRadius: '12px', fontSize: '0.8rem' }}>
                Score: {score}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--color-text)', lineHeight: 1.45 }}>
            {currentIdx + 1}. {currentQ.question}
          </div>

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
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${btnBorder}`,
                    background: btnBg,
                    color: btnColor,
                    fontSize: '0.9rem',
                    cursor: currentAnswer ? 'default' : 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{opt.text}</span>
                  {currentAnswer && opt.isCorrect && <span>✅</span>}
                  {currentAnswer && currentAnswer.selectedId === opt.id && !opt.isCorrect && <span>❌</span>}
                </button>
              );
            })}
          </div>

          {currentAnswer && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: currentAnswer.isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                borderLeft: `4px solid ${currentAnswer.isCorrect ? '#10b981' : '#ef4444'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <strong>{currentAnswer.isCorrect ? '✅ Correct!' : '❌ Not quite!'}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginTop: '2px' }}>
                  {currentQ.explanation}
                </div>
              </div>

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleNext}
                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
              >
                {currentIdx + 1 === QUIZ_QUESTIONS.length ? 'See Final Score ➔' : 'Next ➔'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '2px solid var(--color-accent)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>
            {score === QUIZ_QUESTIONS.length ? '🏆' : '🌟'}
          </div>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--color-text)', margin: '0 0 6px 0' }}>
            {score === QUIZ_QUESTIONS.length ? 'Outstanding! Perfect Score!' : 'Well Done!'}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', margin: '0 0 16px 0' }}>
            You scored <strong>{score}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong>!
          </p>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleRestart}
          >
            🔄 Take Quiz Again
          </button>
        </div>
      )}
    </div>
  );
}
