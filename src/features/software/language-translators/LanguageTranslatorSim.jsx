import { useState } from 'react';
import { soundFx } from './audioEffects';
import SimulationEngine from './SimulationEngine';
import TryItYourselfSandbox from './TryItYourselfSandbox';
import TranslatorOverviewDiagram from './TranslatorOverviewDiagram';
import TranslatorQuiz from './TranslatorQuiz';
import styles from './LanguageTranslatorSim.module.css';

export default function LanguageTranslatorSim() {
  // 'real' (High-Level -> Machine) vs 'analogy' (English -> Nepali)
  const [simulationMode, setSimulationMode] = useState('real');
  
  // Active Tab: 'simulate' | 'overview' | 'quiz'
  const [activeTab, setActiveTab] = useState('simulate');

  // Sound toggle
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) soundFx.playClick();
  };

  const handleModeChange = (mode) => {
    soundFx.playClick();
    setSimulationMode(mode);
  };

  const handleTabChange = (tab) => {
    soundFx.playClick();
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      {/* 1. HEADER */}
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.titleGroup}>
            <div className={styles.badgeIcon}>🔀</div>
            <div>
              <h1 className={styles.headerTitle}>Language Translators Simulator</h1>
              <p className={styles.headerSubtitle}>
                Class 5 Computer Science • See how Compilers, Interpreters, and Assemblers translate code.
              </p>
            </div>
          </div>

          <div className={styles.headerControls}>
            <button
              type="button"
              className={styles.soundBtn}
              onClick={toggleSound}
              title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            >
              <span>{isMuted ? '🔇' : '🔊'}</span>
              <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
            </button>
          </div>
        </div>

        {/* 2. PROMINENT TWO-MODE TOGGLE */}
        <div className={styles.modeToggleCard}>
          <div className={styles.modeToggleLabel}>
            <span>🔄 Demonstration Mode:</span>
          </div>

          <div className={styles.modeToggleGroup}>
            <button
              type="button"
              className={`${styles.modeBtn} ${
                simulationMode === 'real' ? styles.modeBtnRealActive : ''
              }`}
              onClick={() => handleModeChange('real')}
            >
              <span>🟢</span>
              <span>REAL COMPUTER (High-Level ➔ Binary)</span>
            </button>

            <button
              type="button"
              className={`${styles.modeBtn} ${
                simulationMode === 'analogy' ? styles.modeBtnAnalogyActive : ''
              }`}
              onClick={() => handleModeChange('analogy')}
            >
              <span>🟣</span>
              <span>EASY ANALOGY (English ➔ Nepali)</span>
            </button>
          </div>
        </div>

        {/* 3. TEACHER / STUDENT CONTEXT BANNER */}
        {simulationMode === 'analogy' ? (
          <div className={styles.noticeBox}>
            <span className={styles.noticeIcon}>💡</span>
            <div className={styles.noticeText}>
              <strong>Educational Analogy:</strong> We use English ➔ Nepali to help Class 5 students easily visualize how a translator converts words. <em>(Remember: Nepali is not a computer machine code; in a real computer, translators produce binary 0s and 1s.)</em>
            </div>
          </div>
        ) : (
          <div className={`${styles.noticeBox} ${styles.noticeBoxReal}`}>
            <span className={styles.noticeIcon}>💻</span>
            <div className={styles.noticeText}>
              <strong>Real Computer Concept:</strong> Humans write high-level code (like Python). The translator converts it into <strong>Machine Language (0s and 1s)</strong> so the computer's CPU can execute it.
            </div>
          </div>
        )}
      </header>

      {/* 4. NAVIGATION TABS */}
      <nav className={styles.tabsNav}>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'simulate' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('simulate')}
        >
          <span>🎮</span>
          <span>Interactive Simulator & Sandbox</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'overview' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <span>📖</span>
          <span>Concept Overview & Differences</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'quiz' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('quiz')}
        >
          <span>🧩</span>
          <span>Mini Quiz Challenge</span>
        </button>
      </nav>

      {/* 5. TAB CONTENT */}
      {activeTab === 'simulate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <SimulationEngine mode={simulationMode} />
          <TryItYourselfSandbox />
        </div>
      )}

      {activeTab === 'overview' && <TranslatorOverviewDiagram />}

      {activeTab === 'quiz' && <TranslatorQuiz />}
    </div>
  );
}
