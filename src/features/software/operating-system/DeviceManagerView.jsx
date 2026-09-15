import { useState } from 'react';
import { osAudio } from './osAudio';
import styles from './OperatingSystemSim.module.css';

const OS_DEVICES = [
  { id: 'printer', name: 'Printer', icon: '🖨️', driverName: 'Printer Driver', actionLabel: 'Print Test Page', request: '“Print my homework page”', breakdown: ['Feed paper', 'Spray ink', 'Print text', 'Eject page'] },
  { id: 'speaker', name: 'Speaker', icon: '🔊', driverName: 'Audio Driver', actionLabel: 'Play Sound', request: '“Play alert chime”', breakdown: ['Check volume', 'Convert audio to signal', 'Vibrate speaker cone'] },
  { id: 'mouse', name: 'Mouse', icon: '🖱️', driverName: 'Mouse Driver', actionLabel: 'Move Cursor', request: '“Update cursor position”', breakdown: ['Read optical delta', 'Apply sensitivity', 'Move pointer'] },
  { id: 'keyboard', name: 'Keyboard', icon: '⌨️', driverName: 'Keyboard Driver', actionLabel: 'Type Letter', request: '“Read keypress”', breakdown: ['Read switch matrix', 'Lookup character', 'Send key "A" to OS'] },
];

export default function DeviceManagerView() {
  const [selectedDeviceId, setSelectedDeviceId] = useState('printer');
  const [isDriverOn, setIsDriverOn] = useState(true);
  const [stage, setStage] = useState(0); // 0 = idle, 1 = sending, 2 = result

  const dev = OS_DEVICES.find((d) => d.id === selectedDeviceId) || OS_DEVICES[0];

  const handleSendAction = () => {
    osAudio.playClick();
    setStage(1);

    setTimeout(() => {
      setStage(2);
      if (isDriverOn) {
        osAudio.playSuccessFanfare();
      } else {
        osAudio.playAccessDenied();
      }
    }, 1200);
  };

  const handleReset = () => {
    osAudio.playClick();
    setStage(0);
  };

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
            🖨️ Device Management: Hardware &amp; Drivers
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            The Operating System manages hardware devices and uses device drivers to communicate with them.
          </p>
        </div>

        {/* Driver Toggle Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
            Device Driver:
          </span>
          <div style={{ display: 'flex', background: 'var(--color-surface-raised)', padding: '3px', borderRadius: '20px', border: '1px solid var(--color-border)', gap: '4px' }}>
            <button
              type="button"
              onClick={() => {
                osAudio.playClick();
                setIsDriverOn(true);
                setStage(0);
              }}
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                border: 'none',
                background: isDriverOn ? '#10b981' : 'transparent',
                color: isDriverOn ? '#fff' : 'var(--color-text-muted)',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              🟢 ON
            </button>
            <button
              type="button"
              onClick={() => {
                osAudio.playClick();
                setIsDriverOn(false);
                setStage(0);
              }}
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                border: 'none',
                background: !isDriverOn ? '#ef4444' : 'transparent',
                color: !isDriverOn ? '#fff' : 'var(--color-text-muted)',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              🔴 OFF
            </button>
          </div>
        </div>
      </div>

      {/* Device Selector Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {OS_DEVICES.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`${styles.secondaryBtn} ${selectedDeviceId === d.id ? styles.primaryBtn : ''}`}
            onClick={() => {
              osAudio.playClick();
              setSelectedDeviceId(d.id);
              setStage(0);
            }}
          >
            <span>{d.icon}</span>
            <span>{d.name}</span>
          </button>
        ))}
      </div>

      {/* 3-NODE PIPELINE DIAGRAM */}
      <div
        style={{
          background: 'var(--color-bg)',
          border: '2px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        {/* Node 1: OS */}
        <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '2.4rem' }}>🖥️</div>
          <strong style={{ color: 'var(--color-text)' }}>Operating System</strong>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Sends request: {dev.request}
          </div>
        </div>

        {/* Node 2: Driver */}
        <div
          style={{
            background: 'var(--color-surface)',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: `2px solid ${isDriverOn ? 'var(--color-accent)' : '#ef4444'}`,
            opacity: isDriverOn ? 1 : 0.4,
          }}
        >
          <div style={{ fontSize: '2.4rem' }}>{isDriverOn ? '🧑‍🔧' : '🚫'}</div>
          <strong style={{ color: 'var(--color-text)' }}>{dev.driverName}</strong>
          <div style={{ fontSize: '0.8rem', color: isDriverOn ? '#10b981' : '#ef4444', marginTop: '4px' }}>
            {isDriverOn ? 'Translates request to hardware steps' : 'Driver Disabled'}
          </div>
        </div>

        {/* Node 3: Hardware Device */}
        <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '2.4rem' }}>{dev.icon}</div>
          <strong style={{ color: 'var(--color-text)' }}>{dev.name} (Hardware)</strong>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {stage === 2 && isDriverOn
              ? '✅ “Understood! Action completed!”'
              : stage === 2 && !isDriverOn
              ? '❌ “What do you mean? 🤔”'
              : 'Waiting for instructions...'}
          </div>
        </div>
      </div>

      {/* ACTION CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleSendAction}
          disabled={stage === 1}
        >
          <span>▶</span>
          <span>{stage === 1 ? 'Communicating...' : `${dev.actionLabel}`}</span>
        </button>

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={handleReset}
        >
          <span>🔄 Reset</span>
        </button>
      </div>

      {/* RESULT FEEDBACK */}
      {stage === 2 && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            background: isDriverOn ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            borderLeft: `4px solid ${isDriverOn ? '#10b981' : '#ef4444'}`,
            color: 'var(--color-text)',
            fontSize: '0.95rem',
          }}
        >
          <strong>{isDriverOn ? '✅ Communication Successful!' : '❌ Communication Failed!'}</strong>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            {isDriverOn
              ? `The Operating System communicated with the ${dev.name} through the ${dev.driverName} helper.`
              : `Without the ${dev.driverName}, the ${dev.name} cannot understand the Operating System's command.`}
          </p>
        </div>
      )}
    </div>
  );
}
