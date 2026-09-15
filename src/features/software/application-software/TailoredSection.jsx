import { useState } from 'react';
import { appAudio } from './appSoftwareAudio';
import { SCHOOL_BUILDER_FEATURES } from './appSoftwareData';
import styles from './ApplicationSoftwareSim.module.css';

export default function TailoredSection() {
  const [selectedFeatures, setSelectedFeatures] = useState(['students', 'attendance', 'marks']);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0); // 0 = idle, 1 = designing, 2 = building, 3 = finished

  const toggleFeature = (id) => {
    appAudio.playClick();
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setBuildStep(0);
  };

  const handleBuildSoftware = () => {
    if (isBuilding || selectedFeatures.length === 0) return;
    appAudio.playClick();
    setIsBuilding(true);
    setBuildStep(1); // Designing

    setTimeout(() => {
      setBuildStep(2); // Building
      setTimeout(() => {
        setBuildStep(3); // Finished
        setIsBuilding(false);
        appAudio.playBuildSound();
      }, 1000);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#8b5cf6' }}>
          🛠️ Tailored Software: Custom-Made for Specific Needs
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
          Tailored software is specially created by developers to match the unique rules and workflows of an organization or user.
        </p>
      </div>

      {/* 1. TAILOR / CLOTHING ANALOGY */}
      <div className={styles.tailorAnalogyBox}>
        {/* Left: Ready made */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 20px', textAlign: 'center', minWidth: '220px' }}>
          <div style={{ fontSize: '2.5rem' }}>👕 👕 👕</div>
          <strong style={{ fontSize: '1rem', color: '#3b82f6' }}>READY-MADE SHIRT</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            One size fits many people.<br />
            = <strong>Packaged Software</strong>
          </p>
        </div>

        <div style={{ fontSize: '1.8rem', color: 'var(--color-accent)' }}>VS</div>

        {/* Right: Custom Tailored */}
        <div style={{ background: 'var(--color-surface)', border: '2px solid #8b5cf6', borderRadius: '12px', padding: '16px 20px', textAlign: 'center', minWidth: '220px' }}>
          <div style={{ fontSize: '2.5rem' }}>🧵 ✂️ 👔</div>
          <strong style={{ fontSize: '1rem', color: '#8b5cf6' }}>TAILOR-MADE SHIRT</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Sewn to your exact size &amp; style.<br />
            = <strong>Tailored Software</strong>
          </p>
        </div>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
        💡 Notice: The tailor analogy is to help us visualize custom-making. Software is coded by developers, not sewn!
      </div>

      {/* 2. MAIN INTERACTIVE ACTIVITY: BUILD YOUR SCHOOL SOFTWARE */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
            🛠️ Interactive Activity: Build Your School Software
          </h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Imagine you are designing software for your school. Pick the custom modules your school needs!
          </p>
        </div>

        <div className={styles.schoolBuilderGrid}>
          {/* Left: Requirements Selection */}
          <div className={styles.featureSelectorPanel}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
              1. SELECT SCHOOL REQUIREMENTS:
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SCHOOL_BUILDER_FEATURES.map((feature) => {
                const isChecked = selectedFeatures.includes(feature.id);
                return (
                  <div
                    key={feature.id}
                    className={`${styles.featureCheckboxItem} ${isChecked ? styles.featureCheckboxItemActive : ''}`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Controlled via div click
                      style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '1.4rem' }}>{feature.icon}</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{feature.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{feature.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleBuildSoftware}
              disabled={isBuilding || selectedFeatures.length === 0}
              style={{ marginTop: '8px' }}
            >
              <span>{isBuilding ? '⚙️ Building Custom App...' : '🚀 Build Custom School Software'}</span>
            </button>
          </div>

          {/* Right: Live Preview of Custom Tailored App */}
          <div className={styles.liveAppPreview}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🏫</span>
                <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>MY SCHOOL SOFTWARE</strong>
              </div>
              <span style={{ fontSize: '0.7rem', background: '#8b5cf6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                Tailored
              </span>
            </div>

            {buildStep === 1 && (
              <div style={{ margin: 'auto', textAlign: 'center', color: '#f59e0b' }}>
                <div style={{ fontSize: '2.5rem', animation: 'spin 1s infinite linear' }}>📐</div>
                <strong>Step 1: Designing Custom Architecture...</strong>
              </div>
            )}

            {buildStep === 2 && (
              <div style={{ margin: 'auto', textAlign: 'center', color: '#38bdf8' }}>
                <div style={{ fontSize: '2.5rem' }}>💻 ⚙️</div>
                <strong>Step 2: Coding School Modules...</strong>
              </div>
            )}

            {(buildStep === 0 || buildStep === 3) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  ACTIVE CUSTOM MODULES ({selectedFeatures.length} selected):
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {selectedFeatures.map((id) => {
                    const f = SCHOOL_BUILDER_FEATURES.find((x) => x.id === id);
                    if (!f) return null;
                    return (
                      <div
                        key={id}
                        style={{
                          background: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{f.icon}</span>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{f.name}</div>
                      </div>
                    );
                  })}
                </div>

                {selectedFeatures.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#64748b', margin: 'auto', fontStyle: 'italic' }}>
                    Select at least 1 feature on the left to preview your tailored software!
                  </div>
                )}
              </div>
            )}

            {buildStep === 3 && (
              <div style={{ marginTop: 'auto', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', padding: '10px', borderRadius: '8px', color: '#34d399', fontSize: '0.85rem', textAlign: 'center', fontWeight: 'bold' }}>
                🎉 Success! Custom School Software built specifically according to your requirements!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
