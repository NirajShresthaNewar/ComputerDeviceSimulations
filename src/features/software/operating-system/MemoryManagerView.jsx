import { useState } from 'react';
import { osAudio } from './osAudio';
import { OS_APPS } from './osData';
import styles from './OperatingSystemSim.module.css';

const TOTAL_RAM_BLOCKS = 8;

export default function MemoryManagerView({ activeAppIds, onToggleApp }) {
  // Local fallback if not controlled from parent
  const [localApps, setLocalApps] = useState(['notes']);

  const runningApps = activeAppIds || localApps;

  const toggleApp = (appId) => {
    if (onToggleApp) {
      onToggleApp(appId);
      return;
    }

    const app = OS_APPS.find((a) => a.id === appId);
    if (runningApps.includes(appId)) {
      osAudio.playAppClose();
      setLocalApps((prev) => prev.filter((id) => id !== appId));
    } else {
      // Calculate projected RAM
      const currentBlocks = runningApps.reduce((acc, id) => {
        const a = OS_APPS.find((x) => x.id === id);
        return acc + (a ? a.ramBlocks : 0);
      }, 0);

      if (currentBlocks + app.ramBlocks > TOTAL_RAM_BLOCKS) {
        osAudio.playAccessDenied();
        alert('⚠️ Memory is full! Please close an application first to free up RAM.');
        return;
      }

      osAudio.playAppOpen();
      setLocalApps((prev) => [...prev, appId]);
    }
  };

  // Compute used RAM blocks
  const usedBlocks = runningApps.reduce((acc, id) => {
    const a = OS_APPS.find((x) => x.id === id);
    return acc + (a ? a.ramBlocks : 0);
  }, 0);

  const freeBlocks = Math.max(0, TOTAL_RAM_BLOCKS - usedBlocks);
  const isFull = usedBlocks >= TOTAL_RAM_BLOCKS;

  return (
    <div className={styles.memoryCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
            🧠 Memory Management: &quot;Who Gets the Memory?&quot;
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            The Operating System provides RAM blocks to apps when they open and frees memory when they close.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Used: <strong>{usedBlocks} / {TOTAL_RAM_BLOCKS} Blocks</strong>
          </span>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              background: isFull ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: isFull ? '#ef4444' : '#10b981',
            }}
          >
            {isFull ? '⚠️ Memory Full' : '✅ Memory Available'}
          </span>
        </div>
      </div>

      {/* RAM BLOCKS GRID */}
      <div className={styles.ramGridContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <span>COMPUTER MEMORY (RAM):</span>
          <span>{freeBlocks} Blocks Free</span>
        </div>

        <div className={styles.ramBlocksRow}>
          {Array.from({ length: TOTAL_RAM_BLOCKS }).map((_, idx) => {
            let assignedApp = null;
            let currentOffset = 0;

            for (const appId of runningApps) {
              const a = OS_APPS.find((x) => x.id === appId);
              if (a) {
                if (idx >= currentOffset && idx < currentOffset + a.ramBlocks) {
                  assignedApp = a;
                  break;
                }
                currentOffset += a.ramBlocks;
              }
            }

            return (
              <div
                key={idx}
                className={`${styles.ramBlock} ${assignedApp ? styles.ramBlockUsed : ''}`}
                style={{
                  background: assignedApp ? 'rgba(56, 189, 248, 0.2)' : undefined,
                  borderColor: assignedApp ? '#38bdf8' : undefined,
                }}
              >
                {assignedApp ? (
                  <>
                    <span style={{ fontSize: '1.2rem' }}>{assignedApp.icon}</span>
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>{assignedApp.name}</span>
                  </>
                ) : (
                  <span>Free</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* OS Speech / Explainer */}
      <div
        style={{
          background: 'var(--color-surface-raised)',
          borderLeft: '4px solid var(--color-accent)',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '1.8rem' }}>🧠</span>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.4 }}>
          <strong>Operating System says:</strong>{' '}
          {usedBlocks === 0
            ? '“All memory is free! Click any application below to launch it.”'
            : isFull
            ? '“⚠️ Memory is getting full! Try closing a program to free up space.”'
            : `“I allocated ${usedBlocks} memory blocks for your active programs. You still have ${freeBlocks} free blocks!”`}
        </div>
      </div>

      {/* APP LAUNCH / CLOSE TOGGLES */}
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-text)' }}>
          Click to Open / Close Applications:
        </h4>
        <div className={styles.appToggleGrid}>
          {OS_APPS.map((app) => {
            const isRunning = runningApps.includes(app.id);
            return (
              <button
                key={app.id}
                type="button"
                className={`${styles.appToggleBtn} ${isRunning ? styles.appToggleBtnActive : ''}`}
                onClick={() => toggleApp(app.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{app.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div>{app.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Needs {app.ramBlocks} RAM {app.ramBlocks === 1 ? 'block' : 'blocks'}
                    </div>
                  </div>
                </div>
                <span>{isRunning ? '🔴 Close' : '🟢 Open'}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
