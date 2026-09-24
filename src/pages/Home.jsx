import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState([
    { type: 'system', text: 'SYSTEM BOOT SEQUENCE: OK • FIREWALL: ACTIVE • ALL SIMS ONLINE' },
    { type: 'info', text: 'Type "help" or click any command chip below to launch simulations.' },
  ]);

  // Matrix Rain Background Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 900);

    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789$#@%&*+=~';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || 900;
    };
    window.addEventListener('resize', handleResize);

    const renderMatrix = () => {
      ctx.fillStyle = 'rgba(11, 14, 20, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#3DDC97';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(renderMatrix);
    };

    renderMatrix();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle Interactive CLI Commands
  const handleCliSubmit = (e) => {
    e.preventDefault();
    const cmd = cliInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...cliHistory, { type: 'user', text: `> ${cliInput}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'response',
          text: 'AVAILABLE COMMANDS: "virus" (Cyber Lab), "iloveyou" (Love Bug Sim), "os" (Operating System), "class6" (Q&A Bank), "devices" (Hardware Devices), "clear"',
        });
        break;
      case 'virus':
      case 'cyber':
        newHistory.push({ type: 'response', text: '🚀 Launching Cyber Virus Lab...' });
        setTimeout(() => navigate('/labs/cyber-virus-lab'), 600);
        break;
      case 'iloveyou':
      case 'lovebug':
        newHistory.push({ type: 'response', text: '💌 Initializing ILOVEYOU Virus OS Simulator...' });
        setTimeout(() => navigate('/labs/cyber-virus-lab'), 600);
        break;
      case 'os':
      case 'operating system':
        newHistory.push({ type: 'response', text: '🖥️ Booting Virtual Operating System...' });
        setTimeout(() => navigate('/software/operating-system'), 600);
        break;
      case 'class6':
      case 'qa':
      case 'dos':
        newHistory.push({ type: 'response', text: '📚 Opening Class 6 Q&A Smart Board Hub...' });
        setTimeout(() => navigate('/class-qa/class-6/chapter-5'), 600);
        break;
      case 'devices':
      case 'hardware':
        newHistory.push({ type: 'response', text: '💾 Navigating to Hardware Catalog...' });
        setTimeout(() => navigate('/input-devices'), 600);
        break;
      case 'clear':
      case 'cls':
        setCliHistory([]);
        setCliInput('');
        return;
      default:
        newHistory.push({
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for a list of commands.`,
        });
    }

    setCliHistory(newHistory);
    setCliInput('');
  };

  const handleQuickCmd = (command) => {
    setCliInput(command);
  };

  return (
    <div className={styles.homeContainer}>
      {/* Background Matrix Rain */}
      <canvas ref={canvasRef} className={styles.matrixCanvas} />
      <div className={styles.scanlinesOverlay} />

      {/* HERO SECTION: MODERN TERMINAL CLI */}
      <section className={styles.heroTerminalCard}>
        <div className={styles.terminalHeader}>
          <div className={styles.terminalDots}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>
          <div className={styles.terminalTitle}>
            <span>⚡ TERMINAL://ROOT@CYBER_LAB_V8</span>
          </div>
          <span style={{ fontSize: '11px', color: '#3DDC97', fontWeight: 'bold' }}>● ONLINE</span>
        </div>

        <div className={styles.terminalBody}>
          <div>
            <h1 className={styles.glitchTitle}>Computer System & Cyber Simulator</h1>
            <p className={styles.heroSubtitle}>
              Interactive educational sandbox for computer hardware, operating systems, malware virus mechanics, and curriculum study notes.
            </p>
          </div>

          <div className={styles.statusLine}>
            <span>🛡️</span>
            <span>SYSTEM STATUS: ALL SIMULATION ENGINES ONLINE & ARMED</span>
          </div>

          {/* Interactive CLI Console */}
          <div>
            <div className={styles.cliOutput}>
              {cliHistory.slice(-4).map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    color:
                      line.type === 'user'
                        ? '#00f0ff'
                        : line.type === 'error'
                        ? '#FF6B4A'
                        : line.type === 'response'
                        ? '#3DDC97'
                        : 'var(--color-text-muted)',
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleCliSubmit} className={styles.cliInputBox}>
              <span className={styles.cliPromptSymbol}>terminal:~$</span>
              <input
                type="text"
                className={styles.cliInput}
                placeholder="Type command ('help', 'virus', 'os', 'class6')..."
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
              />
            </form>

            <div className={styles.quickTags}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Quick Commands:</span>
              <button className={styles.cliTagBtn} onClick={() => handleQuickCmd('virus')}>
                🛡️ virus
              </button>
              <button className={styles.cliTagBtn} onClick={() => handleQuickCmd('iloveyou')}>
                💌 iloveyou
              </button>
              <button className={styles.cliTagBtn} onClick={() => handleQuickCmd('os')}>
                🖥️ os
              </button>
              <button className={styles.cliTagBtn} onClick={() => handleQuickCmd('class6')}>
                📚 class6
              </button>
              <button className={styles.cliTagBtn} onClick={() => handleQuickCmd('help')}>
                ❓ help
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CYBER COMMAND CENTER GRID */}
      <section className={styles.cyberSection}>
        <div className={styles.sectionHeaderRow}>
          <h2 className={styles.sectionTitle}>
            <span>⚡</span> Featured Interactive Laboratories
          </h2>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Select a simulation module below
          </span>
        </div>

        <div className={styles.cardsGrid}>
          {/* Card 1: Cyber Virus Lab & ILOVEYOU */}
          <div className={`${styles.cyberCard} ${styles.cardGlowBorderRed}`}>
            <div>
              <div className={styles.cardTop}>
                <span className={`${styles.cardBadge} ${styles.badgeRed}`}>Cybersecurity Lab</span>
                <span style={{ fontSize: '11px', color: '#FF6B4A', fontWeight: 'bold' }}>Interactive</span>
              </div>
              <h3 className={styles.cardTitle}>
                <span>🦠</span> Cyber Virus & ILOVEYOU Simulator
              </h3>
              <p className={styles.cardDesc}>
                Experience how viruses attack! Simulate Boot Sector corruption, File Infectors, System Kernel hijack, and the realistic May 2000 ILOVEYOU Worm file destruction.
              </p>
            </div>

            <Link to="/labs/cyber-virus-lab" className={`${styles.launchLink} ${styles.launchLinkHot}`}>
              Launch Cyber Lab ➔
            </Link>
          </div>

          {/* Card 2: Virtual Operating System */}
          <div className={`${styles.cyberCard} ${styles.cardGlowBorderPurple}`}>
            <div>
              <div className={styles.cardTop}>
                <span className={`${styles.cardBadge} ${styles.badgePurple}`}>System Software</span>
                <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 'bold' }}>Interactive OS</span>
              </div>
              <h3 className={styles.cardTitle}>
                <span>🖥️</span> Virtual Operating System
              </h3>
              <p className={styles.cardDesc}>
                You Are the Operating System! Coordinate multitasking CPU processes, allocate blocks of RAM, organize files, manage hardware drivers, and enforce user access security.
              </p>
            </div>

            <Link to="/software/operating-system" className={styles.launchLink}>
              Launch OS Simulator ➔
            </Link>
          </div>

          {/* Card 3: Class 6 Q&A Smart Board Hub */}
          <div className={styles.cyberCard}>
            <div>
              <div className={styles.cardTop}>
                <span className={`${styles.cardBadge} ${styles.badgeGreen}`}>Smart Board Ready</span>
                <span style={{ fontSize: '11px', color: '#3DDC97', fontWeight: 'bold' }}>Class 6</span>
              </div>
              <h3 className={styles.cardTitle}>
                <span>📚</span> Class 6: OS & DOS Commands Q&A
              </h3>
              <p className={styles.cardDesc}>
                High-visibility classroom study notes for Chapter 5 & 6. Includes short answers, File vs Directory tables, 10 DOS command functions, and in-browser text editing.
              </p>
            </div>

            <Link to="/class-qa/class-6/chapter-5" className={styles.launchLink}>
              Open Smart Board Q&A ➔
            </Link>
          </div>

          {/* Card 4: Language Translators */}
          <div className={styles.cyberCard}>
            <div>
              <div className={styles.cardTop}>
                <span className={`${styles.cardBadge} ${styles.badgeCyan}`}>Compilers & Code</span>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>Translators</span>
              </div>
              <h3 className={styles.cardTitle}>
                <span>🔀</span> Language Translators Lab
              </h3>
              <p className={styles.cardDesc}>
                Compare Compilers (all-at-once), Interpreters (line-by-line), and Assemblers as they convert high-level code into binary machine language.
              </p>
            </div>

            <Link to="/software/language-translators" className={styles.launchLink}>
              Launch Translators ➔
            </Link>
          </div>

          {/* Card 5: Hardware Device Labs */}
          <div className={styles.cyberCard}>
            <div>
              <div className={styles.cardTop}>
                <span className={`${styles.cardBadge} ${styles.badgeGreen}`}>Hardware Circuits</span>
                <span style={{ fontSize: '11px', color: '#3DDC97', fontWeight: 'bold' }}>Simulations</span>
              </div>
              <h3 className={styles.cardTitle}>
                <span>💾</span> Hardware Devices Catalog
              </h3>
              <p className={styles.cardDesc}>
                Explore real mechanical HDD platters, magnetic tape sequential domains, dot matrix and laser printers, optical mice, RGB pixel monitors, and microphones.
              </p>
            </div>

            <Link to="/input-devices" className={styles.launchLink}>
              Explore Hardware ➔
            </Link>
          </div>

          {/* Card 6: Interactive Labs Hub */}
          <div className={styles.cyberCard}>
            <div>
              <div className={styles.cardTop}>
                <span className={`${styles.cardBadge} ${styles.badgeCyan}`}>Lab Center</span>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>Experiments</span>
              </div>
              <h3 className={styles.cardTitle}>
                <span>🧪</span> Interactive Labs & Diagnostics
              </h3>
              <p className={styles.cardDesc}>
                Run hands-on computer experiments: test device throughput, memory allocation limits, virus quarantine response times, and audio waveform frequencies.
              </p>
            </div>

            <Link to="/labs" className={styles.launchLink}>
              Open Labs Center ➔
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}