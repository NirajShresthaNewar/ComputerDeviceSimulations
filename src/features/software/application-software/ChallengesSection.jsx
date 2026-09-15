import { useState } from 'react';
import { appAudio } from './appSoftwareAudio';
import { SORTING_ITEMS, ADVISOR_SCENARIOS } from './appSoftwareData';
import styles from './ApplicationSoftwareSim.module.css';

export default function ChallengesSection() {
  // Activity 1: Sorting state
  const [selectedSortItem, setSelectedSortItem] = useState(null);
  const [sortedMap, setSortedMap] = useState({}); // { itemId: 'packaged' | 'tailored' }
  const [sortFeedback, setSortFeedback] = useState(null);

  // Activity 2: Advisor state
  const [advisorIdx, setAdvisorIdx] = useState(0);
  const [advisorChoice, setAdvisorChoice] = useState(null);
  const [advisorAnswered, setAdvisorAnswered] = useState(false);
  const [advisorScore, setAdvisorScore] = useState(0);

  /* --- Sorting Game Logic --- */
  const handleSelectSortItem = (item) => {
    appAudio.playClick();
    setSelectedSortItem(item);
    setSortFeedback(null);
  };

  const handleDropTo = (zoneType) => {
    if (!selectedSortItem) return;

    const isCorrect = selectedSortItem.type === zoneType;
    if (isCorrect) {
      appAudio.playSuccess();
      setSortedMap((prev) => ({ ...prev, [selectedSortItem.id]: zoneType }));
      setSortFeedback({
        isCorrect: true,
        text: `✅ Correct! ${selectedSortItem.name} is ${zoneType === 'packaged' ? 'Packaged (Ready-Made)' : 'Tailored (Custom-Made)'}. ${selectedSortItem.desc}.`,
      });
    } else {
      appAudio.playRetry();
      setSortFeedback({
        isCorrect: false,
        text: `❌ Try again! ${selectedSortItem.name} is designed for ${selectedSortItem.type === 'packaged' ? 'many general users' : 'a specific organization’s requirements'}.`,
      });
    }

    setSelectedSortItem(null);
  };

  const handleResetSorting = () => {
    appAudio.playClick();
    setSelectedSortItem(null);
    setSortedMap({});
    setSortFeedback(null);
  };

  /* --- Advisor Game Logic --- */
  const currentAdvisorScenario = ADVISOR_SCENARIOS[advisorIdx];

  const handleAdvisorChoice = (type) => {
    if (advisorAnswered) return;
    setAdvisorChoice(type);
    setAdvisorAnswered(true);

    const isCorrect = type === currentAdvisorScenario.correctType;
    if (isCorrect) {
      appAudio.playSuccess();
      setAdvisorScore((prev) => prev + 1);
    } else {
      appAudio.playRetry();
    }
  };

  const handleNextAdvisor = () => {
    appAudio.playClick();
    setAdvisorChoice(null);
    setAdvisorAnswered(false);
    setAdvisorIdx((prev) => (prev + 1) % ADVISOR_SCENARIOS.length);
  };

  const sortedCount = Object.keys(sortedMap).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* ========================================================
          ACTIVITY 1: PACKAGED OR TAILORED SORTING GAME
          ======================================================== */}
      <div className={styles.sortingContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
              🎮 Activity 1: Packaged or Tailored Sorting Game
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Click an item from the pool, then click the correct category box!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Sorted: <strong>{sortedCount} / {SORTING_ITEMS.length}</strong>
            </span>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleResetSorting}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Unsorted Items Pool */}
        <div style={{ background: 'var(--color-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>
            CLICK AN APPLICATION TO SORT:
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
            {SORTING_ITEMS.map((item) => {
              const isAlreadySorted = Boolean(sortedMap[item.id]);
              const isSelected = selectedSortItem?.id === item.id;
              if (isAlreadySorted) return null;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSortItem(item)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: isSelected ? 'rgba(61, 220, 151, 0.15)' : 'var(--color-surface)',
                    color: isSelected ? 'var(--color-accent)' : 'var(--color-text)',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}

            {sortedCount === SORTING_ITEMS.length && (
              <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>
                🎉 All applications sorted perfectly!
              </div>
            )}
          </div>
        </div>

        {/* Drop Zones */}
        <div className={styles.dropZonesRow}>
          {/* Packaged Drop Zone */}
          <div
            className={styles.dropZoneBox}
            onClick={() => handleDropTo('packaged')}
            style={{ borderColor: '#3b82f6' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem' }}>📦</span>
              <strong style={{ color: '#3b82f6', fontSize: '1.05rem' }}>PACKAGED SOFTWARE</strong>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {selectedSortItem ? '➔ Click here if Ready-Made' : 'Ready-made for many users'}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {SORTING_ITEMS.filter((item) => sortedMap[item.id] === 'packaged').map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--color-surface)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{item.icon} {item.name}</span>
                  <span style={{ color: '#10b981' }}>✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tailored Drop Zone */}
          <div
            className={styles.dropZoneBox}
            onClick={() => handleDropTo('tailored')}
            style={{ borderColor: '#8b5cf6' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem' }}>🛠️</span>
              <strong style={{ color: '#8b5cf6', fontSize: '1.05rem' }}>TAILORED SOFTWARE</strong>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {selectedSortItem ? '➔ Click here if Custom-Made' : 'Custom-made for specific needs'}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {SORTING_ITEMS.filter((item) => sortedMap[item.id] === 'tailored').map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--color-surface)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{item.icon} {item.name}</span>
                  <span style={{ color: '#10b981' }}>✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {sortFeedback && (
          <div
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: sortFeedback.isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              borderLeft: `4px solid ${sortFeedback.isCorrect ? '#10b981' : '#ef4444'}`,
              color: 'var(--color-text)',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            {sortFeedback.text}
          </div>
        )}
      </div>

      {/* ========================================================
          ACTIVITY 2: BECOME A SOFTWARE ADVISOR!
          ======================================================== */}
      <div className={styles.advisorCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
              🏆 Activity 2: Become a Software Advisor!
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Read the client&apos;s need and advise them on whether they need Packaged or Tailored software.
            </p>
          </div>

          <span style={{ fontSize: '0.85rem', background: 'var(--color-accent)', color: '#0b0e14', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px' }}>
            Client {advisorIdx + 1} of {ADVISOR_SCENARIOS.length}
          </span>
        </div>

        {/* Client Scenario Card */}
        <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '3rem' }}>{currentAdvisorScenario.clientIcon}</span>
          <div>
            <strong style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>
              Client: {currentAdvisorScenario.client}
            </strong>
            <div style={{ fontSize: '1.05rem', color: 'var(--color-text)', fontWeight: 'bold', marginTop: '4px' }}>
              {currentAdvisorScenario.need}
            </div>
          </div>
        </div>

        {/* Advisor Choice Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            type="button"
            className={`${styles.secondaryBtn} ${
              advisorChoice === 'packaged'
                ? currentAdvisorScenario.correctType === 'packaged'
                  ? styles.primaryBtn
                  : ''
                : ''
            }`}
            onClick={() => handleAdvisorChoice('packaged')}
            disabled={advisorAnswered}
            style={{ padding: '16px', fontSize: '1rem', fontWeight: 'bold' }}
          >
            <span>📦 Recommend PACKAGED Software</span>
          </button>

          <button
            type="button"
            className={`${styles.secondaryBtn} ${
              advisorChoice === 'tailored'
                ? currentAdvisorScenario.correctType === 'tailored'
                  ? styles.primaryBtn
                  : ''
                : ''
            }`}
            onClick={() => handleAdvisorChoice('tailored')}
            disabled={advisorAnswered}
            style={{ padding: '16px', fontSize: '1rem', fontWeight: 'bold' }}
          >
            <span>🛠️ Recommend TAILORED Software</span>
          </button>
        </div>

        {/* Feedback & Next Client */}
        {advisorAnswered && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              background: advisorChoice === currentAdvisorScenario.correctType
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(239, 68, 68, 0.12)',
              borderLeft: `4px solid ${
                advisorChoice === currentAdvisorScenario.correctType ? '#10b981' : '#ef4444'
              }`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <strong>
                {advisorChoice === currentAdvisorScenario.correctType
                  ? '🎉 Great Advice!'
                  : '❌ Not Quite!'}
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginTop: '2px' }}>
                {currentAdvisorScenario.reason}
              </div>
            </div>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleNextAdvisor}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <span>Next Client ➔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
