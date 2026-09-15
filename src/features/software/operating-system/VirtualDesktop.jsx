import { useState } from 'react';
import { osAudio } from './osAudio';
import { OS_APPS } from './osData';
import styles from './OperatingSystemSim.module.css';

export default function VirtualDesktop({ activeApps, onToggleApp, onNavigateTab }) {
  const [runningApps, setRunningApps] = useState(activeApps || ['notes', 'music']);
  const [activeWindow, setActiveWindow] = useState('notes');

  const apps = activeApps || runningApps;

  const handleAppClick = (appId) => {
    if (onToggleApp) {
      onToggleApp(appId);
    } else {
      if (apps.includes(appId)) {
        osAudio.playAppClose();
        setRunningApps((prev) => prev.filter((id) => id !== appId));
        if (activeWindow === appId) setActiveWindow(null);
      } else {
        osAudio.playAppOpen();
        setRunningApps((prev) => [...prev, appId]);
        setActiveWindow(appId);
      }
    }
  };

  const totalRamBlocks = 8;
  const usedRamBlocks = apps.reduce((acc, id) => {
    const a = OS_APPS.find((x) => x.id === id);
    return acc + (a ? a.ramBlocks : 0);
  }, 0);
  const ramPercent = Math.round((usedRamBlocks / totalRamBlocks) * 100);

  const totalCpuPercent = Math.min(
    100,
    apps.reduce((acc, id) => {
      const a = OS_APPS.find((x) => x.id === id);
      return acc + (a ? a.cpuPercent : 0);
    }, 0)
  );

  return (
    <div className={styles.desktopWrapper}>
      {/* 1. TOP STATUS BAR */}
      <div className={styles.desktopTopbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🖥️</span>
          <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>MY VIRTUAL COMPUTER</span>
          <span style={{ fontSize: '0.75rem', background: '#334155', padding: '1px 6px', borderRadius: '4px' }}>
            Class 5 OS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>📶 WiFi: Connected</span>
          <span>🔋 85%</span>
          <span>🕒 10:30 AM</span>
        </div>
      </div>

      {/* 2. DESKTOP WORKSPACE & APP ICONS */}
      <div className={styles.desktopWorkspace}>
        {OS_APPS.map((app) => {
          const isRunning = apps.includes(app.id);
          return (
            <div
              key={app.id}
              className={`${styles.desktopAppIcon} ${isRunning ? styles.desktopAppIconRunning : ''}`}
              onClick={() => handleAppClick(app.id)}
            >
              <span className={styles.desktopIconEmoji}>{app.icon}</span>
              <span className={styles.desktopIconLabel}>{app.name}</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isRunning ? '#10b981' : '#334155',
                  color: isRunning ? '#000' : '#94a3b8',
                  fontWeight: 'bold',
                }}
              >
                {isRunning ? '● Open' : 'Closed'}
              </span>
            </div>
          );
        })}

        {/* Quick shortcut to Files */}
        <div
          className={styles.desktopAppIcon}
          onClick={() => onNavigateTab && onNavigateTab('files')}
        >
          <span className={styles.desktopIconEmoji}>📁</span>
          <span className={styles.desktopIconLabel}>File Cabinet</span>
          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Open Explorer</span>
        </div>

        {/* Quick shortcut to Devices */}
        <div
          className={styles.desktopAppIcon}
          onClick={() => onNavigateTab && onNavigateTab('devices')}
        >
          <span className={styles.desktopIconEmoji}>🖨️</span>
          <span className={styles.desktopIconLabel}>Printers &amp; Devices</span>
          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>4 Connected</span>
        </div>

        {/* Quick shortcut to Security */}
        <div
          className={styles.desktopAppIcon}
          onClick={() => onNavigateTab && onNavigateTab('security')}
        >
          <span className={styles.desktopIconEmoji}>🔒</span>
          <span className={styles.desktopIconLabel}>Security &amp; Users</span>
          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Protected</span>
        </div>
      </div>

      {/* 3. UNIFIED OS CONNECTION BANNER */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid #334155',
          padding: '14px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ color: '#94a3b8' }}>
          <strong style={{ color: '#38bdf8' }}>⚙️ PROCESS MANAGEMENT:</strong>
          <div>{apps.length} {apps.length === 1 ? 'app' : 'apps'} sharing CPU time</div>
        </div>
        <div style={{ color: '#94a3b8' }}>
          <strong style={{ color: '#34d399' }}>🧠 MEMORY MANAGEMENT:</strong>
          <div>{usedRamBlocks} of {totalRamBlocks} RAM blocks allocated</div>
        </div>
        <div style={{ color: '#94a3b8' }}>
          <strong style={{ color: '#a78bfa' }}>📁 FILE MANAGEMENT:</strong>
          <div>Organizing School, Photos, Music</div>
        </div>
        <div style={{ color: '#94a3b8' }}>
          <strong style={{ color: '#f472b6' }}>🖨️ DEVICE &amp; SECURITY:</strong>
          <div>Drivers active • User protected</div>
        </div>
      </div>

      {/* 4. BOTTOM TASKBAR & LIVE RESOURCE METERS */}
      <div className={styles.desktopTaskbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#38bdf8', color: '#000', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            🪟 Start
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Running: {apps.join(', ') || 'No apps'}
          </span>
        </div>

        <div className={styles.resourceStats}>
          {/* RAM Meter */}
          <div className={styles.resourceMeter}>
            <span>🧠 RAM:</span>
            <div className={styles.miniProgressBar}>
              <div
                className={styles.miniProgressFill}
                style={{
                  width: `${ramPercent}%`,
                  background: ramPercent > 80 ? '#ef4444' : '#34d399',
                }}
              />
            </div>
            <span>{ramPercent}%</span>
          </div>

          {/* CPU Meter */}
          <div className={styles.resourceMeter}>
            <span>⚙️ CPU:</span>
            <div className={styles.miniProgressBar}>
              <div
                className={styles.miniProgressFill}
                style={{
                  width: `${totalCpuPercent}%`,
                  background: totalCpuPercent > 80 ? '#ef4444' : '#38bdf8',
                }}
              />
            </div>
            <span>{totalCpuPercent}%</span>
          </div>

          {/* Connected devices */}
          <div>
            <span>🔊 4 Devices OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
