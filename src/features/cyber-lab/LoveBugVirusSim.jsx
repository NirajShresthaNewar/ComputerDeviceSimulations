import { useState, useEffect } from 'react';
import styles from './LoveBugVirusSim.module.css';

export default function LoveBugVirusSim() {
  const [stage, setStage] = useState(1); // 1: Email Arrival, 2: Script Execution, 3: File Destruction, 4: Mass Mailing Propagation, 5: Antivirus & Recovery
  const [isAntivirusEnabled, setIsAntivirusEnabled] = useState(false);
  const [attachmentOpened, setAttachmentOpened] = useState(false);

  // Simulated User Personal Files on C:\
  const [userFiles, setUserFiles] = useState([
    { id: 'file-1', originalName: 'Family_Vacation.jpg', currentName: 'Family_Vacation.jpg', type: 'image', size: '1.4 MB', icon: '🖼️', isCorrupted: false },
    { id: 'file-2', originalName: 'Favorite_Song.mp3', currentName: 'Favorite_Song.mp3', type: 'audio', size: '4.8 MB', icon: '🎵', isCorrupted: false },
    { id: 'file-3', originalName: 'Science_Project.doc', currentName: 'Science_Project.doc', type: 'doc', size: '320 KB', icon: '📄', isCorrupted: false },
    { id: 'file-4', originalName: 'Birthday_Party.jpg', currentName: 'Birthday_Party.jpg', type: 'image', size: '2.1 MB', icon: '🖼️', isCorrupted: false },
    { id: 'file-5', originalName: 'School_Website.html', currentName: 'School_Website.html', type: 'code', size: '45 KB', icon: '🌐', isCorrupted: false },
    { id: 'file-6', originalName: 'Guitar_Recording.mp3', currentName: 'Guitar_Recording.mp3', type: 'audio', size: '5.2 MB', icon: '🎵', isCorrupted: false },
  ]);

  // Outlook Address Book Contacts for Mass Mailing
  const [outlookContacts] = useState([
    { name: 'Teacher Sarah', email: 'sarah.teacher@school.edu' },
    { name: 'Rahul (Friend)', email: 'rahul.student@school.edu' },
    { name: 'Alice (Classmate)', email: 'alice.k@school.edu' },
    { name: 'Mom', email: 'mom@home-family.com' },
    { name: 'Principal Office', email: 'principal@school.edu' },
    { name: 'Computer Lab Server', email: 'admin@lab.net' },
    { name: 'Uncle David', email: 'david.d@workcorp.com' },
  ]);

  const [sentMails, setSentMails] = useState([]);
  const [globalInfectedCount, setGlobalInfectedCount] = useState(1);

  // Reset Simulation
  const handleReset = () => {
    setStage(1);
    setAttachmentOpened(false);
    setUserFiles([
      { id: 'file-1', originalName: 'Family_Vacation.jpg', currentName: 'Family_Vacation.jpg', type: 'image', size: '1.4 MB', icon: '🖼️', isCorrupted: false },
      { id: 'file-2', originalName: 'Favorite_Song.mp3', currentName: 'Favorite_Song.mp3', type: 'audio', size: '4.8 MB', icon: '🎵', isCorrupted: false },
      { id: 'file-3', originalName: 'Science_Project.doc', currentName: 'Science_Project.doc', type: 'doc', size: '320 KB', icon: '📄', isCorrupted: false },
      { id: 'file-4', originalName: 'Birthday_Party.jpg', currentName: 'Birthday_Party.jpg', type: 'image', size: '2.1 MB', icon: '🖼️', isCorrupted: false },
      { id: 'file-5', originalName: 'School_Website.html', currentName: 'School_Website.html', type: 'code', size: '45 KB', icon: '🌐', isCorrupted: false },
      { id: 'file-6', originalName: 'Guitar_Recording.mp3', currentName: 'Guitar_Recording.mp3', type: 'audio', size: '5.2 MB', icon: '🎵', isCorrupted: false },
    ]);
    setSentMails([]);
    setGlobalInfectedCount(1);
  };

  // Trigger Attachment Open
  const handleOpenLoveLetter = () => {
    if (isAntivirusEnabled) {
      alert('🛡️ Antivirus Real-Time Protection INTERCEPTED LOVE-LETTER-FOR-YOU.TXT.vbs before execution!');
      return;
    }

    setAttachmentOpened(true);
    setStage(2); // Script Execution

    // Progression into File Destruction
    setTimeout(() => {
      setStage(3); // Overwriting files
      setUserFiles((prev) =>
        prev.map((f) => ({
          ...f,
          currentName: `${f.originalName}.vbs`,
          icon: '🦠',
          size: '10 KB (VBScript Payload)',
          isCorrupted: true,
        }))
      );

      // Progression into Mass Mailing Worm
      setTimeout(() => {
        setStage(4); // Mass mailing
        // Simulate sending emails to all contacts one by one
        outlookContacts.forEach((contact, idx) => {
          setTimeout(() => {
            setSentMails((m) => [...m, contact]);
            setGlobalInfectedCount((c) => c * 4 + 12);
          }, (idx + 1) * 600);
        });
      }, 3500);
    }, 2500);
  };

  return (
    <div className={styles.loveBugContainer}>
      {/* Simulation Stage Navigation */}
      <div className={styles.stageStepper}>
        <button
          className={`${styles.stepNode} ${stage === 1 ? styles.stepNodeActive : ''}`}
          onClick={() => setStage(1)}
        >
          <span>💌 1. Phishing Email</span>
        </button>
        <span className={styles.stepperArrow}>➔</span>

        <button
          className={`${styles.stepNode} ${stage === 2 ? styles.stepNodeActive : ''}`}
          onClick={() => setStage(2)}
        >
          <span>⚡ 2. VBScript Execution</span>
        </button>
        <span className={styles.stepperArrow}>➔</span>

        <button
          className={`${styles.stepNode} ${stage === 3 ? styles.stepNodeDanger : ''}`}
          onClick={() => setStage(3)}
        >
          <span>💥 3. File Overwrite Destruction</span>
        </button>
        <span className={styles.stepperArrow}>➔</span>

        <button
          className={`${styles.stepNode} ${stage === 4 ? styles.stepNodeDanger : ''}`}
          onClick={() => setStage(4)}
        >
          <span>🌐 4. Mass-Mailing Propagation</span>
        </button>
        <span className={styles.stepperArrow}>➔</span>

        <button
          className={`${styles.stepNode} ${stage === 5 ? styles.stepNodeActive : ''}`}
          onClick={() => setStage(5)}
        >
          <span>🛡️ 5. Antivirus Defense & Lessons</span>
        </button>
      </div>

      {/* Global Impact Dashboard (When Worm is spreading) */}
      {stage >= 3 && (
        <div className={styles.impactDashboard}>
          <div className={styles.impactStatCard}>
            <div className={styles.impactStatVal}>100%</div>
            <div className={styles.impactStatLabel}>Personal JPG & MP3 Files Destroyed</div>
          </div>

          <div className={styles.impactStatCard}>
            <div className={styles.impactStatVal}>{sentMails.length} / {outlookContacts.length}</div>
            <div className={styles.impactStatLabel}>Outlook Contacts Infected</div>
          </div>

          <div className={styles.impactStatCard}>
            <div className={styles.impactStatVal}>{globalInfectedCount.toLocaleString()}+</div>
            <div className={styles.impactStatLabel}>Global Computers Infected (May 2000)</div>
          </div>

          <div className={styles.impactStatCard}>
            <div className={styles.impactStatVal} style={{ color: '#FF6B4A' }}>$10 Billion+</div>
            <div className={styles.impactStatLabel}>Worldwide Economic Damage</div>
          </div>
        </div>
      )}

      {/* VIRTUAL WINDOWS OS DESKTOP SIMULATION */}
      <div className={styles.virtualDesktop}>
        <div className={styles.desktopWorkspace}>
          {/* 1. OUTLOOK EMAIL CLIENT WINDOW */}
          <div className={styles.osAppWindow}>
            <div className={styles.appHeader}>
              <div className={styles.appTitle}>
                <span>✉️</span>
                <span>Microsoft Outlook Express - Inbox</span>
              </div>
              <div className={styles.windowControls}>
                <span className={styles.winDot} />
                <span className={styles.winDot} />
                <span className={styles.winDot} />
              </div>
            </div>

            <div className={styles.appBody}>
              <div className={styles.emailMetaRow}>
                <div><strong>From:</strong> friend@school.edu</div>
                <div><strong>Date:</strong> May 4, 2000, 8:30 AM</div>
                <div><strong>Subject:</strong> <span style={{ color: '#FF6B4A', fontWeight: 'bold' }}>ILOVEYOU</span></div>
              </div>

              <div style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>
                "kindly check the attached LOVELETTER coming from me."
              </div>

              {/* Malicious Attachment with Double Extension Trick */}
              <div
                className={styles.attachmentCard}
                onClick={handleOpenLoveLetter}
                title="Double click to simulate user opening the attachment"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>📎</span>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-text)', fontSize: '13px' }}>
                      LOVE-LETTER-FOR-YOU.TXT<span style={{ color: '#FF6B4A' }}>.vbs</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      VBScript Executable disguised as Text File (10.3 KB)
                    </div>
                  </div>
                </div>

                <span className={styles.extensionTrickBadge}>
                  {attachmentOpened ? 'EXECUTED ⚠️' : 'CLICK TO OPEN 🖱️'}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                💡 <strong>The Deception Trick:</strong> Windows hid the <code>.vbs</code> extension by default, so victims only saw <code>LOVE-LETTER-FOR-YOU.TXT</code> and thought it was an innocent text note!
              </div>
            </div>
          </div>

          {/* 2. WINDOWS FILE EXPLORER: WHAT DAMAGE IT DOES */}
          <div className={styles.osAppWindow}>
            <div className={styles.appHeader}>
              <div className={styles.appTitle}>
                <span>📁</span>
                <span>C:\Users\Student\My Documents & Pictures</span>
              </div>
              <span style={{ fontSize: '11px', color: stage >= 3 ? '#FF6B4A' : '#3DDC97', fontWeight: 'bold' }}>
                {stage >= 3 ? 'OVERWRITTEN / CORRUPTED' : 'CLEAN / HEALTHY'}
              </span>
            </div>

            <div className={styles.appBody}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {stage >= 3
                  ? '💥 DAMAGE DONE: The VBScript searched all hard drives and OVERWROTE personal photos (.jpg) and songs (.mp3) with its own code!'
                  : '📂 Your healthy personal photos, school documents, and music files:'}
              </p>

              <div className={styles.explorerFilesGrid}>
                {userFiles.map((f) => (
                  <div
                    key={f.id}
                    className={`${styles.explorerFileCard} ${f.isCorrupted ? styles.fileCorrupted : ''}`}
                  >
                    <span className={styles.fileIconLg}>{f.icon}</span>
                    <span className={styles.fileNameSmall}>{f.currentName}</span>
                    <span className={styles.fileOriginalTag}>{f.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. PROPAGATION: OUTGOING EMAIL QUEUE */}
          {stage >= 4 && (
            <div className={styles.osAppWindow} style={{ gridColumn: '1 / -1' }}>
              <div className={styles.appHeader}>
                <div className={styles.appTitle}>
                  <span>🚀</span>
                  <span>Mass-Mailing Worm Engine: Outgoing Sent Mail Queue (Auto-Propagating)</span>
                </div>
                <span style={{ fontSize: '11px', color: '#FF6B4A', fontWeight: 'bold' }}>
                  MAPI ADDRESS BOOK HIJACKED
                </span>
              </div>

              <div className={styles.appBody}>
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                  The virus connected to Microsoft Outlook MAPI, extracted every contact in the user's address book, and silently sent infected copies from the victim's own email:
                </p>

                <div className={styles.outboxList}>
                  {sentMails.map((contact, idx) => (
                    <div key={idx} className={styles.outboxItem}>
                      <span>✉️ To: <strong>{contact.name}</strong> ({contact.email})</span>
                      <span style={{ color: '#FF6B4A', fontWeight: 'bold' }}>Subject: ILOVEYOU [Sent ➔]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Virtual Windows Taskbar */}
        <div className={styles.taskbar}>
          <div className={styles.startButton}>
            <span>🪟</span>
            <span>Start</span>
          </div>

          <div className={styles.taskbarTray}>
            <span>{isAntivirusEnabled ? '🛡️ Shield: Active' : '⚠️ No Antivirus'}</span>
            <span>🔊</span>
            <span>8:30 AM (May 4, 2000)</span>
          </div>
        </div>
      </div>

      {/* Control Banner & Action Controls */}
      <div className={styles.actionBanner}>
        <div className={styles.actionText}>
          {stage === 1 && (
            <span>
              <strong>Step 1:</strong> Click on the attachment <code>LOVE-LETTER-FOR-YOU.TXT.vbs</code> inside the Outlook Express window above to simulate what happened on May 4, 2000.
            </span>
          )}
          {stage === 2 && (
            <span style={{ color: 'var(--color-accent)' }}>
              <strong>Step 2 (Executing):</strong> Windows Script Host (<code>wscript.exe</code>) has executed the VBScript. It is reading the drive...
            </span>
          )}
          {stage === 3 && (
            <span style={{ color: '#FF6B4A' }}>
              <strong>Step 3 (Destruction):</strong> Notice how your JPG pictures and MP3 songs turned into <code>.vbs</code> files! Original data was permanently lost.
            </span>
          )}
          {stage === 4 && (
            <span style={{ color: '#FF6B4A' }}>
              <strong>Step 4 (Transfer / Propagation):</strong> The worm hijacked the contact list and forwarded itself to all friends and teachers.
            </span>
          )}
          {stage === 5 && (
            <span style={{ color: '#3DDC97' }}>
              <strong>Step 5 (Lessons):</strong> 1. Never open unexpected attachments. 2. Always show file extensions in Windows settings. 3. Keep Antivirus active.
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={styles.actionBtnPrimary}
            style={{
              background: isAntivirusEnabled ? 'rgba(61,220,151,0.2)' : 'rgba(255,107,74,0.2)',
              color: isAntivirusEnabled ? 'var(--color-accent)' : 'var(--color-accent-warm)',
              border: `1px solid ${isAntivirusEnabled ? 'var(--color-accent)' : 'var(--color-accent-warm)'}`,
            }}
            onClick={() => setIsAntivirusEnabled(!isAntivirusEnabled)}
          >
            {isAntivirusEnabled ? '🛡️ Antivirus: ON' : '🔴 Antivirus: OFF'}
          </button>

          <button className={styles.actionBtnPrimary} onClick={handleReset}>
            🔄 Reset Scenario
          </button>
        </div>
      </div>
    </div>
  );
}
