import { useState, useEffect, useRef } from 'react';
import { osAudio } from './osAudio';
import { OS_APPS } from './osData';
import styles from './OperatingSystemSim.module.css';

export default function ProcessManagerView({ activeAppIds, onToggleApp }) {
  const [runningApps, setRunningApps] = useState(['notes', 'music']);
  const [activeCpuAppId, setActiveCpuAppId] = useState('notes');
  const [isMultitaskingActive, setIsMultitaskingActive] = useState(true);

  const timerRef = useRef(null);

  const appsInUse = activeAppIds || runningApps;

  const toggleApp = (appId) => {
    if (onToggleApp) {
      onToggleApp(appId);
      return;
    }

    if (appsInUse.includes(appId)) {
      osAudio.playAppClose();
      setRunningApps((prev) => prev.filter((id) => id !== appId));
    } else {
      osAudio.playAppOpen();
      setRunningApps((prev) => [...prev, appId]);
    }
  };

  // CPU Round-Robin Time-sharing animation
  useEffect(() => {
    if (!isMultitaskingActive || appsInUse.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    let currentIndex = 0;
    timerRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % appsInUse.length;
      setActiveCpuAppId(appsInUse[currentIndex]);
    }, 1100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appsInUse, isMultitaskingActive]);

  // Compute CPU load percentage
  const totalCpuLoad = Math.min(
    100,
    appsInUse.reduce((acc, id) => {
      const a = OS_APPS.find((x) => x.id === id);
      return acc + (a ? a.cpuPercent : 0);
    }, 0)
  );

  const getLoadStatus = () => {
    if (appsInUse.length <= 2) return { text: '😊 Smooth & Fast', color: '#10b981' };
    if (appsInUse.length <= 4) return { text: '😐 Busy & Working Hard', color: '#f59e0b' };
    return { text: '🥵 Very Busy (High Load)', color: '#ef4444' };
  };

  const activeAppObj = OS_APPS.find((a) => a.id === activeCpuAppId) || OS_APPS[0];

  return (
    <div className={styles.cpuStation}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
            ⚙️ Process Management: &quot;Who Gets the CPU?&quot;
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            The Operating System manages running programs and shares CPU time so programs can multitask smoothly.
          </p>
        </div>

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => {
            osAudio.playClick();
            setIsMultitaskingActive((prev) => !prev);
          }}
        >
          <span>{isMultitaskingActive ? '⏸ Pause CPU Time-Sharing' : '▶ Resume CPU Time-Sharing'}</span>
        </button>
      </div>

      {/* CPU TIME-SHARING CORE STATION */}
      <div className={styles.cpuConveyor}>
        {/* Left: Programs Waiting in Line */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
            RUNNING QUEUE:
          </span>
          {appsInUse.map((appId) => {
            const app = OS_APPS.find((x) => x.id === appId);
            if (!app) return null;
            const isUsingCpu = activeCpuAppId === appId && isMultitaskingActive;
            return (
              <div
                key={appId}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: isUsingCpu ? 'rgba(56, 189, 248, 0.25)' : 'var(--color-surface)',
                  border: `1px solid ${isUsingCpu ? '#38bdf8' : 'var(--color-border)'}`,
                  color: isUsingCpu ? '#38bdf8' : 'var(--color-text)',
                  fontWeight: isUsingCpu ? 'bold' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transform: isUsingCpu ? 'translateX(6px)' : 'none',
                  transition: 'all 120ms ease',
                }}
              >
                <span>{app.icon} {app.name}</span>
                {isUsingCpu && <span style={{ fontSize: '0.75rem', background: '#38bdf8', color: '#000', padding: '1px 6px', borderRadius: '4px' }}>In CPU</span>}
              </div>
            );
          })}

          {appsInUse.length === 0 && (
            <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
              No programs running.
            </div>
          )}
        </div>

        {/* Center: CPU Core with Active App */}
        <div className={styles.cpuCoreBox}>
          <span className={isMultitaskingActive && appsInUse.length > 0 ? styles.cpuSpinningGear : ''}>⚙️</span>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>CPU CORE</div>
          {appsInUse.length > 0 ? (
            <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 'bold' }}>
              {activeAppObj.icon} {activeAppObj.name}
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Idle</div>
          )}
        </div>

        {/* Right: CPU Load Meter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
            CPU USAGE METER:
          </span>

          <div style={{ background: 'var(--color-bg)', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--color-text)' }}>CPU Load:</span>
              <strong style={{ color: getLoadStatus().color }}>{totalCpuLoad}%</strong>
            </div>

            <div style={{ height: '10px', background: 'var(--color-surface)', borderRadius: '5px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${totalCpuLoad}%`,
                  background: getLoadStatus().color,
                  transition: 'width 300ms ease',
                }}
              />
            </div>

            <div style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: 'bold', color: getLoadStatus().color }}>
              Status: {getLoadStatus().text}
            </div>
          </div>
        </div>
      </div>

      {/* Multitasking App Toggles */}
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-text)' }}>
          Launch more programs to see how the OS shares CPU time:
        </h4>
        <div className={styles.appToggleGrid}>
          {OS_APPS.map((app) => {
            const isRunning = appsInUse.includes(app.id);
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
                      Uses {app.cpuPercent}% CPU
                    </div>
                  </div>
                </div>
                <span>{isRunning ? '🔴 Stop' : '🟢 Start'}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
