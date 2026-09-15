import { osAudio } from '../operating-system/osAudio';
import { INTRO_TASKS } from './appSoftwareData';
import styles from './ApplicationSoftwareSim.module.css';

export default function IntroSection({ onStart }) {
  return (
    <div className={styles.introCard}>
      <div className={styles.introHeroComputer}>💻</div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ background: 'var(--color-accent)', color: '#0b0e14', fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
            Class 5 Computer Science
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Software Concepts
          </span>
        </div>
        <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: 'var(--color-text)' }}>
          What Can You Do With a Computer?
        </h2>
        <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          A computer can do many amazing things! But how does it know how to write, draw, play music, or calculate math?
        </p>
      </div>

      {/* Grid of Tasks */}
      <div className={styles.tasksGrid}>
        {INTRO_TASKS.map((task) => (
          <div key={task.id} className={styles.taskCard}>
            <span style={{ fontSize: '2.5rem' }}>{task.icon}</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>{task.label}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', background: 'var(--color-surface-raised)', padding: '2px 8px', borderRadius: '4px' }}>
              App: {task.appExample}
            </span>
          </div>
        ))}
      </div>

      {/* Main takeaway */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderLeft: '4px solid var(--color-accent)',
          borderRadius: '10px',
          padding: '16px 24px',
          maxWidth: '700px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        }}
      >
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
          💡 Key Concept:
        </span>
        <p style={{ margin: '6px 0 0 0', fontSize: '1.1rem', color: 'var(--color-accent)', fontWeight: '700' }}>
          “Application software helps users perform specific tasks.”
        </p>
      </div>

      <button
        type="button"
        className={styles.primaryBtn}
        onClick={() => {
          osAudio.playClick();
          onStart();
        }}
        style={{ padding: '14px 32px', fontSize: '1.1rem' }}
      >
        <span>▶ Start Exploring Application Software</span>
      </button>
    </div>
  );
}
