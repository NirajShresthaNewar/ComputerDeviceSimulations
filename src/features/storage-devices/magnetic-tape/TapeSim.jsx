import { useState, useEffect, useRef } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import TapeDriveDiagram from './TapeDriveDiagram';
import TapeMagneticView from './TapeMagneticView';
import styles from './TapeSim.module.css';

// Pre-fill the tape with some initial data block: "DATA"
// Each char is 8 bits. We separate blocks with Inter-Record Gaps (IRG).
function stringToTapeBits(str) {
  const bits = [];
  // Start with a small empty leader segment
  for (let i = 0; i < 4; i++) {
    bits.push({ bit: 0, label: '', aligned: false, isGap: false });
  }

  for (let charIndex = 0; charIndex < str.length; charIndex++) {
    const char = str[charIndex];
    const code = char.charCodeAt(0);
    
    // Add Inter-Record Gap (IRG) before each block/character
    if (charIndex > 0) {
      bits.push({ bit: 0, label: '', aligned: false, isGap: true });
    }

    // Convert to 8-bit binary
    for (let b = 7; b >= 0; b--) {
      const bitVal = (code >> b) & 1;
      // The first bit of the char carries the letter label for visualization
      bits.push({
        bit: bitVal,
        label: b === 7 ? char : '',
        aligned: true,
        isGap: false
      });
    }
  }

  // End tail segment
  for (let i = 0; i < 5; i++) {
    bits.push({ bit: 0, label: '', aligned: false, isGap: false });
  }
  return bits;
}

const TAPE_PROCESS_STEPS = [
  {
    title: 'Sequential Access Only',
    desc: 'Unlike HDDs that jump directly to any sector, tape must wind linearly. To read Block 5, it must physically spin past Blocks 1, 2, 3, and 4.',
  },
  {
    title: 'Inter-Record Gaps (IRG)',
    desc: 'Because tape drives must physically start and stop the tape motor between records, empty gaps (IRGs) are left to allow for deceleration and acceleration.',
  },
  {
    title: 'Writing with Electromagnets',
    desc: 'The write head uses electric pulses to generate magnetic fields, aligning metallic oxide particles on the tape in specific directions (N-S/S-N).',
  },
  {
    title: 'Reading by Induction',
    desc: 'As the magnetized tape passes the read head gap, the moving magnetic fields induce a tiny electric current in the coil, which is decoded back into 0s and 1s.',
  },
];

