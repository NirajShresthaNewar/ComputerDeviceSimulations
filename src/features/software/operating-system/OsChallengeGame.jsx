import { useState } from 'react';
import { osAudio } from './osAudio';
import { OS_CHALLENGE_TASKS } from './osData';
import styles from './OperatingSystemSim.module.css';

export default function OsChallengeGame() {
  const [currentStep, setCurrentStep] = useState(0); // 0..6
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleCompleteTask = (taskIndex) => {
    osAudio.playSuccessFanfare();
    const task = OS_CHALLENGE_TASKS[taskIndex];
    if (!completedTasks.includes(task.id)) {
      setCompletedTasks((prev) => [...prev, task.id]);
    }

    if (taskIndex + 1 < OS_CHALLENGE_TASKS.length) {
      setCurrentStep(taskIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    osAudio.playClick();
    setCurrentStep(0);
    setCompletedTasks([]);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          border: '2px solid var(--color-accent)',
          borderRadius: '16px',
          padding: '36px 24px',
          textAlign: 'center',
          maxWidth: '720px',
          margin: '0 auto',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🎉 🏆 🖥️</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)', margin: '0 0 8px 0' }}>
          Excellent! You Are a Master Operating System!
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-accent)', fontWeight: 'bold', margin: '0 0 16px 0' }}>
          You just managed all 5 core functions of a real computer!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', margin: '20px 0', textAlign: 'left' }}>
          <div style={{ background: 'var(--color-surface-raised)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #10b981', color: '#10b981', fontWeight: '600', fontSize: '0.85rem' }}>
            ✅ Process Managed
          </div>
          <div style={{ background: 'var(--color-surface-raised)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #10b981', color: '#10b981', fontWeight: '600', fontSize: '0.85rem' }}>
            ✅ Memory Managed
          </div>
          <div style={{ background: 'var(--color-surface-raised)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #10b981', color: '#10b981', fontWeight: '600', fontSize: '0.85rem' }}>
            ✅ File Managed
          </div>
          <div style={{ background: 'var(--color-surface-raised)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #10b981', color: '#10b981', fontWeight: '600', fontSize: '0.85rem' }}>
            ✅ Device Managed
          </div>
          <div style={{ background: 'var(--color-surface-raised)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #10b981', color: '#10b981', fontWeight: '600', fontSize: '0.85rem' }}>
            ✅ Multitasking Managed
          </div>
          <div style={{ background: 'var(--color-surface-raised)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #10b981', color: '#10b981', fontWeight: '600', fontSize: '0.85rem' }}>
            ✅ Security Managed
          </div>
        </div>

        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleRestart}
          style={{ marginTop: '12px' }}
        >
          🔄 Play Guided Challenge Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.challengeCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
            🎮 &quot;You Are the Operating System!&quot; Guided Challenge
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Complete the 6 management tasks below to run a virtual computer smoothly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Progress:</span>
          <span style={{ padding: '4px 12px', background: 'var(--color-accent)', color: '#0b0e14', fontWeight: 'bold', borderRadius: '16px', fontSize: '0.85rem' }}>
            {completedTasks.length} of {OS_CHALLENGE_TASKS.length} Tasks Complete
          </span>
        </div>
      </div>

      {/* Task List Grid */}
      <div className={styles.taskListGrid}>
        {OS_CHALLENGE_TASKS.map((task, idx) => {
          const isDone = completedTasks.includes(task.id);
          const isCurrent = currentStep === idx && !isDone;

          return (
            <div
              key={task.id}
              className={`${styles.taskItemCard} ${isDone ? styles.taskItemDone : ''}`}
              style={{
                borderColor: isCurrent ? 'var(--color-accent)' : undefined,
                boxShadow: isCurrent ? '0 0 16px rgba(61, 220, 151, 0.25)' : undefined,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: isDone ? '#10b981' : 'var(--color-text)' }}>
                  {task.title}
                </strong>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: isDone ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-bg)',
                    color: isDone ? '#10b981' : 'var(--color-text-muted)',
                  }}
                >
                  {isDone ? `✅ ${task.actionBadge}` : `Task ${idx + 1}`}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                {task.desc}
              </p>

              <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                {isDone ? (
                  <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    ✓ Completed Successfully!
                  </div>
                ) : isCurrent ? (
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={() => handleCompleteTask(idx)}
                    style={{ width: '100%', padding: '8px', fontSize: '0.9rem' }}
                  >
                    ▶ Perform OS Action
                  </button>
                ) : (
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    Locked (Complete earlier tasks first)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
