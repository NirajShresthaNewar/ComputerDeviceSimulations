import { useState, useEffect, useRef, useCallback } from 'react';
import { soundFx } from './audioEffects';
import {
  REAL_COMPUTER_PRESETS,
  ANALOGY_PRESETS,
  ASSEMBLY_DATA,
} from './translatorData';
import styles from './LanguageTranslatorSim.module.css';

export default function SimulationEngine({ mode }) {
  // Active translator: 'compiler' | 'interpreter' | 'assembler'
  const [translatorType, setTranslatorType] = useState('compiler');
  
  // Selected preset index
  const [presetIndex, setPresetIndex] = useState(0);

  // Simulation execution state
  // step: 0 = idle/initial, 1..N = current line or compiling progress
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.6, 1, 1.6
  
  const timerRef = useRef(null);

  // Pick dataset according to mode & translator
  const isAnalogy = mode === 'analogy';
  
  // Real datasets
  const realPresets = REAL_COMPUTER_PRESETS;
  const currentRealPreset = realPresets[presetIndex] || realPresets[0];

  // Analogy datasets
  const analogyPresets = ANALOGY_PRESETS;
  const currentAnalogyPreset = analogyPresets[presetIndex] || analogyPresets[0];

  const currentLines = isAnalogy ? currentAnalogyPreset.lines : currentRealPreset.lines;
  const totalLines = translatorType === 'assembler' ? ASSEMBLY_DATA.lines.length : currentLines.length;

  // Reset simulation state when translator or mode or preset changes
  const resetSim = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentStep(0);
    setIsCompiling(false);
    setCompileProgress(0);
    setIsRunningAll(false);
  }, []);

  useEffect(() => {
    resetSim();
  }, [mode, translatorType, presetIndex, resetSim]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* ---------------- COMPILER FLOW ---------------- */
  const handleStartCompiler = () => {
    if (isCompiling || currentStep >= 1) return;
    soundFx.playClick();
    setIsCompiling(true);
    setCompileProgress(10);
    setCurrentStep(1); // Stage: Processing whole program

    const intervalTime = Math.max(80, 260 / speed);
    let prog = 10;
    timerRef.current = setInterval(() => {
      prog += 15;
      if (prog >= 100) {
        setCompileProgress(100);
        setIsCompiling(false);
        setCurrentStep(2); // Fully compiled
        soundFx.playCompileDone();
        clearInterval(timerRef.current);
        timerRef.current = null;
      } else {
        setCompileProgress(prog);
      }
    }, intervalTime);
  };

  /* ---------------- INTERPRETER FLOW ---------------- */
  const handleNextLineInterpreter = () => {
    if (currentStep >= totalLines) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    soundFx.playStep();
    if (next === totalLines) {
      soundFx.playCompileDone();
    }
  };

  const handleRunAllInterpreter = () => {
    if (isRunningAll) {
      // Pause
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRunningAll(false);
      return;
    }

    setIsRunningAll(true);
    let step = currentStep >= totalLines ? 0 : currentStep;
    setCurrentStep(step);

    const stepInterval = Math.max(400, 1100 / speed);
    timerRef.current = setInterval(() => {
      step++;
      if (step <= totalLines) {
        setCurrentStep(step);
        soundFx.playStep();
        if (step === totalLines) {
          soundFx.playCompileDone();
          setIsRunningAll(false);
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setIsRunningAll(false);
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, stepInterval);
  };

  /* ---------------- ASSEMBLER FLOW ---------------- */
  const handleStartAssembler = () => {
    if (isCompiling || currentStep >= 1) return;
    soundFx.playClick();
    setIsCompiling(true);
    setCompileProgress(20);
    setCurrentStep(1);

    const intervalTime = Math.max(100, 300 / speed);
    let prog = 20;
    timerRef.current = setInterval(() => {
      prog += 25;
      if (prog >= 100) {
        setCompileProgress(100);
        setIsCompiling(false);
        setCurrentStep(2);
        soundFx.playCompileDone();
        clearInterval(timerRef.current);
        timerRef.current = null;
      } else {
        setCompileProgress(prog);
      }
    }, intervalTime);
  };

  // Helper text for "What happened?" box
  const getExplainerText = () => {
    if (translatorType === 'compiler') {
      if (currentStep === 0) {
        return isAnalogy
          ? 'The full English text is ready. The compiler will read and translate the ENTIRE passage all at once.'
          : 'The entire high-level program is highlighted. A compiler scans the whole code at once before generating machine code.';
      }
      if (isCompiling) {
        return isAnalogy
          ? 'Translating the complete text into Nepali all in one batch...'
          : 'Compiling the entire program into 0s and 1s binary machine language at once...';
      }
      return isAnalogy
        ? '✓ Finished! The entire passage was translated into Nepali before delivering the result.'
        : '✓ Translation complete! The whole program has been converted into machine language (0s and 1s) ready for the computer CPU.';
    }

    if (translatorType === 'interpreter') {
      if (currentStep === 0) {
        return isAnalogy
          ? 'Ready to translate line by line. Click "▶ Next Line" or "⚡ Translate All" to see the interpreter work.'
          : 'Ready! An interpreter takes one line of code at a time, translates it, and executes it immediately.';
      }
      if (currentStep > 0 && currentStep < totalLines) {
        return isAnalogy
          ? `Translating Line ${currentStep} of ${totalLines} and displaying its Nepali translation.`
          : `Line ${currentStep} translated to binary and executed immediately on the screen. Ready for Line ${currentStep + 1}.`;
      }
      return isAnalogy
        ? '✓ All sentences have been translated one by one, sequentially!'
        : '✓ All lines were interpreted and executed one line at a time!';
    }

    if (translatorType === 'assembler') {
      if (currentStep === 0) {
        return 'Assembly language uses short mnemonic codes (like MOV, ADD, SUB). An Assembler converts these into machine code.';
      }
      if (isCompiling) {
        return 'The Assembler is converting assembly instructions into binary 0s and 1s...';
      }
      return '✓ Assembly complete! The Assembler converted assembly mnemonics into machine language for the CPU registers.';
    }

    return '';
  };

  return (
    <div className={styles.simWorkspace}>
      {/* 1. TRANSLATOR PICKER & PRESET BAR */}
      <div className={styles.translatorPicker}>
        <div className={styles.pickerLabel}>
          <span>⚙️ Select Translator:</span>
        </div>

        <div className={styles.pickerButtons}>
          <button
            type="button"
            className={`${styles.pickerBtn} ${
              translatorType === 'compiler' ? styles.pickerBtnCompilerActive : ''
            }`}
            onClick={() => {
              soundFx.playClick();
              setTranslatorType('compiler');
            }}
          >
            <span>📦</span>
            <span>Compiler</span>
          </button>

          <button
            type="button"
            className={`${styles.pickerBtn} ${
              translatorType === 'interpreter' ? styles.pickerBtnInterpreterActive : ''
            }`}
            onClick={() => {
              soundFx.playClick();
              setTranslatorType('interpreter');
            }}
          >
            <span>⚡</span>
            <span>Interpreter</span>
          </button>

          <button
            type="button"
            className={`${styles.pickerBtn} ${
              translatorType === 'assembler' ? styles.pickerBtnAssemblerActive : ''
            }`}
            onClick={() => {
              soundFx.playClick();
              setTranslatorType('assembler');
            }}
          >
            <span>🔩</span>
            <span>Assembler</span>
          </button>
        </div>

        {translatorType !== 'assembler' && (
          <div className={styles.sandboxPresetGroup}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Examples:</span>
            {(isAnalogy ? analogyPresets : realPresets).map((preset, idx) => (
              <button
                key={preset.id}
                type="button"
                className={`${styles.presetBtn} ${
                  presetIndex === idx ? styles.presetBtnActive : ''
                }`}
                onClick={() => {
                  soundFx.playClick();
                  setPresetIndex(idx);
                }}
              >
                {preset.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. 3-STAGE PIPELINE GRID */}
      <div className={styles.pipelineGrid}>
        {/* STAGE 1: SOURCE PROGRAM / ENGLISH (LEFT) */}
        <div className={styles.stageCard}>
          <div className={styles.stageCardHeader}>
            <h3 className={styles.stageCardTitle}>
              {translatorType === 'assembler'
                ? '🔩 Assembly Language'
                : isAnalogy
                ? '🇬🇧 English Passage'
                : '💻 High-Level Language'}
            </h3>
            <span
              className={`${styles.stageTag} ${
                isAnalogy ? styles.stageTagAnalogy : styles.stageTagSource
              }`}
            >
              {translatorType === 'assembler' ? 'Low-Level' : isAnalogy ? 'Analogy' : 'Human-Friendly'}
            </span>
          </div>

          <div className={styles.stageCardBody}>
            {translatorType === 'assembler' ? (
              <div
                className={`${styles.codeEditor} ${
                  currentStep > 0 ? styles.wholeProgramSelected : ''
                }`}
              >
                {ASSEMBLY_DATA.lines.map((item, idx) => (
                  <div key={idx} className={styles.codeLine}>
                    <span className={styles.lineNumber}>{idx + 1}</span>
                    <span className={styles.lineText}>
                      <strong>{item.code}</strong>{' '}
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        ; {item.meaning}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            ) : isAnalogy ? (
              /* Analogy Mode (English Sentences) */
              <div
                className={`${styles.codeEditor} ${
                  translatorType === 'compiler' && currentStep > 0
                    ? styles.wholeProgramSelected
                    : ''
                }`}
              >
                {currentAnalogyPreset.lines.map((item, idx) => {
                  const lineNum = idx + 1;
                  let lineStyle = styles.lineIdle;
                  let pointerIcon = ' ';

                  if (translatorType === 'interpreter') {
                    if (currentStep === lineNum) {
                      lineStyle = styles.lineActiveCurrent;
                      pointerIcon = '▶';
                    } else if (currentStep > lineNum) {
                      lineStyle = styles.lineDone;
                      pointerIcon = '✓';
                    }
                  } else if (translatorType === 'compiler') {
                    if (currentStep >= 1) {
                      lineStyle = styles.lineDone;
                      pointerIcon = '✓';
                    }
                  }

                  return (
                    <div
                      key={idx}
                      className={`${styles.codeLine} ${styles.codeLineAnalogy} ${lineStyle}`}
                    >
                      <span className={styles.linePointer}>{pointerIcon}</span>
                      <span className={styles.lineNumber}>{lineNum}</span>
                      <span className={styles.lineText}>{item.source}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Real Computer Mode (Python-like program) */
              <div
                className={`${styles.codeEditor} ${
                  translatorType === 'compiler' && currentStep > 0
                    ? styles.wholeProgramSelected
                    : ''
                }`}
              >
                {currentRealPreset.lines.map((item, idx) => {
                  const lineNum = idx + 1;
                  let lineStyle = styles.lineIdle;
                  let pointerIcon = ' ';

                  if (translatorType === 'interpreter') {
                    if (currentStep === lineNum) {
                      lineStyle = styles.lineActiveCurrent;
                      pointerIcon = '▶';
                    } else if (currentStep > lineNum) {
                      lineStyle = styles.lineDone;
                      pointerIcon = '✓';
                    }
                  } else if (translatorType === 'compiler') {
                    if (currentStep >= 1) {
                      lineStyle = styles.lineDone;
                      pointerIcon = '✓';
                    }
                  }

                  return (
                    <div key={idx} className={`${styles.codeLine} ${lineStyle}`}>
                      <span className={styles.linePointer}>{pointerIcon}</span>
                      <span className={styles.lineNumber}>{lineNum}</span>
                      <span className={styles.lineText}>{item.code}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.disclaimerBadge}>
              {translatorType === 'compiler'
                ? '📦 Compiler translates the whole block together'
                : translatorType === 'interpreter'
                ? '⚡ Interpreter steps through line-by-line'
                : '🔩 Assembler converts mnemonics directly'}
            </div>
          </div>
        </div>

        {/* STAGE 2: TRANSLATOR ENGINE (CENTER) */}
        <div className={styles.centerEngineColumn}>
          <div className={styles.flowArrowContainer}>
            <span className={isCompiling || isRunningAll ? styles.arrowFlowing : ''}>➔</span>
          </div>

          <div
            className={`${styles.engineBox} ${
              translatorType === 'compiler'
                ? styles.engineBoxActiveCompiler
                : translatorType === 'interpreter'
                ? styles.engineBoxActiveInterpreter
                : styles.engineBoxActiveAssembler
            }`}
          >
            <div
              className={`${styles.engineIconWrapper} ${
                isCompiling || isRunningAll ? styles.engineSpinning : ''
              }`}
            >
              {translatorType === 'compiler'
                ? '📦'
                : translatorType === 'interpreter'
                ? '⚡'
                : '🔩'}
            </div>

            <h4 className={styles.engineName}>
              {translatorType === 'compiler'
                ? 'COMPILER'
                : translatorType === 'interpreter'
                ? 'INTERPRETER'
                : 'ASSEMBLER'}
            </h4>

            <span className={styles.engineModeBadge}>
              {translatorType === 'compiler'
                ? 'Translates Whole Program'
                : translatorType === 'interpreter'
                ? 'Translates 1 Line at a Time'
                : 'Translates Assembly'}
            </span>

            {/* Progress bar during compiling */}
            {(isCompiling || translatorType === 'compiler') && (
              <div className={styles.engineProgressBar}>
                <div
                  className={styles.engineProgressFill}
                  style={{
                    width:
                      currentStep === 2
                        ? '100%'
                        : isCompiling
                        ? `${compileProgress}%`
                        : '0%',
                  }}
                />
              </div>
            )}
          </div>

          <div className={styles.flowArrowContainer}>
            <span className={isCompiling || isRunningAll ? styles.arrowFlowing : ''}>➔</span>
          </div>
        </div>

        {/* STAGE 3: MACHINE LANGUAGE / NEPALI OUTPUT (RIGHT) */}
        <div className={styles.stageCard}>
          <div className={styles.stageCardHeader}>
            <h3 className={styles.stageCardTitle}>
              {isAnalogy ? '🇳🇵 Nepali Translation' : '🤖 Machine Language (Binary)'}
            </h3>
            <span
              className={`${styles.stageTag} ${
                isAnalogy ? styles.stageTagAnalogy : styles.stageTagMachine
              }`}
            >
              {isAnalogy ? 'Analogy Result' : '0s & 1s'}
            </span>
          </div>

          <div className={styles.stageCardBody}>
            {translatorType === 'assembler' ? (
              <div className={styles.outputContainer}>
                <div className={styles.binaryMatrix}>
                  {ASSEMBLY_DATA.lines.map((item, idx) => {
                    const isVisible = currentStep >= 2;
                    return (
                      <div
                        key={idx}
                        className={`${styles.binaryRow} ${
                          isVisible ? styles.binaryRowActive : ''
                        }`}
                      >
                        <div className={styles.binaryLineHeader}>
                          <span>Instruction {idx + 1}</span>
                          <span>{item.code}</span>
                        </div>
                        <div className={styles.binaryString}>
                          {isVisible ? item.binary : '•••••••• ••••••••'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {currentStep >= 2 && (
                  <div className={styles.screenExecutionCard}>
                    <div className={styles.screenHeader}>
                      <span>CPU REGISTER STATE</span>
                      <span>STATUS: OK</span>
                    </div>
                    <div>Register A Final Value = 2</div>
                  </div>
                )}
              </div>
            ) : isAnalogy ? (
              /* Analogy Mode Results (Nepali) */
              <div className={styles.outputContainer}>
                <div className={styles.nepaliSpeechList}>
                  {currentAnalogyPreset.lines.map((item, idx) => {
                    const lineNum = idx + 1;
                    const isVisible =
                      translatorType === 'compiler'
                        ? currentStep === 2
                        : currentStep >= lineNum;

                    return (
                      <div
                        key={idx}
                        className={`${styles.nepaliSpeechBubble} ${
                          isVisible ? styles.nepaliBubbleActive : ''
                        }`}
                      >
                        <span style={{ fontSize: '1.2rem' }}>💬</span>
                        <div style={{ flex: 1 }}>
                          {isVisible ? (
                            <>
                              <strong>{item.translated}</strong>
                              <div
                                style={{
                                  fontSize: '0.8rem',
                                  color: 'var(--color-text-muted)',
                                  marginTop: '2px',
                                }}
                              >
                                {item.source}
                              </div>
                            </>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                              [Waiting for translation...]
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Real Computer Mode (Binary + Screen) */
              <div className={styles.outputContainer}>
                <div className={styles.binaryMatrix}>
                  {currentRealPreset.lines.map((item, idx) => {
                    const lineNum = idx + 1;
                    const isVisible =
                      translatorType === 'compiler'
                        ? currentStep === 2
                        : currentStep >= lineNum;

                    return (
                      <div
                        key={idx}
                        className={`${styles.binaryRow} ${
                          isVisible ? styles.binaryRowActive : ''
                        }`}
                      >
                        <div className={styles.binaryLineHeader}>
                          <span>{item.label} (Machine Code)</span>
                          <span>{isVisible ? '✓ Ready' : 'Pending'}</span>
                        </div>
                        <div className={styles.binaryString}>
                          {isVisible ? item.binary : '•••••••• •••••••• ••••••••'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Computer Screen Output */}
                <div className={styles.screenExecutionCard}>
                  <div className={styles.screenHeader}>
                    <span>🖥️ COMPUTER OUTPUT SCREEN</span>
                    <span>TERMINAL</span>
                  </div>
                  {currentRealPreset.lines.map((item, idx) => {
                    const lineNum = idx + 1;
                    const isVisible =
                      translatorType === 'compiler'
                        ? currentStep === 2
                        : currentStep >= lineNum;

                    if (!isVisible) return null;
                    return (
                      <div key={idx} className={styles.screenOutputLine}>
                        <span>&gt;</span>
                        <span>{item.screenOutput}</span>
                      </div>
                    );
                  })}
                  {currentStep === 0 && (
                    <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                      Ready to execute...
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.disclaimerBadge}>
              {isAnalogy
                ? '💡 English → Nepali is an analogy to help understand.'
                : '⚡ Simplified machine-code representation'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SMARTBOARD-FRIENDLY CONTROLS & ACTION BAR */}
      <div className={styles.controlBar}>
        <div className={styles.actionButtons}>
          {translatorType === 'compiler' && (
            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={handleStartCompiler}
              disabled={isCompiling || currentStep === 2}
            >
              <span>▶</span>
              <span>
                {isCompiling
                  ? 'Compiling...'
                  : isAnalogy
                  ? 'Translate Whole Text'
                  : 'Start Compilation'}
              </span>
            </button>
          )}

          {translatorType === 'interpreter' && (
            <>
              <button
                type="button"
                className={styles.primaryActionBtn}
                onClick={handleNextLineInterpreter}
                disabled={currentStep >= totalLines || isRunningAll}
              >
                <span>▶</span>
                <span>
                  {currentStep === 0
                    ? 'Start Line 1'
                    : currentStep < totalLines
                    ? isAnalogy
                      ? 'Translate Next Line'
                      : 'Run Next Line'
                    : 'Done!'}
                </span>
              </button>

              <button
                type="button"
                className={styles.secondaryActionBtn}
                onClick={handleRunAllInterpreter}
                disabled={currentStep >= totalLines && !isRunningAll}
              >
                <span>{isRunningAll ? '⏸' : '⚡'}</span>
                <span>{isRunningAll ? 'Pause' : isAnalogy ? 'Translate All' : 'Run All'}</span>
              </button>
            </>
          )}

          {translatorType === 'assembler' && (
            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={handleStartAssembler}
              disabled={isCompiling || currentStep === 2}
            >
              <span>▶</span>
              <span>{isCompiling ? 'Assembling...' : 'Assemble to Machine Code'}</span>
            </button>
          )}

          <button
            type="button"
            className={styles.secondaryActionBtn}
            onClick={() => {
              soundFx.playClick();
              resetSim();
            }}
          >
            <span>🔄</span>
            <span>Reset</span>
          </button>
        </div>

        {/* Status Indicators & Speed selector */}
        <div className={styles.statusIndicator}>
          <div className={styles.stepCounterBadge}>
            {translatorType === 'compiler'
              ? currentStep === 2
                ? 'Status: Whole Program Compiled (100%)'
                : isCompiling
                ? `Compiling... ${compileProgress}%`
                : 'Status: Ready'
              : translatorType === 'interpreter'
              ? `Step ${currentStep} of ${totalLines}`
              : currentStep === 2
              ? 'Status: Assembled to Binary'
              : isCompiling
              ? 'Assembling...'
              : 'Status: Ready'}
          </div>

          <div className={styles.speedSelector}>
            <span>Speed:</span>
            <select
              className={styles.speedSelect}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value={0.6}>Slow (Classroom)</option>
              <option value={1}>Normal</option>
              <option value={1.6}>Fast</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. DYNAMIC "WHAT HAPPENED?" EXPLAINER CARD */}
      <div className={styles.explainerCard}>
        <div className={styles.explainerIcon}>
          {currentStep === 0 ? '💡' : isCompiling || isRunningAll ? '⏳' : '🎯'}
        </div>
        <div>
          <div className={styles.explainerTextTitle}>
            {translatorType.toUpperCase()} — WHAT IS HAPPENING?
          </div>
          <p className={styles.explainerTextBody}>{getExplainerText()}</p>
        </div>
      </div>
    </div>
  );
}
