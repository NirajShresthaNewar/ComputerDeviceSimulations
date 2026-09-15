import styles from './LanguageTranslatorSim.module.css';

export default function TranslatorOverviewDiagram() {
  return (
    <div className={styles.overviewFlow}>
      {/* 1. LARGE VISUAL FLOW DIAGRAM */}
      <div className={styles.mainFlowDiagram}>
        <h3 className={styles.flowDiagramTitle}>
          🌐 How Computer Language Translation Works
        </h3>

        <div className={styles.flowRow}>
          {/* Step 1: Human-Friendly Language */}
          <div className={styles.flowNodeCard}>
            <div className={styles.flowNodeIcon}>👩‍💻</div>
            <h4 className={styles.flowNodeName}>Human-Friendly Language</h4>
            <p className={styles.flowNodeDesc}>
              High-level code (like Python) or Assembly that humans write easily.
            </p>
          </div>

          <div className={styles.flowConnector}>➔</div>

          {/* Step 2: Language Translator */}
          <div
            className={styles.flowNodeCard}
            style={{ borderColor: 'var(--color-accent)', background: 'rgba(61, 220, 151, 0.06)' }}
          >
            <div className={styles.flowNodeIcon}>⚙️</div>
            <h4 className={styles.flowNodeName}>Language Translator</h4>
            <p className={styles.flowNodeDesc}>
              Compiler, Interpreter, or Assembler converts the code into binary.
            </p>
          </div>

          <div className={styles.flowConnector}>➔</div>

          {/* Step 3: Machine Language */}
          <div className={styles.flowNodeCard}>
            <div className={styles.flowNodeIcon}>🔢</div>
            <h4 className={styles.flowNodeName}>Machine Language</h4>
            <p className={styles.flowNodeDesc}>
              Binary 0s and 1s that electronic circuits can understand.
            </p>
          </div>

          <div className={styles.flowConnector}>➔</div>

          {/* Step 4: Computer CPU */}
          <div className={styles.flowNodeCard}>
            <div className={styles.flowNodeIcon}>🖥️</div>
            <h4 className={styles.flowNodeName}>Computer CPU</h4>
            <p className={styles.flowNodeDesc}>
              Executes the instructions and displays results on screen.
            </p>
          </div>
        </div>
      </div>

      {/* 2. THREE KEY TRANSLATOR CARDS */}
      <div className={styles.translatorsTriGrid}>
        {/* Compiler */}
        <div className={styles.translatorCard}>
          <div className={styles.translatorCardHeader}>
            <div className={`${styles.translatorCardIcon} ${styles.iconCompiler}`}>📦</div>
            <div>
              <h4 className={styles.translatorCardName}>Compiler</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Batch Translator
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: 0 }}>
            A compiler translates the <strong>entire program at once</strong> before creating the executable file.
          </p>
          <div className={styles.translatorKeyMessage}>
            💡 Key: Translates the WHOLE program before running.
          </div>
        </div>

        {/* Interpreter */}
        <div className={styles.translatorCard}>
          <div className={styles.translatorCardHeader}>
            <div className={`${styles.translatorCardIcon} ${styles.iconInterpreter}`}>⚡</div>
            <div>
              <h4 className={styles.translatorCardName}>Interpreter</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Line-by-Line Translator
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: 0 }}>
            An interpreter translates and runs <strong>one line at a time</strong>, moving to the next line only after executing the current one.
          </p>
          <div className={styles.translatorKeyMessage}>
            💡 Key: Translates and executes ONE LINE at a time.
          </div>
        </div>

        {/* Assembler */}
        <div className={styles.translatorCard}>
          <div className={styles.translatorCardHeader}>
            <div className={`${styles.translatorCardIcon} ${styles.iconAssembler}`}>🔩</div>
            <div>
              <h4 className={styles.translatorCardName}>Assembler</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Mnemonic Converter
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: 0 }}>
            An assembler converts <strong>Assembly Language mnemonics</strong> (like MOV, ADD, SUB) into machine language.
          </p>
          <div className={styles.translatorKeyMessage}>
            💡 Key: Converts Assembly Language into Machine Language.
          </div>
        </div>
      </div>

      {/* 3. STUDENT-FRIENDLY COMPARISON TABLE */}
      <div className={styles.comparisonTableWrapper}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1.05rem', color: 'var(--color-text)' }}>
          📊 Quick Comparison for Class 5
        </h4>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>📦 Compiler</th>
              <th>⚡ Interpreter</th>
              <th>🔩 Assembler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Input Code</strong></td>
              <td>High-Level Program (e.g. Python, C)</td>
              <td>High-Level Program (e.g. Python, JS)</td>
              <td>Assembly Language (Mnemonics)</td>
            </tr>
            <tr>
              <td><strong>How It Translates</strong></td>
              <td>Translates <strong>whole program</strong> at once</td>
              <td>Translates <strong>one line</strong> at a time</td>
              <td>Converts assembly codes to binary</td>
            </tr>
            <tr>
              <td><strong>Execution</strong></td>
              <td>Runs after entire translation completes</td>
              <td>Runs line-by-line immediately</td>
              <td>Runs generated machine code</td>
            </tr>
            <tr>
              <td><strong>Easy Real-World Analogy</strong></td>
              <td>Translating a whole book before reading</td>
              <td>A live translator speaking line by line</td>
              <td>Translating secret code abbreviations</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. IMPORTANT DON'T CONFUSE THIS NOTICE */}
      <div className={`${styles.noticeBox} ${styles.noticeBoxReal}`}>
        <span className={styles.noticeIcon}>💡</span>
        <div className={styles.noticeText}>
          <strong>Remember (Important Distinction):</strong>
          <br />
          Our <em>English → Nepali</em> mode is only an analogy to help our brains picture translation. In a real computer, high-level code is converted into <strong>Machine Language (0s and 1s)</strong>, not a human spoken language.
        </div>
      </div>
    </div>
  );
}
