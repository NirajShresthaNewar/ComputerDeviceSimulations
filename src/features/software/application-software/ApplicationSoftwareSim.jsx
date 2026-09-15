import { useState, useRef } from 'react';
import { appAudio } from './appSoftwareAudio';
import IntroSection from './IntroSection';
import OverviewSection from './OverviewSection';
import PackagedSection from './PackagedSection';
import TailoredSection from './TailoredSection';
import ComparisonSection from './ComparisonSection';
import ChallengesSection from './ChallengesSection';
import QuizSummarySection from './QuizSummarySection';
import styles from './ApplicationSoftwareSim.module.css';

const STEPS = [
  { id: 1, label: '1. Introduction', shortLabel: 'Intro' },
  { id: 2, label: '2. Application Apps', shortLabel: 'Apps' },
  { id: 3, label: '3. Packaged Software', shortLabel: 'Packaged' },
  { id: 4, label: '4. Tailored Software', shortLabel: 'Tailored' },
  { id: 5, label: '5. Compare Them', shortLabel: 'Compare' },
  { id: 6, label: '6. Challenges & Games', shortLabel: 'Challenges' },
  { id: 7, label: '7. Summary & Quiz', shortLabel: 'Quiz' },
];

export default function ApplicationSoftwareSim() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const containerRef = useRef(null);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    appAudio.setMuted(next);
    if (!next) appAudio.playClick();
  };

  const goToStep = (stepNumber) => {
    appAudio.playClick();
    setCurrentStep(stepNumber);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    appAudio.playClick();
    setCurrentStep(1);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {/* 1. PROGRESS STEP BAR */}
      <div className={styles.stepProgressBar}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', flex: 1 }}>
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <button
                key={step.id}
                type="button"
                className={`${styles.stepPill} ${isActive ? styles.stepPillActive : ''} ${
                  isCompleted ? styles.stepPillCompleted : ''
                }`}
                onClick={() => goToStep(step.id)}
              >
                <span>{isCompleted ? '✓' : step.id}</span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={toggleSound}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
        >
          <span>{isMuted ? '🔇' : '🔊'}</span>
        </button>
      </div>

      {/* 2. ACTIVE STEP CONTENT */}
      {currentStep === 1 && <IntroSection onStart={() => goToStep(2)} />}
      {currentStep === 2 && <OverviewSection />}
      {currentStep === 3 && <PackagedSection />}
      {currentStep === 4 && <TailoredSection />}
      {currentStep === 5 && <ComparisonSection />}
      {currentStep === 6 && <ChallengesSection />}
      {currentStep === 7 && <QuizSummarySection />}

      {/* 3. BOTTOM CONTROLS & NAVIGATION */}
      <div className={styles.bottomActionBar}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <span>◀ Back</span>
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleReset}
          >
            <span>🔄 Reset to Start</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Step {currentStep} of {STEPS.length}
          </span>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleNext}
            >
              <span>Next Step ➔</span>
            </button>
          ) : (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleReset}
            >
              <span>🎉 Restart Journey</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
