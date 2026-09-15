import { useState, useRef } from 'react';
import { driverAudio } from './driverAudio';
import { DEVICES_DATA, REAL_WORLD_EXAMPLES } from './driverData';
import DeviceConversationEngine from './DeviceConversationEngine';
import MatchDriverActivity from './MatchDriverActivity';
import DeviceDriverQuiz from './DeviceDriverQuiz';
import styles from './DeviceDriverSim.module.css';

export default function DeviceDriverSim() {
  const [activeDeviceId, setActiveDeviceId] = useState('printer');
  const [isDriverOn, setIsDriverOn] = useState(false);
  const [activeTab, setActiveTab] = useState('sim'); // 'sim' | 'match' | 'learn' | 'quiz'
  const [isMuted, setIsMuted] = useState(false);

  const simSectionRef = useRef(null);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    driverAudio.setMuted(next);
    if (!next) driverAudio.playClick();
  };

  const handleDeviceChange = (id) => {
    driverAudio.playClick();
    setActiveDeviceId(id);
  };

  const handleDriverToggle = (on) => {
    driverAudio.playClick();
    setIsDriverOn(on);
  };

  const handleTabChange = (tab) => {
    driverAudio.playClick();
    setActiveTab(tab);
  };

  const scrollToSim = () => {
    driverAudio.playClick();
    setActiveTab('sim');
    if (simSectionRef.current) {
      simSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. MEET THE DEVICE DRIVER INTRO CARD */}
      <div className={styles.introCard}>
        <div className={styles.introLeft}>
          <div className={styles.introAvatar}>🧑‍🔧</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: 'var(--color-accent)', color: '#0b0e14', fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                Class 5 Computer Science
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                System Software
              </span>
            </div>
            <h1 className={styles.introTitle}>Meet the Device Driver!</h1>
            <p className={styles.introSubtitle}>
              Your computer wants to talk to hardware devices like printers, keyboards, and speakers. But different devices work in different ways. A <strong>Device Driver</strong> acts as the friendly helper that allows them to communicate!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={scrollToSim}
          >
            <span>▶ Start Simulation</span>
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--color-border)' }}>
        <button
          type="button"
          onClick={() => handleTabChange('sim')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'sim' ? '3px solid var(--color-accent)' : '3px solid transparent',
            color: activeTab === 'sim' ? 'var(--color-accent)' : 'var(--color-text-muted)',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          🎮 Interactive Experiment
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('match')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'match' ? '3px solid var(--color-accent)' : '3px solid transparent',
            color: activeTab === 'match' ? 'var(--color-accent)' : 'var(--color-text-muted)',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          🧩 Match the Driver
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('learn')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'learn' ? '3px solid var(--color-accent)' : '3px solid transparent',
            color: activeTab === 'learn' ? 'var(--color-accent)' : 'var(--color-text-muted)',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          📖 Concept & Examples
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('quiz')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'quiz' ? '3px solid var(--color-accent)' : '3px solid transparent',
            color: activeTab === 'quiz' ? 'var(--color-accent)' : 'var(--color-text-muted)',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          🎯 Mini Quiz
        </button>
      </div>

      {/* TAB 1: MAIN SIMULATION */}
      {activeTab === 'sim' && (
        <div ref={simSectionRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* DEVICE PICKER & DRIVER ON/OFF TOGGLE BAR */}
          <div className={styles.topConfigBar}>
            {/* Device Selector */}
            <div className={styles.deviceSelectorGroup}>
              <span className={styles.deviceSelectorLabel}>Choose Device:</span>
              {Object.values(DEVICES_DATA).map((dev) => (
                <button
                  key={dev.id}
                  type="button"
                  className={`${styles.devicePillBtn} ${
                    activeDeviceId === dev.id ? styles.devicePillBtnActive : ''
                  }`}
                  onClick={() => handleDeviceChange(dev.id)}
                >
                  <span>{dev.icon}</span>
                  <span>{dev.name}</span>
                </button>
              ))}
            </div>

            {/* Driver Toggle Switch */}
            <div className={styles.driverToggleContainer}>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                🧑‍🔧 Device Driver:
              </span>
              <div className={styles.driverToggleSwitch}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${
                    isDriverOn ? styles.toggleBtnOnActive : ''
                  }`}
                  onClick={() => handleDriverToggle(true)}
                >
                  <span>🟢 ON</span>
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${
                    !isDriverOn ? styles.toggleBtnOffActive : ''
                  }`}
                  onClick={() => handleDriverToggle(false)}
                >
                  <span>🔴 OFF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Core Interactive Conversation Pipeline */}
          <DeviceConversationEngine
            activeDeviceId={activeDeviceId}
            isDriverOn={isDriverOn}
          />

          {/* SIDE-BY-SIDE COMPARISON CARD */}
          <div className={styles.comparisonGrid}>
            <div className={`${styles.compareCard} ${styles.compareWithout}`}>
              <div className={styles.compareHeader}>
                <h4 className={styles.compareTitle}>🔴 WITHOUT DRIVER</h4>
                <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  ❌ Communication Fails
                </span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                🖥️ <strong>Computer:</strong> “Print this page.”<br />
                🖨️ <strong>Device:</strong> “What do you mean? 🤔”
              </p>
              <div style={{ fontSize: '0.85rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', padding: '8px 12px', borderRadius: '6px' }}>
                The device doesn&apos;t understand raw requests without its driver helper.
              </div>
            </div>

            <div className={`${styles.compareCard} ${styles.compareWith}`}>
              <div className={styles.compareHeader}>
                <h4 className={styles.compareTitle}>🟢 WITH DRIVER</h4>
                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  ✅ Communication Works!
                </span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                🖥️ <strong>Computer:</strong> “Print this page.”<br />
                🧑‍🔧 <strong>Driver:</strong> “I&apos;ll explain the instructions.”<br />
                🖨️ <strong>Device:</strong> “Oh! I understand! 👍”
              </p>
              <div style={{ fontSize: '0.85rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.08)', padding: '8px 12px', borderRadius: '6px' }}>
                The driver translates the computer&apos;s request into exact steps the device knows.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATCH THE DRIVER GAME */}
      {activeTab === 'match' && <MatchDriverActivity />}

      {/* TAB 3: CONCEPT & REAL-WORLD EXAMPLES */}
      {activeTab === 'learn' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Central Analogy Card */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', margin: '0 0 8px 0', color: 'var(--color-text)' }}>
              🧑‍🔧 Think of a Device Driver as a Helpful Interpreter
            </h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 20px auto' }}>
              Just like two people who speak different languages need a friendly helper to talk, the computer and hardware device need a device driver!
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ padding: '16px 20px', background: 'var(--color-surface-raised)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '2rem' }}>🖥️</div>
                <strong>Computer</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>“I want to do this.”</div>
              </div>

              <div style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>➔</div>

              <div style={{ padding: '16px 20px', background: 'rgba(61, 220, 151, 0.1)', borderRadius: '12px', border: '2px solid var(--color-accent)' }}>
                <div style={{ fontSize: '2rem' }}>🧑‍🔧</div>
                <strong>Device Driver</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>“I&apos;ll explain it.”</div>
              </div>

              <div style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>➔</div>

              <div style={{ padding: '16px 20px', background: 'var(--color-surface-raised)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '2rem' }}>🖨️</div>
                <strong>Device</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>“Oh! I understand! 👍”</div>
              </div>
            </div>
          </div>

          {/* Real-World Table */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--color-text)' }}>
              🌍 Where Do We Use Device Drivers?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {REAL_WORLD_EXAMPLES.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                    <div>
                      <strong style={{ color: 'var(--color-text)' }}>{item.device}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginLeft: '8px' }}>
                        ➔ {item.driver}
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    {item.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Definition Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              padding: '20px 24px',
            }}
          >
            <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>
              💡 What is a Device Driver? (Class 5 Definition)
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
              <strong>A device driver is special software that helps the operating system communicate with a hardware device.</strong>
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              📌 <strong>Remember:</strong> The driver is the helper between the computer and the device.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MINI QUIZ */}
      {activeTab === 'quiz' && <DeviceDriverQuiz />}
    </div>
  );
}
