import { useState } from 'react';
import { soundFx } from './audioEffects';
import styles from './LanguageTranslatorSim.module.css';

const PRESET_MESSAGES = [
  { label: 'Welcome to Class 5', text: 'print("Welcome to Class 5")\nprint("Computer is awesome")\nprint("We love learning")' },
  { label: 'My Pet Dog', text: 'print("I have a pet dog")\nprint("His name is Rocky")\nprint("He likes running")' },
  { label: 'Space Mission', text: 'print("Rocket launching in 3.. 2.. 1..")\nprint("Blast off to Mars!")\nprint("Mission successful!")' },
];

// Helper to generate pseudorandom/deterministic binary string from text
function textToBinary(text) {
  return text
    .split('')
    .slice(0, 8)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

export default function TryItYourselfSandbox() {
  const [inputText, setInputText] = useState(PRESET_MESSAGES[0].text);
  const [sandboxTranslator, setSandboxTranslator] = useState('compiler');
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const lines = inputText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const handleReset = () => {
    setActiveStep(0);
    setIsProcessing(false);
  };

  const handleRunCompiler = () => {
    if (isProcessing) return;
    soundFx.playClick();
    setIsProcessing(true);
    setActiveStep(1);

    setTimeout(() => {
      setActiveStep(2);
      setIsProcessing(false);
      soundFx.playCompileDone();
    }, 1200);
  };

  const handleNextLineInterpreter = () => {
    if (activeStep >= lines.length) return;
    const next = activeStep + 1;
    setActiveStep(next);
    soundFx.playStep();
    if (next === lines.length) {
      soundFx.playCompileDone();
    }
  };

  return (
    <div className={styles.sandboxCard}>
      <div className={styles.sandboxHeader}>
        <h3 className={styles.sandboxTitle}>🧪 Try It Yourself: Interactive Translation Sandbox</h3>

        <div className={styles.sandboxPresetGroup}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Presets:</span>
          {PRESET_MESSAGES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.presetBtn}
              onClick={() => {
                soundFx.playClick();
                setInputText(preset.text);
                handleReset();
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Input Text Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text)' }}>
            ✏️ Type Your Own High-Level Code / Messages:
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              handleReset();
            }}
            placeholder="Type print lines or messages here..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.95rem',
              resize: 'vertical',
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Each line will be treated as a program statement.
          </span>
        </div>

        {/* Translator Choice & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text)' }}>
            ⚙️ Choose Translation Method:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`${styles.pickerBtn} ${
                sandboxTranslator === 'compiler' ? styles.pickerBtnCompilerActive : ''
              }`}
              onClick={() => {
                soundFx.playClick();
                setSandboxTranslator('compiler');
                handleReset();
              }}
            >
              📦 Compiler (All at once)
            </button>
            <button
              type="button"
              className={`${styles.pickerBtn} ${
                sandboxTranslator === 'interpreter' ? styles.pickerBtnInterpreterActive : ''
              }`}
              onClick={() => {
                soundFx.playClick();
                setSandboxTranslator('interpreter');
                handleReset();
              }}
            >
              ⚡ Interpreter (Line-by-line)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            {sandboxTranslator === 'compiler' ? (
              <button
                type="button"
                className={styles.primaryActionBtn}
                onClick={handleRunCompiler}
                disabled={isProcessing || activeStep === 2 || lines.length === 0}
              >
                ▶ {isProcessing ? 'Translating Whole Text...' : 'Compile Whole Message'}
              </button>
            ) : (
              <button
                type="button"
                className={styles.primaryActionBtn}
                onClick={handleNextLineInterpreter}
                disabled={activeStep >= lines.length || lines.length === 0}
              >
                ▶ {activeStep === 0 ? 'Interpret Line 1' : activeStep < lines.length ? `Interpret Line ${activeStep + 1}` : 'All Lines Done!'}
              </button>
            )}

            <button
              type="button"
              className={styles.secondaryActionBtn}
              onClick={() => {
                soundFx.playClick();
                handleReset();
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* Live Sandbox Execution Output */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '8px' }}>
        {/* Source breakdown */}
        <div className={styles.codeEditor}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            SOURCE LINES:
          </div>
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isCurrent = sandboxTranslator === 'interpreter' && activeStep === lineNum;
            const isDone = sandboxTranslator === 'compiler' ? activeStep === 2 : activeStep >= lineNum;
            return (
              <div
                key={idx}
                className={`${styles.codeLine} ${
                  isCurrent ? styles.lineActiveCurrent : isDone ? styles.lineDone : styles.lineIdle
                }`}
              >
                <span className={styles.linePointer}>{isCurrent ? '▶' : isDone ? '✓' : ' '}</span>
                <span className={styles.lineNumber}>{lineNum}</span>
                <span className={styles.lineText}>{line}</span>
              </div>
            );
          })}
        </div>

        {/* Machine Output breakdown */}
        <div className={styles.binaryMatrix}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            TRANSLATED MACHINE LANGUAGE (0s & 1s):
          </div>
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isVisible = sandboxTranslator === 'compiler' ? activeStep === 2 : activeStep >= lineNum;
            return (
              <div
                key={idx}
                className={`${styles.binaryRow} ${isVisible ? styles.binaryRowActive : ''}`}
              >
                <div className={styles.binaryLineHeader}>
                  <span>Line {lineNum} Binary Stream</span>
                  <span>{isVisible ? '✓ Translated' : 'Waiting...'}</span>
                </div>
                <div className={styles.binaryString}>
                  {isVisible ? textToBinary(line) : '•••••••• •••••••• ••••••••'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
