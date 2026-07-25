import { useState, useEffect, useCallback } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import CpuInternalsDiagram from '../../../components/simulation-shell/CpuInternalsDiagram';
import VirtualKeyboard from './VirtualKeyboard';
import ScanCodeDisplay from './ScanCodeDisplay';
import { scanCodeMap } from './keyboardData';
import styles from './KeyboardSim.module.css';

export default function KeyboardSim() {
  const [activeCode, setActiveCode] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);
  const [signal, setSignal] = useState(null);
  const [typed, setTyped] = useState('');

  const handleKeyDown = useCallback((e) => {
    if (e.repeat) return;

    const code = e.code;
    const scanCode = scanCodeMap[code];
    const ascii = e.key.length === 1 ? e.key.charCodeAt(0) : null;
    const char = e.key.length === 1 ? e.key : null;

    setActiveCode(code);
    setLastEvent({ code, scanCode, ascii, char });

    // A keypress is an instruction the CU decodes, then resolves via Memory
    // (the keymap lookup) and sends to Output — no ALU computation needed,
    // and no secondary storage involved for a normal keystroke.
    setSignal({
      kind: 'Instruction',
      usesALU: false,
      usesStorage: false,
      detail: `Scan code ${
        scanCode != null ? '0x' + scanCode.toString(16).toUpperCase().padStart(2, '0') : '??'
      } reached the Control Unit, which looked up the matching character in Memory and sent "${
        char || code
      }" to Output.`,
    });
  }, []);

  const handleKeyUp = useCallback((e) => {
    setActiveCode((prev) => (prev === e.code ? null : prev));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const simulateContent = (
    <div className={styles.simulateGrid}>
      <div className={styles.left}>
        <VirtualKeyboard activeCode={activeCode} />
        <div className={styles.typingArea}>
          <label htmlFor="typing-test" className={styles.typingLabel}>
            Type here to test the keyboard
          </label>
          <textarea
            id="typing-test"
            className={styles.textarea}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Start typing..."
            rows={3}
          />
        </div>
      </div>
      <div className={styles.right}>
        <ScanCodeDisplay lastEvent={lastEvent} />
        <CpuInternalsDiagram signal={signal} />
      </div>
    </div>
  );

  const learnContent = (
    <ExplanationPanel
      description="A keyboard is an input device that gives data and instruction by pressing keys."
      advantages={[
        'Fast and precise for entering text and commands',
        'Supports shortcuts that speed up repetitive tasks',
        'Widely standardized — most layouts are similar across devices',
      ]}
      uses={[
        'Typing documents, code, and messages',
        'Entering commands in software and games',
        'Keyboard shortcuts for accessibility and speed',
        'Data entry in point-of-sale and kiosk systems',
      ]}
      disadvantages={[
    
      ]}
    />
  );

  const quizContent = (
    <p style={{ color: 'var(--color-text-muted)' }}>
      Quiz questions for this device are coming in Phase 6.
    </p>
  );

  return (
    <div>
      <h1>Keyboard</h1>
      <p className={styles.subtitle}>
        Press any physical key to see it travel from scan code to character.
      </p>
      <SimTabs
        learnContent={learnContent}
        simulateContent={simulateContent}
        quizContent={quizContent}
      />
    </div>
  );
}