import { useState, useEffect, useRef, useCallback } from 'react';
import { driverAudio } from './driverAudio';
import { DEVICES_DATA } from './driverData';
import styles from './DeviceDriverSim.module.css';

export default function DeviceConversationEngine({ activeDeviceId, isDriverOn }) {
  const device = DEVICES_DATA[activeDeviceId] || DEVICES_DATA.printer;

  // Step state: 0 = idle, 1 = computer sent, 2 = driver processing (or reached device if off), 3 = device responding, 4 = action completed
  const [step, setStep] = useState(0);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [speed, setSpeed] = useState(1);

  const timerRef = useRef(null);

  const resetState = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStep(0);
    setIsPlayingAll(false);
  }, []);

  useEffect(() => {
    resetState();
  }, [activeDeviceId, isDriverOn, resetState]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNextStep = () => {
    if (!isDriverOn) {
      // Driver OFF sequence: 0 -> 1 -> 2 (Confused)
      if (step === 0) {
        setStep(1);
        driverAudio.playSend();
      } else if (step === 1) {
        setStep(2);
        driverAudio.playConfused();
      }
    } else {
      // Driver ON sequence: 0 -> 1 -> 2 -> 3 -> 4
      if (step === 0) {
        setStep(1);
        driverAudio.playSend();
      } else if (step === 1) {
        setStep(2);
        driverAudio.playProcess();
      } else if (step === 2) {
        setStep(3);
        driverAudio.playSend();
      } else if (step === 3) {
        setStep(4);
        driverAudio.playSuccessAction();
      }
    }
  };

  const handlePlayAll = () => {
    if (isPlayingAll) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlayingAll(false);
      return;
    }

    setIsPlayingAll(true);
    let current = step;
    if (!isDriverOn && current >= 2) current = 0;
    if (isDriverOn && current >= 4) current = 0;

    const intervalTime = Math.max(700, 1600 / speed);

    timerRef.current = setInterval(() => {
      current++;
      if (!isDriverOn) {
        if (current === 1) {
          setStep(1);
          driverAudio.playSend();
        } else if (current === 2) {
          setStep(2);
          driverAudio.playConfused();
          setIsPlayingAll(false);
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        if (current === 1) {
          setStep(1);
          driverAudio.playSend();
        } else if (current === 2) {
          setStep(2);
          driverAudio.playProcess();
        } else if (current === 3) {
          setStep(3);
          driverAudio.playSend();
        } else if (current === 4) {
          setStep(4);
          driverAudio.playSuccessAction();
          setIsPlayingAll(false);
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, intervalTime);
  };

  const isComplete = isDriverOn ? step === 4 : step === 2;

  return (
    <div className={styles.conversationStage}>
      {/* 1. THREE-NODE PIPELINE ROW */}
      <div className={styles.pipelineRow}>
        {/* NODE 1: COMPUTER / OS */}
        <div className={`${styles.nodeCard} ${step >= 1 ? styles.nodeCardActive : ''}`}>
          <div className={styles.nodeIcon}>🖥️</div>
          <h4 className={styles.nodeTitle}>Computer (OS)</h4>
          <span className={styles.nodeRoleBadge}>Command Sender</span>

          {step >= 1 ? (
            <div className={styles.speechBubble}>
              <strong>Computer:</strong>
              <div>{device.computerRequest}</div>
            </div>
          ) : (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: 'auto' }}>
              Ready to send request...
            </div>
          )}
        </div>

        {/* CONNECTOR 1: Computer -> Driver (or direct to device) */}
        <div className={styles.connectorChannel}>
          <span
            className={`${styles.connectorArrow} ${
              step >= 1 ? (isDriverOn ? styles.connectorArrowActive : styles.connectorArrowFailed) : ''
            }`}
          >
            ➔
          </span>
          {step === 1 && (
            <span className={styles.packetBadge}>
              {isDriverOn ? 'Sending to Driver...' : 'Direct Signal...'}
            </span>
          )}
        </div>

        {/* NODE 2: DEVICE DRIVER (HELPER) */}
        <div
          className={`${styles.nodeCard} ${
            !isDriverOn
              ? styles.nodeCardDisabled
              : step >= 2
              ? styles.nodeCardActive
              : ''
          }`}
        >
          <div className={styles.nodeIcon}>{isDriverOn ? '🧑‍🔧' : '🚫'}</div>
          <h4 className={styles.nodeTitle}>{device.driverName}</h4>
          <span className={styles.nodeRoleBadge}>
            {isDriverOn ? 'Helper Software' : 'Driver Disabled'}
          </span>

          {isDriverOn ? (
            step >= 2 ? (
              <div className={`${styles.speechBubble} ${styles.speechBubbleSuccess}`}>
                <strong>Driver Helper:</strong>
                <div>{device.driverGreeting}</div>
              </div>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: 'auto' }}>
                Waiting for request...
              </div>
            )
          ) : (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', marginTop: 'auto' }}>
              ❌ No Driver Helper Active
            </div>
          )}
        </div>

        {/* CONNECTOR 2: Driver -> Device */}
        <div className={styles.connectorChannel}>
          <span
            className={`${styles.connectorArrow} ${
              isDriverOn && step >= 3 ? styles.connectorArrowActive : ''
            }`}
          >
            ➔
          </span>
          {isDriverOn && step === 3 && (
            <span className={styles.packetBadge}>Explaining...</span>
          )}
        </div>

        {/* NODE 3: HARDWARE DEVICE */}
        <div
          className={`${styles.nodeCard} ${
            !isDriverOn && step >= 2
              ? styles.nodeCardConfused
              : isDriverOn && step >= 3
              ? styles.nodeCardActive
              : ''
          }`}
        >
          <div className={styles.nodeIcon}>{device.icon}</div>
          <h4 className={styles.nodeTitle}>{device.name}</h4>
          <span className={styles.nodeRoleBadge}>Hardware Device</span>

          {!isDriverOn && step >= 2 ? (
            <div className={`${styles.speechBubble} ${styles.speechBubbleConfused}`}>
              <strong>{device.name}:</strong>
              <div>{device.confusedResponse}</div>
            </div>
          ) : isDriverOn && step >= 3 ? (
            <div className={`${styles.speechBubble} ${styles.speechBubbleSuccess}`}>
              <strong>{device.name}:</strong>
              <div>{device.deviceSuccessResponse}</div>
            </div>
          ) : (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: 'auto' }}>
              Waiting for instructions...
            </div>
          )}
        </div>
      </div>

      {/* 2. DRIVER DECOMPOSITION BOX (Active when Driver is ON and processing) */}
      {isDriverOn && step >= 2 && (
        <div className={styles.driverBreakdownBox}>
          <h4 className={styles.breakdownTitle}>
            <span>🧑‍🔧</span>
            <span>How the Driver Explains the Instruction:</span>
          </h4>
          <div className={styles.breakdownStepsGrid}>
            {device.driverTranslation.map((item, idx) => {
              const isActive = step >= 3 || (step === 2 && idx === 0);
              return (
                <div
                  key={idx}
                  className={`${styles.breakdownStepItem} ${
                    isActive ? styles.breakdownStepItemActive : ''
                  }`}
                >
                  <span>{isActive ? '✓' : '•'}</span>
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. HARDWARE ACTION ANIMATION PANEL */}
      {step > 0 && (
        <div className={styles.hardwareActionPanel}>
          {!isDriverOn && step >= 2 ? (
            <div style={{ textAlign: 'center', color: '#ef4444' }}>
              <div style={{ fontSize: '2rem', marginBottom: '4px' }}>❌</div>
              <strong style={{ fontSize: '1.05rem' }}>Communication Failed!</strong>
              <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                The computer and hardware device cannot understand each other without a <strong>Device Driver helper</strong>.
              </p>
            </div>
          ) : isDriverOn && step >= 4 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              {device.actionVisualType === 'printer' && (
                <div className={styles.printerVisualBox}>
                  <div className={styles.animatedPaperSheet}>
                    <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                      TEST PAGE
                    </div>
                    <div style={{ fontSize: '0.65rem', marginTop: '4px', color: '#4b5563' }}>
                      Class 5 Computer Science<br />
                      Device Driver Simulation<br />
                      Status: Printed OK! ✅
                    </div>
                  </div>
                </div>
              )}

              {device.actionVisualType === 'speaker' && (
                <div className={styles.speakerWaveBox}>
                  <span className={styles.soundWavePulse}>🔊 🎵 🎶 🔊</span>
                </div>
              )}

              {device.actionVisualType === 'keyboard' && (
                <div style={{ background: '#000', padding: '12px 24px', borderRadius: '8px', color: '#22c55e', fontFamily: 'monospace' }}>
                  &gt; [KEYBOARD INPUT DETECTED: KEY &apos;A&apos; PRESSED]
                </div>
              )}

              {device.actionVisualType === 'mouse' && (
                <div style={{ background: 'var(--color-surface)', padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  🎯 Coordinates: <strong>X: 450, Y: 320</strong> (Cursor moved smoothly!)
                </div>
              )}

              <div style={{ color: 'var(--color-accent)', fontWeight: '700', fontSize: '1rem', marginTop: '4px' }}>
                ✅ {device.successResultText}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {isDriverOn
                ? `Step ${step} of 4 in progress...`
                : 'Step 1 of 2: Instruction sent directly to hardware...'}
            </div>
          )}
        </div>
      )}

      {/* 4. SMARTBOARD CONTROLS */}
      <div className={styles.controlsBar}>
        <div className={styles.controlsLeft}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleNextStep}
            disabled={isComplete || isPlayingAll}
          >
            <span>▶</span>
            <span>
              {step === 0
                ? device.actionBtnText
                : !isDriverOn
                ? 'Step to Hardware'
                : step === 1
                ? 'Step to Driver'
                : step === 2
                ? 'Step to Device'
                : 'Perform Action'}
            </span>
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handlePlayAll}
            disabled={isComplete && !isPlayingAll}
          >
            <span>{isPlayingAll ? '⏸' : '⚡'}</span>
            <span>{isPlayingAll ? 'Pause' : 'Play All'}</span>
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              driverAudio.playClick();
              resetState();
            }}
          >
            <span>🔄</span>
            <span>Reset</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Status: {isComplete ? 'Finished' : step === 0 ? 'Ready' : 'Running'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-text)',
                padding: '4px 8px',
                fontSize: '0.85rem',
              }}
            >
              <option value={0.7}>Slow (Classroom)</option>
              <option value={1}>Normal</option>
              <option value={1.5}>Fast</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
