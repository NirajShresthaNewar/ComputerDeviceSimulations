import { useState } from 'react';
import { DETECTIVE_SCENARIOS } from './cyberLabData';
import LoveBugVirusSim from './LoveBugVirusSim';
import styles from './CyberVirusLabSim.module.css';

export default function CyberVirusLabSim() {
  const [activeTab, setActiveTab] = useState('love-bug'); // 'love-bug' | 'boot-sector' | 'file-infector' | 'system-infector' | 'message-carrier' | 'detective'
  const [isAntivirusActive, setIsAntivirusActive] = useState(false);

  // 1. BOOT SECTOR STATE
  const [usbInserted, setUsbInserted] = useState(false);
  const [bootState, setBootState] = useState('idle'); // 'idle' | 'booting' | 'failed' | 'success'
  const [bootLog, setBootLog] = useState([]);
  const [bootProgress, setBootProgress] = useState(0);

  // 2. FILE INFECTOR STATE
  const [files, setFiles] = useState([
    { id: 'f1', name: 'homework.exe', size: '120 KB', status: 'healthy', icon: '📄' },
    { id: 'f2', name: 'calculator.exe', size: '85 KB', status: 'healthy', icon: '🔢' },
    { id: 'f3', name: 'game.exe', size: '4,500 KB', status: 'healthy', icon: '🎮', isInfectedSource: true },
    { id: 'f4', name: 'paint.exe', size: '340 KB', status: 'healthy', icon: '🎨' },
    { id: 'f5', name: 'editor.exe', size: '210 KB', status: 'healthy', icon: '📝' },
  ]);
  const [selectedDnaFile, setSelectedDnaFile] = useState(null);
  const [isScanningFiles, setIsScanningFiles] = useState(false);

  // 3. SYSTEM INFECTOR STATE
  const [osComponents, setOsComponents] = useState([
    { id: 'kernel', name: 'Kernel & Core OS', icon: '⚙️', status: 'healthy', detail: 'Runs supervisor CPU instructions' },
    { id: 'processes', name: 'Task & Process Manager', icon: '🔄', status: 'healthy', detail: 'Monitors running threads and memory limits' },
    { id: 'filesystem', name: 'System Root Files (C:\\System32)', icon: '📁', status: 'healthy', detail: 'Holds protected Windows DLLs' },
    { id: 'network', name: 'Network Socket Service', icon: '🌐', status: 'healthy', detail: 'Handles inbound and outbound ports' },
  ]);
  const [activeOsComp, setActiveOsComp] = useState(null);

  // 4. MESSAGE CARRIER (WORM) STATE
  const [chatAction, setChatAction] = useState('idle'); // 'idle' | 'opened' | 'scanned' | 'deleted'
  const [networkInfectedCount, setNetworkInfectedCount] = useState(0);

  // 5. DETECTIVE GAME STATE
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [detectiveScore, setDetectiveScore] = useState(0);

  // Global Reset
  const handleGlobalReset = () => {
    setUsbInserted(false);
    setBootState('idle');
    setBootLog([]);
    setBootProgress(0);

    setFiles([
      { id: 'f1', name: 'homework.exe', size: '120 KB', status: 'healthy', icon: '📄' },
      { id: 'f2', name: 'calculator.exe', size: '85 KB', status: 'healthy', icon: '🔢' },
      { id: 'f3', name: 'game.exe', size: '4,500 KB', status: 'healthy', icon: '🎮', isInfectedSource: true },
      { id: 'f4', name: 'paint.exe', size: '340 KB', status: 'healthy', icon: '🎨' },
      { id: 'f5', name: 'editor.exe', size: '210 KB', status: 'healthy', icon: '📝' },
    ]);
    setSelectedDnaFile(null);
    setIsScanningFiles(false);

    setOsComponents([
      { id: 'kernel', name: 'Kernel & Core OS', icon: '⚙️', status: 'healthy', detail: 'Runs supervisor CPU instructions' },
      { id: 'processes', name: 'Task & Process Manager', icon: '🔄', status: 'healthy', detail: 'Monitors running threads and memory limits' },
      { id: 'filesystem', name: 'System Root Files (C:\\System32)', icon: '📁', status: 'healthy', detail: 'Holds protected Windows DLLs' },
      { id: 'network', name: 'Network Socket Service', icon: '🌐', status: 'healthy', detail: 'Handles inbound and outbound ports' },
    ]);
    setActiveOsComp(null);

    setChatAction('idle');
    setNetworkInfectedCount(0);
  };

  // 1. BOOT SEQUENCE SIMULATION
  const runBootSequence = () => {
    setBootState('booting');
    setBootLog(['[BIOS] Power-On Self Test (POST) Completed... OK']);
    setBootProgress(20);

    setTimeout(() => {
      setBootLog((prev) => [...prev, '[UEFI] Locating Primary Boot Sector on Drive 0...']);
      setBootProgress(50);

      setTimeout(() => {
        if (usbInserted) {
          if (!isAntivirusActive) {
            setBootLog((prev) => [
              ...prev,
              '[SECTOR 0] ⚠️ Unknown execution hook detected!',
              '[MALWARE] 🦠 BOOT SECTOR VIRUS (Michelangelo) EXECUTES!',
              '[FATAL] Hard drive partition table overwritten. OS load aborted.',
            ]);
            setBootProgress(75);
            setBootState('failed');
          } else {
            setBootLog((prev) => [
              ...prev,
              '[ANTIVIRUS] 🛡️ Pre-Boot Scanner inspecting Master Boot Record...',
              '[ANTIVIRUS] ⚠️ Threat "Boot.Michelangelo" intercepted on USB!',
              '[ANTIVIRUS] 🧹 Blocked malicious payload. Neutralized Sector 0.',
              '[OS KERNEL] Loading Windows Desktop safely... 🟢',
            ]);
            setBootProgress(100);
            setBootState('success');
          }
        } else {
          setBootLog((prev) => [
            ...prev,
            '[SECTOR 0] Clean MBR verified.',
            '[OS KERNEL] Loading System Core & Graphical Desktop... 🟢',
          ]);
          setBootProgress(100);
          setBootState('success');
        }
      }, 1200);
    }, 800);
  };

  // 2. FILE INFECTOR SIMULATION
  const handleTriggerInfection = () => {
    if (isAntivirusActive) {
      alert('🛡️ Antivirus Real-Time Shield prevented game.exe from modifying other files!');
      return;
    }
    setFiles((prev) =>
      prev.map((f) => ({
        ...f,
        status: 'infected',
        size: f.size.includes('KB') ? `${parseInt(f.size) + 45} KB (+45KB Virus)` : f.size,
      }))
    );
  };

  const handleDeepScanFiles = () => {
    setIsScanningFiles(true);
    setTimeout(() => {
      setIsScanningFiles(false);
      alert('🔍 Deep Scan Completed: Malicious code signatures located in 4 files.');
    }, 1800);
  };

  const handleCleanFiles = () => {
    setFiles((prev) =>
      prev.map((f) => ({
        ...f,
        status: 'healthy',
        size: f.size.replace(' (+45KB Virus)', ''),
      }))
    );
    setSelectedDnaFile(null);
  };

  const handleQuarantine = () => {
    setFiles((prev) =>
      prev.map((f) => (f.status === 'infected' ? { ...f, status: 'quarantined' } : f))
    );
  };

  // 3. SYSTEM INFECTOR SIMULATION
  const handleAttackOs = () => {
    if (isAntivirusActive) {
      alert('🛡️ Real-Time Kernel Shield intercepted unauthorized System32 injection!');
      return;
    }
    setOsComponents((prev) =>
      prev.map((comp) => ({
        ...comp,
        status: 'infected',
      }))
    );
  };

  // 4. CHAT ATTACHMENT SIMULATION
  const handleOpenAttachment = () => {
    if (isAntivirusActive) {
      setChatAction('scanned');
      alert('🛡️ Antivirus Scanner caught Free_Game.exe before execution! Blocked.');
      return;
    }
    setChatAction('opened');
    setNetworkInfectedCount(8);
  };

  const handleScanAttachment = () => {
    setChatAction('scanned');
    setNetworkInfectedCount(0);
  };

  const handleDeleteAttachment = () => {
    setChatAction('deleted');
    setNetworkInfectedCount(0);
  };

  // 5. DETECTIVE SCENARIOS
  const handleOptionSelect = (caseId, option) => {
    setUserAnswers((prev) => ({
      ...prev,
      [caseId]: option,
    }));
    if (option.isCorrect) {
      setDetectiveScore((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.labContainer}>
      {/* MASTER HUD BANNER */}
      <header className={styles.hudHeader}>
        <div className={styles.hudTitleGroup}>
          <div className={styles.hudIcon}>🛡️</div>
          <div>
            <h1 className={styles.hudTitle}>Interactive Cyber Virus & Malware Lab</h1>
            <p className={styles.hudSubtitle}>
              Realistic Virtual OS Simulations: See How Viruses Attack, Destroy Files, and Propagate
            </p>
          </div>
        </div>

        <div className={styles.hudStatusGroup}>
          <div
            className={`${styles.statusPill} ${
              isAntivirusActive ? styles.statusSafe : styles.statusDanger
            }`}
          >
            <span>{isAntivirusActive ? '🛡️ Protection: ACTIVE' : '⚠️ Protection: DISABLED'}</span>
          </div>

          <button
            className={`${styles.shieldToggleBtn} ${
              isAntivirusActive ? styles.shieldOn : styles.shieldOff
            }`}
            onClick={() => setIsAntivirusActive(!isAntivirusActive)}
          >
            {isAntivirusActive ? '🛡️ Antivirus: ON' : '🔴 Antivirus: OFF (Attack Mode)'}
          </button>

          <button className={styles.resetBtn} onClick={handleGlobalReset}>
            🔄 Reset Lab
          </button>
        </div>
      </header>

      {/* LAB NAVIGATION TABS */}
      <nav className={styles.labNavTabs}>
        <button
          className={`${styles.labNavBtn} ${activeTab === 'love-bug' ? styles.labNavBtnActive : ''}`}
          onClick={() => setActiveTab('love-bug')}
          style={{ borderLeft: '3px solid #FF6B4A' }}
        >
          <span>💌 ILOVEYOU (Love Bug) OS Simulation</span>
        </button>

        <button
          className={`${styles.labNavBtn} ${activeTab === 'boot-sector' ? styles.labNavBtnActive : ''}`}
          onClick={() => setActiveTab('boot-sector')}
        >
          <span>🥾 Boot Sector Lab</span>
        </button>

        <button
          className={`${styles.labNavBtn} ${activeTab === 'file-infector' ? styles.labNavBtnActive : ''}`}
          onClick={() => setActiveTab('file-infector')}
        >
          <span>📄 File Infector Lab</span>
        </button>

        <button
          className={`${styles.labNavBtn} ${activeTab === 'system-infector' ? styles.labNavBtnActive : ''}`}
          onClick={() => setActiveTab('system-infector')}
        >
          <span>⚙️ OS System Infector</span>
        </button>

        <button
          className={`${styles.labNavBtn} ${activeTab === 'message-carrier' ? styles.labNavBtnActive : ''}`}
          onClick={() => setActiveTab('message-carrier')}
        >
          <span>✉️ Message / Network Worm</span>
        </button>

        <button
          className={`${styles.labNavBtn} ${activeTab === 'detective' ? styles.labNavBtnActive : ''}`}
          onClick={() => setActiveTab('detective')}
        >
          <span>🕵️ Virus Detective Challenge</span>
        </button>
      </nav>

      {/* ============================================================ */}
      {/* FEATURED: REALISTIC ILOVEYOU (LOVE BUG) OS SIMULATION */}
      {/* ============================================================ */}
      {activeTab === 'love-bug' && <LoveBugVirusSim />}

      {/* ============================================================ */}
      {/* 1. BOOT SECTOR SIMULATION */}
      {/* ============================================================ */}
      {activeTab === 'boot-sector' && (
        <section className={styles.bootStageContainer}>
          <div>
            <h2 style={{ fontSize: '18px', color: 'var(--color-accent)', marginBottom: '4px' }}>
              🥾 Boot Sector Attack Simulation ("Attack the Startup")
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
              A boot sector virus targets the <strong>Master Boot Record (Sector 0)</strong> so it runs before the operating system boots.
            </p>
          </div>

          <div className={styles.bootDiagram}>
            <div className={`${styles.bootNode} ${bootProgress >= 20 ? styles.bootNodeActive : ''}`}>
              <span>⚡</span>
              <span>1. Power On</span>
            </div>
            <span className={styles.bootArrow}>➔</span>

            <div className={`${styles.bootNode} ${bootProgress >= 50 ? styles.bootNodeActive : ''}`}>
              <span>🖥️</span>
              <span>2. BIOS / UEFI</span>
            </div>
            <span className={styles.bootArrow}>➔</span>

            <div
              className={`${styles.bootNode} ${
                bootProgress >= 70
                  ? usbInserted && !isAntivirusActive
                    ? styles.bootNodeInfected
                    : styles.bootNodeActive
                  : ''
              }`}
            >
              <span>💾</span>
              <span>3. Boot Sector (MBR)</span>
              {usbInserted && (
                <span style={{ fontSize: '10px', color: '#FF6B4A', fontWeight: 'bold' }}>
                  🦠 USB Attached
                </span>
              )}
            </div>
            <span className={styles.bootArrow}>➔</span>

            <div
              className={`${styles.bootNode} ${
                bootState === 'success'
                  ? styles.bootNodeActive
                  : bootState === 'failed'
                  ? styles.bootNodeInfected
                  : ''
              }`}
            >
              <span>{bootState === 'failed' ? '❌' : '💻'}</span>
              <span>4. OS Desktop</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className={styles.resetBtn}
              style={{
                background: usbInserted ? 'rgba(255, 107, 74, 0.2)' : 'var(--color-surface-raised)',
                borderColor: usbInserted ? 'var(--color-accent-warm)' : 'var(--color-border)',
                color: usbInserted ? 'var(--color-accent-warm)' : 'var(--color-text)',
              }}
              onClick={() => setUsbInserted(!usbInserted)}
            >
              <span>{usbInserted ? '💾 Eject Infected USB' : '💾 Insert Infected USB (Michelangelo Virus)'}</span>
            </button>

            <button
              className={styles.resetBtn}
              style={{ background: 'var(--color-accent)', color: '#000', fontWeight: 'bold' }}
              onClick={runBootSequence}
            >
              ▶ Power On / Reboot PC
            </button>
          </div>

          <div className={`${styles.virtualMonitor} ${bootState === 'failed' ? styles.screenInfected : ''}`}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '6px' }}>
                <span>VIRTUAL MACHINE DISPLAY [DRIVE 0]</span>
                <span>STATUS: {bootState.toUpperCase()}</span>
              </div>

              <div className={styles.bootProgressBar}>
                <div
                  className={`${styles.bootProgressFill} ${
                    bootState === 'failed' ? styles.bootProgressInfected : ''
                  }`}
                  style={{ width: `${bootProgress}%` }}
                />
              </div>

              <div style={{ marginTop: '12px' }}>
                {bootLog.map((log, lIdx) => (
                  <div key={lIdx} className={styles.screenTextRow}>
                    {log}
                  </div>
                ))}
                {bootState === 'idle' && <div>Press "Power On / Reboot PC" to start boot sequence.</div>}
              </div>
            </div>

            {bootState === 'failed' && (
              <div style={{ background: 'rgba(255, 107, 74, 0.2)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                💥 SYSTEM HALTED: Boot Sector Infected! Enable Antivirus to clean boot.
              </div>
            )}

            {bootState === 'success' && (
              <div style={{ background: 'rgba(61, 220, 151, 0.2)', padding: '10px', borderRadius: '4px', textAlign: 'center', color: '#3DDC97' }}>
                🎉 DESKTOP LOADED: OS Booted successfully!
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 2. FILE INFECTOR SIMULATION */}
      {/* ============================================================ */}
      {activeTab === 'file-infector' && (
        <section className={styles.bootStageContainer}>
          <div>
            <h2 style={{ fontSize: '18px', color: 'var(--color-accent)', marginBottom: '4px' }}>
              📄 File Infector Lab ("Virus Spreads Through Files")
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
              File infectors append parasitic malicious code onto healthy executable files (<code>.exe</code>).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className={styles.resetBtn}
              style={{ background: 'rgba(255, 107, 74, 0.15)', color: 'var(--color-accent-warm)', borderColor: 'var(--color-accent-warm)' }}
              onClick={handleTriggerInfection}
            >
              🎮 Run Infected game.exe
            </button>

            <button className={styles.resetBtn} onClick={handleDeepScanFiles}>
              🔍 Deep Scan C:\ Drive
            </button>

            <button className={styles.resetBtn} onClick={handleCleanFiles}>
              🧹 Clean & Disinfect Files
            </button>

            <button className={styles.resetBtn} onClick={handleQuarantine}>
              📦 Quarantine Infected Files
            </button>
          </div>

          <div className={`${styles.fileDriveContainer} ${isScanningFiles ? styles.scanBeamActive : ''}`}>
            {files.map((file) => (
              <div
                key={file.id}
                className={`${styles.fileCard} ${
                  file.status === 'healthy'
                    ? styles.fileHealthy
                    : file.status === 'infected'
                    ? styles.fileInfected
                    : styles.fileQuarantined
                }`}
                onClick={() => setSelectedDnaFile(file)}
              >
                <span className={styles.fileIcon}>{file.status === 'infected' ? '🦠' : file.icon}</span>
                <span className={styles.fileName}>{file.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{file.size}</span>
                <span
                  className={styles.fileStatusBadge}
                  style={{
                    background:
                      file.status === 'healthy'
                        ? 'rgba(61,220,151,0.15)'
                        : file.status === 'infected'
                        ? 'rgba(255,107,74,0.2)'
                        : 'rgba(139,92,246,0.2)',
                    color:
                      file.status === 'healthy'
                        ? 'var(--color-accent)'
                        : file.status === 'infected'
                        ? 'var(--color-accent-warm)'
                        : '#c084fc',
                  }}
                >
                  {file.status}
                </span>
              </div>
            ))}
          </div>

          {selectedDnaFile && (
            <div className={styles.dnaInspectorBox}>
              <h3 style={{ fontSize: '15px', color: 'var(--color-accent)' }}>
                🔬 Virus DNA X-Ray Inspector: <code>{selectedDnaFile.name}</code>
              </h3>
              <div className={styles.codeBlock}>
                <div>// HEALTHY ORIGINAL PROGRAM HEADER</div>
                <div>0x00400000: 4D 5A 90 00 03 00 00 00 (PE_HEADER)</div>
                <div>0x00400010: [Valid Program Logic: UI Engine & Sound Buffer]</div>
                {selectedDnaFile.status === 'infected' ? (
                  <div style={{ marginTop: '8px' }}>
                    <div className={styles.maliciousPayload}>
                      + INJECTED MALICIOUS CODE (45 KB Payload appended)
                    </div>
                    <div style={{ color: '#FF6B4A', marginTop: '4px' }}>
                      0x0040A500: 🦠 JMP_VIRUS_SPREAD (Replicates to next active .exe in C:\)
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#3DDC97', marginTop: '6px' }}>
                    ✓ Clean signature. No parasitic code detected.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* 3. SYSTEM INFECTOR / OS CORE SIMULATION */}
      {/* ============================================================ */}
      {activeTab === 'system-infector' && (
        <section className={styles.osCoreDiagram}>
          <div>
            <h2 style={{ fontSize: '18px', color: 'var(--color-accent)', marginBottom: '4px' }}>
              ⚙️ System / Kernel Infector ("Attack the OS Core")
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
              System viruses attack the Operating System Kernel, RAM, and protected background processes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={styles.resetBtn}
              style={{ background: 'rgba(255, 107, 74, 0.2)', color: 'var(--color-accent-warm)', borderColor: 'var(--color-accent-warm)' }}
              onClick={handleAttackOs}
            >
              🦠 Inject Kernel Trojan / Rootkit
            </button>
          </div>

          <div className={styles.osSystemMap}>
            {osComponents.map((comp) => (
              <div
                key={comp.id}
                className={`${styles.osComponentCard} ${
                  comp.status === 'infected' ? styles.osCompInfected : ''
                }`}
                onClick={() => setActiveOsComp(comp)}
              >
                <div className={styles.osCompHeader}>
                  <div className={styles.osCompName}>
                    <span>{comp.icon}</span>
                    <span>{comp.name}</span>
                  </div>
                  <span
                    className={styles.osCompStatus}
                    style={{
                      background: comp.status === 'healthy' ? 'rgba(61,220,151,0.2)' : 'rgba(255,107,74,0.2)',
                      color: comp.status === 'healthy' ? 'var(--color-accent)' : 'var(--color-accent-warm)',
                    }}
                  >
                    {comp.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{comp.detail}</p>
              </div>
            ))}
          </div>

          {activeOsComp && (
            <div className={styles.dnaInspectorBox}>
              <h3 style={{ fontSize: '14px', color: 'var(--color-accent)' }}>
                🔍 Inspecting {activeOsComp.name}
              </h3>
              <p style={{ fontSize: '13px' }}>
                {activeOsComp.status === 'infected'
                  ? `⚠️ Critical: Unauthorized hook detected in ${activeOsComp.name}. Rogue process is consuming background resources and hijacking supervisor calls.`
                  : `🟢 Normal: ${activeOsComp.name} is running securely with zero unauthorized system modifications.`}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. MESSAGE / NETWORK CARRIER SIMULATION */}
      {/* ============================================================ */}
      {activeTab === 'message-carrier' && (
        <section className={styles.chatLabWrapper}>
          <div className={styles.chatAppBox}>
            <div className={styles.chatHeader}>
              <span>💬 School Chat • Direct Message</span>
              <span style={{ fontSize: '11px', color: '#3DDC97' }}>● Online</span>
            </div>

            <div className={styles.chatMessageBubble}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                👤 Rahul (Classmate)
              </div>
              <div style={{ fontSize: '13.5px' }}>
                "Hey! Look at this awesome Minecraft Mod I found! Everyone is downloading it:"
              </div>

              <div className={styles.chatAttachmentCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📎</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text)' }}>
                      Free_Minecraft_Mod.exe
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Executable Attachment • 3.2 MB
                    </div>
                  </div>
                </div>
              </div>

              {chatAction === 'idle' && (
                <div className={styles.chatChoiceBtns}>
                  <button className={styles.choiceBtn} style={{ background: 'rgba(255, 107, 74, 0.2)', color: 'var(--color-accent-warm)' }} onClick={handleOpenAttachment}>
                    🚀 OPEN
                  </button>
                  <button className={styles.choiceBtn} style={{ background: 'rgba(61, 220, 151, 0.2)', color: 'var(--color-accent)' }} onClick={handleScanAttachment}>
                    🛡️ SCAN FIRST
                  </button>
                  <button className={styles.choiceBtn} onClick={handleDeleteAttachment}>
                    🗑️ DELETE
                  </button>
                </div>
              )}

              {chatAction === 'opened' && (
                <div style={{ color: 'var(--color-accent-warm)', fontSize: '12.5px', marginTop: '6px' }}>
                  💥 YOU OPENED THE MALICIOUS FILE! Worm self-propagated to all chat contacts!
                </div>
              )}

              {chatAction === 'scanned' && (
                <div style={{ color: 'var(--color-accent)', fontSize: '12.5px', marginTop: '6px' }}>
                  ✅ SMART MOVE! Antivirus flagged Trojan hash. Attachment was isolated safely.
                </div>
              )}

              {chatAction === 'deleted' && (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '12.5px', marginTop: '6px' }}>
                  🗑️ Suspicious attachment removed.
                </div>
              )}
            </div>
          </div>

          <div className={styles.networkCluster}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--color-text)' }}>
                🌐 Class LAN Network Contagion Map
              </h3>
              <span style={{ fontSize: '12px', color: networkInfectedCount > 0 ? '#FF6B4A' : '#3DDC97', fontWeight: 'bold' }}>
                Infected PCs: {networkInfectedCount} / 8
              </span>
            </div>

            <div className={styles.pcNodeGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div
                  key={num}
                  className={`${styles.pcNode} ${
                    num <= networkInfectedCount ? styles.pcNodeInfected : ''
                  }`}
                >
                  <span style={{ fontSize: '18px' }}>🖥️</span>
                  <span>PC #{num}</span>
                  <span style={{ fontSize: '9px', fontWeight: 'bold' }}>
                    {num <= networkInfectedCount ? 'INFECTED ⚠️' : 'SECURE 🟢'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 5. VIRUS DETECTIVE MISSION MODE */}
      {/* ============================================================ */}
      {activeTab === 'detective' && (
        <section className={styles.detectiveContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '18px', color: 'var(--color-accent)' }}>
                🕵️ Virus Detective Challenge Mode
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Analyze the cybersecurity incident and identify the exact virus type.
              </p>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
              Detective Score: {detectiveScore} / {DETECTIVE_SCENARIOS.length}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {DETECTIVE_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                className={`${styles.labNavBtn} ${selectedCaseIdx === idx ? styles.labNavBtnActive : ''}`}
                onClick={() => setSelectedCaseIdx(idx)}
              >
                Case #{idx + 1}
              </button>
            ))}
          </div>

          {(() => {
            const currentCase = DETECTIVE_SCENARIOS[selectedCaseIdx];
            const chosen = userAnswers[currentCase.id];

            return (
              <div className={styles.scenarioCard}>
                <h3 style={{ fontSize: '16px', color: 'var(--color-accent)' }}>
                  {currentCase.title}
                </h3>
                <p className={styles.scenarioText}>{currentCase.scenario}</p>

                <div className={styles.scenarioOptions}>
                  {currentCase.options.map((opt) => {
                    let optStyle = styles.scenarioOptionBtn;
                    if (chosen) {
                      if (opt.isCorrect) optStyle += ` ${styles.optCorrect}`;
                      else if (chosen.id === opt.id) optStyle += ` ${styles.optWrong}`;
                    }

                    return (
                      <button
                        key={opt.id}
                        className={optStyle}
                        onClick={() => !chosen && handleOptionSelect(currentCase.id, opt)}
                      >
                        <span>{opt.label}</span>
                        {chosen && (
                          <span style={{ fontSize: '12px' }}>
                            {opt.isCorrect ? '✓ Correct Answer' : ''}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {chosen && (
                  <div style={{ background: 'var(--color-surface)', padding: '12px', borderRadius: '4px', borderLeft: '3px solid var(--color-accent)', fontSize: '13px' }}>
                    <strong>Detective Insight:</strong> {chosen.reason}
                  </div>
                )}
              </div>
            );
          })()}
        </section>
      )}
    </div>
  );
}
