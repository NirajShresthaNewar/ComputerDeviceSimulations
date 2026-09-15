import { useState } from 'react';
import { osAudio } from './osAudio';
import VirtualDesktop from './VirtualDesktop';
import MemoryManagerView from './MemoryManagerView';
import FileManagerView from './FileManagerView';
import ProcessManagerView from './ProcessManagerView';
import DeviceManagerView from './DeviceManagerView';
import SecurityManagerView from './SecurityManagerView';
import OsChallengeGame from './OsChallengeGame';
import OsSummaryAndQuiz from './OsSummaryAndQuiz';
import styles from './OperatingSystemSim.module.css';

export default function OperatingSystemSim() {
  const [activeTab, setActiveTab] = useState('desktop');
  const [activeAppIds, setActiveAppIds] = useState(['notes', 'music']);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    osAudio.setMuted(next);
    if (!next) osAudio.playClick();
  };

  const handleTabChange = (tab) => {
    osAudio.playClick();
    setActiveTab(tab);
  };

  const handleToggleApp = (appId) => {
    if (activeAppIds.includes(appId)) {
      osAudio.playAppClose();
      setActiveAppIds((prev) => prev.filter((id) => id !== appId));
    } else {
      osAudio.playAppOpen();
      setActiveAppIds((prev) => [...prev, appId]);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. HEADER & INTRO CARD */}
      <header className={styles.introCard}>
        <div className={styles.introLeft}>
          <div className={styles.introAvatar}>🖥️</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: 'var(--color-accent)', color: '#0b0e14', fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                Class 5 Computer Science
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                System Software &amp; Management
              </span>
            </div>
            <h1 className={styles.introTitle}>You Are the Operating System!</h1>
            <p className={styles.introSubtitle}>
              An Operating System is like the <strong>manager of the computer</strong>. It manages running programs, memory, files, connected devices, and privacy security!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
          </button>
        </div>
      </header>

      {/* 2. NAVIGATION TABS */}
      <nav className={styles.tabsNav}>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'desktop' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('desktop')}
        >
          <span>🖥️</span>
          <span>Virtual Desktop</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'memory' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('memory')}
        >
          <span>🧠</span>
          <span>Memory Management</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'files' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('files')}
        >
          <span>📁</span>
          <span>File Management</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'devices' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('devices')}
        >
          <span>🖨️</span>
          <span>Device Management</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'processes' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('processes')}
        >
          <span>⚙️</span>
          <span>Process Management</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'security' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('security')}
        >
          <span>🔐</span>
          <span>Privacy &amp; Security</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'challenge' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('challenge')}
        >
          <span>🎮</span>
          <span>OS Guided Challenge</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'quiz' ? styles.tabItemActive : ''}`}
          onClick={() => handleTabChange('quiz')}
        >
          <span>📖</span>
          <span>Summary &amp; Quiz</span>
        </button>
      </nav>

      {/* 3. TAB CONTENT VIEWS */}
      {activeTab === 'desktop' && (
        <VirtualDesktop
          activeApps={activeAppIds}
          onToggleApp={handleToggleApp}
          onNavigateTab={handleTabChange}
        />
      )}

      {activeTab === 'memory' && (
        <MemoryManagerView
          activeAppIds={activeAppIds}
          onToggleApp={handleToggleApp}
        />
      )}

      {activeTab === 'files' && <FileManagerView />}

      {activeTab === 'devices' && <DeviceManagerView />}

      {activeTab === 'processes' && (
        <ProcessManagerView
          activeAppIds={activeAppIds}
          onToggleApp={handleToggleApp}
        />
      )}

      {activeTab === 'security' && <SecurityManagerView />}

      {activeTab === 'challenge' && <OsChallengeGame />}

      {activeTab === 'quiz' && <OsSummaryAndQuiz />}
    </div>
  );
}
