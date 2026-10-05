import React, { useState, useEffect, useRef, useCallback } from 'react';
import QuestionWheel from './QuestionWheel';
import StudentWheel from './StudentWheel';
import ResultSpotlight from './ResultSpotlight';
import StudentGrid from './StudentGrid';
import TurnHistory from './TurnHistory';
import SettingsModal from './SettingsModal';
import ConfettiEffect from './ConfettiEffect';
import { DEFAULT_QUESTIONS } from './defaultQuestions';
import { wheelAudio } from './wheelAudio';
import styles from './QuizWheel.module.css';

const STORAGE_KEYS = {
  TOTAL_STUDENTS: 'quiz_wheel_total_students_v1',
  USED_STUDENTS: 'quiz_wheel_used_students_v1',
  QUESTIONS: 'quiz_wheel_questions_v1',
  HISTORY: 'quiz_wheel_history_v1',
  SPIN_DURATION: 'quiz_wheel_spin_duration_v1',
  SOUND_ENABLED: 'quiz_wheel_sound_enabled_v1',
  CONFETTI_ENABLED: 'quiz_wheel_confetti_enabled_v1',
};

export default function QuizWheelPage() {
  // State from LocalStorage
  const [totalStudents, setTotalStudents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOTAL_STUDENTS);
    return saved ? parseInt(saved, 10) : 26;
  });

  const [usedStudents, setUsedStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USED_STUDENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return saved ? JSON.parse(saved) : DEFAULT_QUESTIONS;
    } catch {
      return DEFAULT_QUESTIONS;
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [spinDuration, setSpinDuration] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPIN_DURATION);
    return saved ? parseInt(saved, 10) : 3800;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [confettiEnabled, setConfettiEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFETTI_ENABLED);
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Current selections
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Wheel spinning states
  const [isQuestionSpinning, setIsQuestionSpinning] = useState(false);
  const [isStudentSpinning, setIsStudentSpinning] = useState(false);

  // Modals and visual triggers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);

  // Audio mute sync
  useEffect(() => {
    wheelAudio.setMuted(!soundEnabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // LocalStorage sync effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOTAL_STUDENTS, totalStudents.toString());
  }, [totalStudents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USED_STUDENTS, JSON.stringify(usedStudents));
  }, [usedStudents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPIN_DURATION, spinDuration.toString());
  }, [spinDuration]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFETTI_ENABLED, JSON.stringify(confettiEnabled));
  }, [confettiEnabled]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Available students list
  const availableStudents = Array.from({ length: totalStudents }, (_, i) => i + 1).filter(
    (roll) => !usedStudents.includes(roll)
  );
  const isRoundComplete = availableStudents.length === 0 && totalStudents > 0;

  // Question Spin End Handler
  const handleQuestionSpinEnd = (selectedQuestion) => {
    setCurrentQuestion(selectedQuestion);
  };

  // Student Spin End Handler
  const handleStudentSpinEnd = (selectedRoll) => {
    setCurrentStudent(selectedRoll);
    // Mark student as used in current round
    if (!usedStudents.includes(selectedRoll)) {
      setUsedStudents((prev) => [...prev, selectedRoll]);
    }

    if (confettiEnabled) {
      setConfettiTrigger(Date.now());
    }

    // Check if round complete after this selection
    if (usedStudents.length + 1 >= totalStudents) {
      setTimeout(() => {
        if (soundEnabled) wheelAudio.playRoundComplete();
      }, 500);
    }
  };

  // Record Current Turn into History
  const handleRecordTurn = () => {
    if (!currentStudent || !currentQuestion) return;

    const newTurn = {
      id: `turn_${Date.now()}`,
      roll: currentStudent,
      questionText: currentQuestion.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => [newTurn, ...prev]);
    wheelAudio.playButtonClick();
  };

  // Undo current selected student
  const handleUndoCurrentStudent = () => {
    if (currentStudent === null) return;
    setUsedStudents((prev) => prev.filter((r) => r !== currentStudent));
    setCurrentStudent(null);
    wheelAudio.playButtonClick();
  };

  // Undo Last Turn from History
  const handleUndoLastTurn = () => {
    if (history.length === 0) return;
    const [lastTurn, ...restHistory] = history;
    setHistory(restHistory);

    // Restore roll number to available pool
    setUsedStudents((prev) => prev.filter((r) => r !== lastTurn.roll));
    if (currentStudent === lastTurn.roll) {
      setCurrentStudent(null);
    }
    wheelAudio.playButtonClick();
  };

  // Clear History
  const handleClearHistory = () => {
    if (window.confirm('Clear all turn history?')) {
      setHistory([]);
      wheelAudio.playButtonClick();
    }
  };

  // Toggle student manual participation
  const handleToggleStudent = (roll) => {
    setUsedStudents((prev) => {
      if (prev.includes(roll)) {
        return prev.filter((r) => r !== roll);
      } else {
        return [...prev, roll];
      }
    });
    wheelAudio.playButtonClick();
  };

  // Start New Round
  const handleStartNewRound = () => {
    setUsedStudents([]);
    setCurrentStudent(null);
    if (soundEnabled) wheelAudio.playSurpriseFanfare();
    if (confettiEnabled) setConfettiTrigger(Date.now());
  };

  // Generate / Change number of students
  const handleGenerateStudents = (count) => {
    if (usedStudents.length > 0) {
      if (!window.confirm(`Changing student count to ${count} will reset the current round. Continue?`)) {
        return;
      }
    }
    setTotalStudents(count);
    setUsedStudents([]);
    setCurrentStudent(null);
    setIsSettingsOpen(false);
  };

  // Reset all settings and data
  const handleResetAll = () => {
    setTotalStudents(26);
    setUsedStudents([]);
    setQuestions(DEFAULT_QUESTIONS);
    setHistory([]);
    setCurrentStudent(null);
    setCurrentQuestion(null);
    setSpinDuration(3800);
    setSoundEnabled(true);
    setConfettiEnabled(true);
    localStorage.clear();
  };

  // Surprise Me! (One-click pick both student and question)
  const handleSurpriseMe = () => {
    if (isQuestionSpinning || isStudentSpinning) return;
    if (availableStudents.length === 0) {
      alert('All students have had a turn in this round! Click "Start New Round" first.');
      return;
    }

    if (soundEnabled) wheelAudio.playSurpriseFanfare();

    // Pick random available student and random question
    const randomRoll = availableStudents[Math.floor(Math.random() * availableStudents.length)];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    setCurrentStudent(randomRoll);
    setCurrentQuestion(randomQuestion);

    if (!usedStudents.includes(randomRoll)) {
      setUsedStudents((prev) => [...prev, randomRoll]);
    }

    if (confettiEnabled) {
      setConfettiTrigger(Date.now());
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isFullscreen ? styles.fullscreenMode : ''}`}
    >
      {/* Confetti Particle Layer */}
      <ConfettiEffect trigger={confettiTrigger} />

      {/* Header Bar */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleIcon}>🎡</div>
          <div>
            <h1 className={styles.title}>Classroom Quiz Wheel</h1>
            <p className={styles.subtitle}>
              Dual-Wheel Random Question & Student Picker for Smartboard & Classroom Quizzes
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={handleSurpriseMe}
            className={`${styles.actionBtn} ${styles.surpriseBtn}`}
            title="Instant random pick for both student and question"
            disabled={isQuestionSpinning || isStudentSpinning || isRoundComplete}
          >
            <span>✨</span>
            <span>Surprise Me!</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={styles.actionBtn}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span>
            <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className={styles.actionBtn}
            title="Toggle Smartboard Fullscreen"
          >
            <span>{isFullscreen ? '🗗' : '🖥️'}</span>
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Smartboard Mode'}</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className={styles.actionBtn}
            title="Open Settings"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Round Completed Celebration Alert */}
      {isRoundComplete && (
        <div className={styles.roundBanner}>
          <div className={styles.roundBannerText}>
            <span style={{ fontSize: '2rem' }}>🎉</span>
            <div>
              <div>Everyone has had a turn in this round!</div>
              <div style={{ fontSize: '0.9rem', color: '#A7F3D0', fontWeight: '500' }}>
                All {totalStudents} students have participated. Start a fresh round to continue.
              </div>
            </div>
          </div>
          <button onClick={handleStartNewRound} className={styles.newRoundBtn}>
            <span>🔄</span> Start New Round
          </button>
        </div>
      )}

      {/* TWO INDEPENDENT SPINNER WHEELS */}
      <section className={styles.wheelsGrid}>
        {/* 🎯 QUESTION WHEEL */}
        <div className={styles.wheelCard}>
          <div className={styles.wheelHeader}>
            <div className={styles.wheelTitle}>
              <span style={{ fontSize: '1.4rem' }}>🎯</span>
              <span>Question Wheel</span>
            </div>
            <span className={styles.wheelBadge}>{questions.length} Questions</span>
          </div>

          <QuestionWheel
            questions={questions}
            onSpinEnd={handleQuestionSpinEnd}
            isSpinning={isQuestionSpinning}
            setIsSpinning={setIsQuestionSpinning}
            spinDuration={spinDuration}
            soundEnabled={soundEnabled}
          />
        </div>

        {/* 👨‍🎓 ROLL NUMBER WHEEL */}
        <div className={styles.wheelCard}>
          <div className={styles.wheelHeader}>
            <div className={styles.wheelTitle}>
              <span style={{ fontSize: '1.4rem' }}>👨‍🎓</span>
              <span>Roll Number Wheel</span>
            </div>
            <span
              className={styles.wheelBadge}
              style={{
                color: availableStudents.length === 0 ? '#EF4444' : '#38BDF8',
                fontWeight: '700',
              }}
            >
              {availableStudents.length} / {totalStudents} Remaining
            </span>
          </div>

          <StudentWheel
            totalStudents={totalStudents}
            usedStudents={usedStudents}
            onSpinEnd={handleStudentSpinEnd}
            isSpinning={isStudentSpinning}
            setIsSpinning={setIsStudentSpinning}
            spinDuration={spinDuration}
            soundEnabled={soundEnabled}
            onStartNewRound={handleStartNewRound}
          />
        </div>
      </section>

      {/* CURRENT RESULT SPOTLIGHT */}
      <ResultSpotlight
        currentStudent={currentStudent}
        currentQuestion={currentQuestion}
        onUndoStudent={handleUndoCurrentStudent}
        onRecordTurn={handleRecordTurn}
        canRecord={currentStudent !== null && currentQuestion !== null}
      />

      {/* BOTTOM SECTION: PARTICIPATION GRID + TURN HISTORY */}
      <section className={styles.bottomGrid}>
        <StudentGrid
          totalStudents={totalStudents}
          usedStudents={usedStudents}
          currentStudent={currentStudent}
          onToggleStudent={handleToggleStudent}
        />

        <TurnHistory
          history={history}
          onClearHistory={handleClearHistory}
          onUndoLastTurn={handleUndoLastTurn}
        />
      </section>

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        totalStudents={totalStudents}
        setTotalStudents={setTotalStudents}
        onGenerateStudents={handleGenerateStudents}
        onResetStudents={handleStartNewRound}
        questions={questions}
        setQuestions={setQuestions}
        spinDuration={spinDuration}
        setSpinDuration={setSpinDuration}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        confettiEnabled={confettiEnabled}
        setConfettiEnabled={setConfettiEnabled}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
