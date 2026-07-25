import { useState, useRef, useCallback, useEffect } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import CpuInternalsDiagram from '../../../components/simulation-shell/CpuInternalsDiagram';
import ScannerMechanism from './ScannerMechanism';
import LiveOcrOutput, { OCR_LINES } from './LiveOcrOutput';
import styles from './ScannerSim.module.css';

export default function ScannerSim() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [signal, setSignal] = useState(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  const durationMs = 6000; // slower sweep so the line-by-line reveal is readable

  // Map 0–100% progress to how many lines should be revealed so far
  const revealedCount = Math.min(
    OCR_LINES.length,
    Math.floor((scanProgress / 100) * OCR_LINES.length) + (isScanning ? 1 : 0)
  );

  const animate = useCallback((now) => {
    if (!startTimeRef.current) startTimeRef.current = now;
    const elapsed = now - startTimeRef.current;
    const pct = Math.min(100, (elapsed / durationMs) * 100);
    setScanProgress(pct);

    if (pct < 100) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setIsScanning(false);
      setSignal({
        kind: 'Data',
        usesALU: true,
        usesStorage: true,
        detail:
          'The CCD sensor strip converted reflected light into electrical signal data, line by line. The ALU processed it through OCR to recognize characters, and the result was written to Secondary Storage before being sent to Output.',
      });
    }
  }, []);

  const toggleScanning = () => {
    if (isScanning) {
      cancelAnimationFrame(rafRef.current);
      setIsScanning(false);
    } else {
      // restart from the beginning each time so the line-by-line reveal replays cleanly
      startTimeRef.current = null;
      setScanProgress(0);
      setSignal(null);
      setIsScanning(true);
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const simulateContent = (
    <div className={styles.simulateGrid}>
      <ScannerMechanism
        isScanning={isScanning}
        scanProgress={scanProgress}
        onToggle={toggleScanning}
      />
      <div className={styles.right}>
        <LiveOcrOutput revealedCount={revealedCount} isScanning={isScanning} />
        <CpuInternalsDiagram signal={signal} />
      </div>
    </div>
  );

  const learnContent = (
    <ExplanationPanel
      description="A scanner is an input device that converts a physical document into a digital image. A moving carriage sweeps a bright light source across the page while the reflected light bounces off an angled mirror, passes through a focusing lens, and lands on a CCD (charge-coupled device) sensor strip. The sensor measures brightness at each point along the line and converts it into an electrical signal — repeating line by line down the page to build a complete image. Optical Character Recognition (OCR) software can then analyze that image to identify individual letters and words, turning a picture of text into editable, searchable text data."
      advantages={[
        'Digitizes paper documents for storage and editing',
        'Makes printed text searchable via OCR',
        'Preserves an exact visual copy of originals',
        'Useful for archiving, legal, and historical documents',
      ]}
      disadvantages={[
        'Handheld and flatbed' 
      ]}
      uses={[
        'Digitizing paper records and books',
        'Document management and archiving systems',
        'ID and form scanning at  offices',
        'Converting printed text into editable files',
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
      <h1>Scanner</h1>
      <p className={styles.subtitle}>
        Watch the carriage sweep the page while the recognized text appears live, line by line.
      </p>
      <SimTabs learnContent={learnContent} simulateContent={simulateContent} quizContent={quizContent} />
    </div>
  );
}