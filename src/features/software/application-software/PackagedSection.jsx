import { useState } from 'react';
import { appAudio } from './appSoftwareAudio';
import { PACKAGED_MATCH_TASKS } from './appSoftwareData';
import styles from './ApplicationSoftwareSim.module.css';

export default function PackagedSection() {
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const currentTask = PACKAGED_MATCH_TASKS[currentTaskIdx];

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      appAudio.playSuccess();
      setCompletedCount((prev) => prev + 1);
    } else {
      appAudio.playRetry();
    }
  };

  const handleNextTask = () => {
    appAudio.playClick();
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCurrentTaskIdx((prev) => (prev + 1) % PACKAGED_MATCH_TASKS.length);
  };

  const selectedOpt = currentTask.options.find((o) => o.id === selectedOptionId);

  return (
    <div className={styles.packagedStage}>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#3b82f6' }}>
          📦 Packaged Software: Ready-Made for Everyone
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
          Packaged software is already developed by programmers and available in stores or online for anyone to use.
        </p>
      </div>

      {/* 1. DEVELOPER TO MANY USERS DIAGRAM */}
      <div className={styles.packageBoxBanner}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>👩‍💻</div>
          <strong>Software Developer</strong>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Creates standard app</div>
        </div>

        <div style={{ fontSize: '2rem', color: '#3b82f6' }}>➔</div>

        <div style={{ background: '#1e293b', border: '2px solid #3b82f6', borderRadius: '12px', padding: '16px 20px', textAlign: 'center', boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)' }}>
          <div style={{ fontSize: '2.6rem' }}>📦</div>
          <strong style={{ fontSize: '1.1rem', color: '#38bdf8' }}>READY-MADE SOFTWARE</strong>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>One Package for All</div>
        </div>

        <div style={{ fontSize: '2rem', color: '#3b82f6' }}>➔</div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-surface)', padding: '10px', borderRadius: '8px', textAlign: 'center', minWidth: '70px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.5rem' }}>👨‍🎓</div>
            <div style={{ fontSize: '0.75rem' }}>Student</div>
          </div>
          <div style={{ background: 'var(--color-surface)', padding: '10px', borderRadius: '8px', textAlign: 'center', minWidth: '70px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.5rem' }}>👩‍🏫</div>
            <div style={{ fontSize: '0.75rem' }}>Teacher</div>
          </div>
          <div style={{ background: 'var(--color-surface)', padding: '10px', borderRadius: '8px', textAlign: 'center', minWidth: '70px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.5rem' }}>👨‍💼</div>
            <div style={{ fontSize: '0.75rem' }}>Office</div>
          </div>
          <div style={{ background: 'var(--color-surface)', padding: '10px', borderRadius: '8px', textAlign: 'center', minWidth: '70px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '1.5rem' }}>🏪</div>
            <div style={{ fontSize: '0.75rem' }}>Shop</div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE MINI GAME: CHOOSE THE RIGHT SOFTWARE */}
      <div style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-text)' }}>
              🛒 Mini Game: Choose the Right Packaged Software
            </h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Help the user pick the ready-made application for their task!
            </span>
          </div>

          <span style={{ fontSize: '0.85rem', background: '#3b82f6', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
            Task {currentTaskIdx + 1} of {PACKAGED_MATCH_TASKS.length}
          </span>
        </div>

        {/* User prompt speech */}
        <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '3rem' }}>{currentTask.userIcon}</span>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-accent)' }}>{currentTask.userName} says:</strong>
            <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 'bold', marginTop: '2px' }}>
              {currentTask.task}
            </div>
          </div>
        </div>

        {/* Option cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {currentTask.options.map((opt) => {
            let btnBorder = 'var(--color-border)';
            let btnBg = 'var(--color-surface)';
            let btnColor = 'var(--color-text)';

            if (isAnswered) {
              if (opt.isCorrect) {
                btnBorder = '#10b981';
                btnBg = 'rgba(16, 185, 129, 0.15)';
                btnColor = '#10b981';
              } else if (opt.id === selectedOptionId && !opt.isCorrect) {
                btnBorder = '#ef4444';
                btnBg = 'rgba(239, 68, 68, 0.15)';
                btnColor = '#ef4444';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={isAnswered}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: `2px solid ${btnBorder}`,
                  background: btnBg,
                  color: btnColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isAnswered ? 'default' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 120ms ease',
                }}
              >
                <span style={{ fontSize: '2rem' }}>{opt.icon}</span>
                <div style={{ flex: 1 }}>{opt.name}</div>
                {isAnswered && opt.isCorrect && <span>✅</span>}
                {isAnswered && opt.id === selectedOptionId && !opt.isCorrect && <span>❌</span>}
              </button>
            );
          })}
        </div>

        {/* Feedback Banner & Next Button */}
        {isAnswered && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              background: selectedOpt?.isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              borderLeft: `4px solid ${selectedOpt?.isCorrect ? '#10b981' : '#ef4444'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <strong>{selectedOpt?.isCorrect ? '✅ Excellent Choice!' : '❌ Not quite!'}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginTop: '2px' }}>
                {currentTask.explanation}
              </div>
            </div>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleNextTask}
              style={{ padding: '8px 18px', fontSize: '0.9rem' }}
            >
              <span>Next Task ➔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
