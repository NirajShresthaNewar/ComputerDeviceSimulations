import { useState } from 'react';
import { driverAudio } from './driverAudio';
import { MATCH_ACTIVITY_DATA } from './driverData';
import styles from './DeviceDriverSim.module.css';

export default function MatchDriverActivity() {
  const [activeDeviceIdx, setActiveDeviceIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentActivity = MATCH_ACTIVITY_DATA[activeDeviceIdx];

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      driverAudio.playSuccessAction();
    } else {
      driverAudio.playConfused();
    }
  };

  const handleNextDevice = () => {
    driverAudio.playClick();
    setSelectedOptionId(null);
    setIsAnswered(false);
    setActiveDeviceIdx((prev) => (prev + 1) % MATCH_ACTIVITY_DATA.length);
  };

  const currentOption = currentActivity.options.find((o) => o.id === selectedOptionId);

  return (
    <div className={styles.matchSection}>
      <div className={styles.matchHeader}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
            🎮 Match the Driver Activity
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Different hardware devices need their own specific driver helpers. Pick the right driver!
          </p>
        </div>

        {/* Device Switcher */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {MATCH_ACTIVITY_DATA.map((item, idx) => (
            <button
              key={item.deviceId}
              type="button"
              className={`${styles.devicePillBtn} ${
                activeDeviceIdx === idx ? styles.devicePillBtnActive : ''
              }`}
              onClick={() => {
                driverAudio.playClick();
                setActiveDeviceIdx(idx);
                setSelectedOptionId(null);
                setIsAnswered(false);
              }}
            >
              <span>{item.deviceIcon}</span>
              <span>{item.deviceName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Question */}
      <div
        style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span style={{ fontSize: '2.5rem' }}>{currentActivity.deviceIcon}</span>
        <div>
          <strong style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
            Which Driver does the {currentActivity.deviceName} need?
          </strong>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Click the matching driver software below to connect it.
          </div>
        </div>
      </div>

      {/* Driver Options Grid */}
      <div className={styles.matchGrid}>
        {currentActivity.options.map((option) => {
          let btnClass = styles.matchOptionBtn;
          if (isAnswered) {
            if (option.isCorrect) {
              btnClass += ` ${styles.matchOptionCorrect}`;
            } else if (option.id === selectedOptionId && !option.isCorrect) {
              btnClass += ` ${styles.matchOptionWrong}`;
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              className={btnClass}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
            >
              <span style={{ fontSize: '1.8rem' }}>{option.icon}</span>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div>{option.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Driver Software
                </div>
              </div>
              {isAnswered && option.isCorrect && <span>✅</span>}
              {isAnswered && option.id === selectedOptionId && !option.isCorrect && (
                <span>❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next Button */}
      {isAnswered && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 18px',
            borderRadius: '10px',
            background: currentOption?.isCorrect
              ? 'rgba(16, 185, 129, 0.12)'
              : 'rgba(239, 68, 68, 0.12)',
            borderLeft: `4px solid ${currentOption?.isCorrect ? '#10b981' : '#ef4444'}`,
            color: 'var(--color-text)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <strong>
              {currentOption?.isCorrect
                ? `✅ Correct! The ${currentActivity.deviceName} uses the ${currentActivity.correctDriverName}.`
                : `❌ Try again! This driver is designed for a different device.`}
            </strong>
          </div>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleNextDevice}
            style={{ padding: '8px 18px', fontSize: '0.9rem' }}
          >
            <span>Next Device ➔</span>
          </button>
        </div>
      )}
    </div>
  );
}