export default function TapeSim() {
  const [recordedBits, setRecordedBits] = useState(() => stringToTapeBits('DATA'));
  const [tapePosition, setTapePosition] = useState(0); // 0 (start) to 1 (end)
  const [mode, setMode] = useState('idle'); // idle | read | write | seek
  const [inputText, setInputText] = useState('HELLO');
  const [log, setLog] = useState(['Tape pre-loaded with block "DATA".']);
  const [readText, setReadText] = useState('');
  const [speed, setSpeed] = useState(1);
  const [activeBitIndex, setActiveBitIndex] = useState(-1);
  const [currentWritingBit, setCurrentWritingBit] = useState(0);
  const [cumulativeRotation, setCumulativeRotation] = useState(0);

  const animationRef = useRef(null);
  const targetPosRef = useRef(0);
  const modeRef = useRef('idle');
  const bitsRef = useRef(recordedBits);

  // Sync refs
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    bitsRef.current = recordedBits;
  }, [recordedBits]);

  // Main animation ticker loop
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = now - lastTime;
      lastTime = now;

      if (modeRef.current !== 'idle') {
        const currentPos = targetPosRef.current;
        let diff = targetPosRef.current - tapePosition;
        
        // Dynamic speed based on mode (seeking is fast, read/write is slower and constant)
        let stepSpeed = 0.00015 * speed * dt;
        if (modeRef.current === 'seek') {
          stepSpeed = 0.0006 * speed * dt; // Seek / Rewind spins extra fast
        }

        let newPos = tapePosition;
        let reached = false;

        if (Math.abs(diff) <= stepSpeed) {
          newPos = targetPosRef.current;
          reached = true;
        } else {
          newPos += Math.sign(diff) * stepSpeed;
        }

        // Keep position bound
        newPos = Math.max(0, Math.min(1, newPos));
        setTapePosition(newPos);

        // Update mechanical reel rotation angle
        const rotationDelta = (newPos - tapePosition) * 4500;
        setCumulativeRotation((prev) => (prev + rotationDelta) % 360);

        // Determine which bit is currently under the Read and Write gaps
        // The Write gap is at center, Read gap is 45px left.
        // Let's calculate the bit index that matches this position.
        const totalBits = bitsRef.current.length;
        const headIndex = Math.round(newPos * (totalBits - 1));
        setActiveBitIndex(headIndex);

        // Decipher reading state
        if (modeRef.current === 'read') {
          // If we pass a character boundary, let's read the whole 8-bit character
          const currentBit = bitsRef.current[headIndex];
          if (currentBit && currentBit.aligned && !currentBit.isGap) {
            // Find the character block this bit belongs to
            // Scan backwards to find the starting bit with a label
            let labelIndex = headIndex;
            while (labelIndex >= 0 && !bitsRef.current[labelIndex].label && !bitsRef.current[labelIndex].isGap) {
              labelIndex--;
            }
            if (labelIndex >= 0 && bitsRef.current[labelIndex].label) {
              const charLabel = bitsRef.current[labelIndex].label;
              setReadText((prev) => {
                if (!prev.includes(charLabel)) {
                  setLog((l) => [`Read block containing character: "${charLabel}"`, ...l].slice(0, 5));
                  return prev + charLabel;
                }
                return prev;
              });
            }
          }
        }

        // Decipher writing state
        if (modeRef.current === 'write') {
          // Dynamically align domains under the write head as we scroll
          const currentBit = bitsRef.current[headIndex];
          if (currentBit && !currentBit.aligned) {
            // Flip alignment to true and match with input
            setRecordedBits((prev) => {
              const next = [...prev];
              if (next[headIndex]) {
                next[headIndex].aligned = true;
                setCurrentWritingBit(next[headIndex].bit);
              }
              return next;
            });
          }
        }

        if (reached) {
          // Task completed
          setMode('idle');
          if (modeRef.current === 'seek') {
            setLog((l) => [`Seek complete at target block.`, ...l].slice(0, 5));
          } else if (modeRef.current === 'read') {
            setLog((l) => [`Sequential read sequence finished.`, ...l].slice(0, 5));
          } else if (modeRef.current === 'write') {
            setLog((l) => [`Sequential write complete. Data stored on magnetic tape.`, ...l].slice(0, 5));
          }
        }
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current);
  }, [tapePosition, speed]);

  const handleRewind = () => {
    setMode('seek');
    targetPosRef.current = 0;
    setReadText('');
    setLog((l) => ['Rewinding tape back to the beginning (sequential seek)...', ...l].slice(0, 5));
  };

  const handleRead = () => {
    // Rewind first, then play forward to read
    setMode('seek');
    targetPosRef.current = 0;
    setReadText('');
    setLog((l) => ['Rewinding to start of tape for read initialization...', ...l].slice(0, 5));
    
    // Schedule read after rewind completes (approximately)
    setTimeout(() => {
      setMode('read');
      targetPosRef.current = 1;
      setLog((l) => ['Reading tape sequentially. Converting magnetic transitions back to characters...', ...l].slice(0, 5));
    }, 1800 / speed);
  };

  const handleWrite = () => {
    if (!inputText) return;
    const limitedText = inputText.slice(0, 8).toUpperCase(); // fit inside screen
    const newTapeBits = stringToTapeBits(limitedText);
    
    // Reset tape to 0, align all bits to false (unaligned) so they align in real time under the head!
    const unalignedBits = newTapeBits.map((b) => ({ ...b, aligned: false }));
    
    setRecordedBits(unalignedBits);
    setMode('seek');
    targetPosRef.current = 0;
    setReadText('');
    setLog((l) => [`Preparing tape. Rewinding to clear oxide track...`, ...l].slice(0, 5));

    // Start sequential write animation after rewind completes
    setTimeout(() => {
      setMode('write');
      targetPosRef.current = 0.95; // go up to near end
      setLog((l) => [`Writing characters "${limitedText}" sequentially. Electromagnet is polarizing magnetic domains...`, ...l].slice(0, 5));
    }, 1800 / speed);
  };

  const handleSeekBlock = (targetChar) => {
    // Find the index of the character in recorded bits
    const totalBits = recordedBits.length;
    const bitIndex = recordedBits.findIndex((b) => b.label === targetChar);
    if (bitIndex !== -1) {
      const targetNormalised = bitIndex / (totalBits - 1);
      setMode('seek');
      targetPosRef.current = targetNormalised;
      const currentBlock = Math.round(tapePosition * (totalBits - 1));
      const distance = Math.abs(bitIndex - currentBlock);
      setLog((l) => [
        `Searching for character "${targetChar}" (Seek distance: ${distance} bits)...`,
        ...l
      ].slice(0, 5));
    } else {
      setLog((l) => [`Character "${targetChar}" not found on tape track.`, ...l].slice(0, 5));
    }
  };

  // Convert current recorded bits to binary string format for display
  const binaryString = recordedBits
    .filter(b => !b.isGap)
    .map(b => (b.aligned ? b.bit : '?'))
    .join('');

  /* ---- Simulate Tab Content ---- */
  const simulateContent = (
    <div className={styles.simulateGrid}>
      <div>
        <TapeDriveDiagram
          position={tapePosition}
          rotation={cumulativeRotation}
          playing={mode !== 'idle'}
          direction={mode === 'seek' ? (targetPosRef.current < tapePosition ? 'reverse' : 'forward') : (mode !== 'idle' ? 'forward' : 'idle')}
        />
        
        <TapeMagneticView
          recordedBits={recordedBits}
          position={tapePosition}
          mode={mode}
          activeBitIndex={activeBitIndex}
          currentWritingBit={currentWritingBit}
        />
      </div>

      <div className={styles.right}>
        <div className={styles.controlsPanel}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Sequential Write Data (Max 8 Chars)</span>
            <div className={styles.inputRow}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.toUpperCase())}
                placeholder="HELLO"
                maxLength={8}
                className={styles.textInput}
                disabled={mode !== 'idle'}
              />
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleWrite}
                disabled={mode !== 'idle'}
              >
                Write to Tape
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Tape Navigation Controls</span>
            <div className={styles.actionRow}>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={handleRead}
                disabled={mode !== 'idle'}
              >
                Read Tape Sequential
              </button>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={handleRewind}
                disabled={mode !== 'idle'}
              >
                Rewind (Seek 0)
              </button>
            </div>
          </div>

          {/* Preset Seek Buttons */}
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Seek Specific Character Block (Random Access Test)</span>
            <div className={styles.actionRow}>
              {recordedBits
                .filter((b) => b.label)
                .map((b) => (
                  <button
                    key={b.label}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => handleSeekBlock(b.label)}
                    disabled={mode !== 'idle'}
                    style={{ padding: '6px 12px', minWidth: '40px' }}
                  >
                    "{b.label}"
                  </button>
                ))}
              {recordedBits.filter((b) => b.label).length === 0 && (
                <span style={{ fontSize: '11px', color: '#64748b' }}>No recorded blocks to seek.</span>
              )}
            </div>
          </div>

          {/* Speed Control */}
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Motor Winding Speed: {speed}x</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        {/* Live Status Log */}
        <div className={styles.statusPanel}>
          <div className={styles.statusRow}>
            <span>Drive Mode:</span>
            <span className={styles.statusValue} style={{ textTransform: 'uppercase' }}>{mode}</span>
          </div>
          <div className={styles.statusRow}>
            <span>Tape Position:</span>
            <span className={styles.statusValue}>{Math.round(tapePosition * 100)}%</span>
          </div>
          <div className={styles.statusRow}>
            <span>Read Buffer:</span>
            <span className={styles.statusValue} style={{ color: '#22c55e' }}>{readText || '(empty)'}</span>
          </div>
          
          <span style={{ fontSize: '10px', marginTop: '6px', color: '#64748b', fontWeight: 'bold' }}>TAPE TRACK BINARY OUT:</span>
          <div className={styles.binaryDisplay}>
            {binaryString}
          </div>

          <div className={styles.logBox}>
            <div className={styles.logLabel}>Recent drive events</div>
            {log.map((entry, i) => (
              <div key={i} className={styles.logEntry}>{entry}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ---- Learn Tab Content ---- */
  const learnContent = (
    <ExplanationPanel
      description="Magnetic tape is a sequential secondary storage medium consisting of a thin, magnetizable plastic ribbon wound on reels. Data is recorded track-by-track using tiny electromagnet heads that polarize magnetic domains. Because tape is a physical ribbon, it cannot jump directly to a random address (direct access) like a Hard Disk Drive or Solid-State Drive. Instead, it must wind sequentially past all intermediate blocks. While this makes seek times extremely slow, magnetic tape remains highly popular today for offline archiving and backups due to its massive storage density, low energy consumption when idle, and incredibly low cost-per-terabyte ratio."
      advantages={[
        'Incredibly low cost-per-terabyte ratio for large-scale archiving',
        'Offline storage: consumes zero power once written and shelved',
        'Physical isolation (air gap) protects archived backups from cyberattacks',
        'Very high sequential transfer rates in modern LTO tape cartridge drives',
      ]}
      disadvantages={[
        'Sequential-only access creates very high seek latency (up to several minutes)',
        'Physical tape is vulnerable to humidity, dust, and magnetic fields',
        'Requires specialized, expensive mechanical tape drives to read/write',
        'Must be stored under climate-controlled conditions to prevent decay',
      ]}
      uses={[
        'Cold storage and enterprise database backups (LTO Tape Cartridges)',
        'Historical archival of video and broadcasting feeds',
        'Scientific data archiving (e.g. particle physics, climate research datasets)',
        'Disaster recovery planning requiring off-site physical media storage',
      ]}
    />
  );

  /* ---- Quiz Tab Content ---- */
  const quizContent = (
    <p style={{ color: 'var(--color-text-muted)' }}>
      Quiz questions for this device are coming in Phase 6.
    </p>
  );

  return (
    <div>
      <h1>Magnetic Tape Storage</h1>
      <p className={styles.subtitle}>
        Understand how data is stored sequentially using magnetic domains on physical tape reels.
      </p>
      <SimTabs
        learnContent={learnContent}
        simulateContent={simulateContent}
        quizContent={quizContent}
      />
    </div>
  );
}
