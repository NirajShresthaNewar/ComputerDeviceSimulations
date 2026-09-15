import styles from './ApplicationSoftwareSim.module.css';

export default function ComparisonSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--color-text)' }}>
          📊 Packaged vs. Tailored Software: Side-by-Side Comparison
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
          Let us compare both types of application software to clearly see the differences.
        </p>
      </div>

      {/* 1. SIDE-BY-SIDE COLUMNS */}
      <div className={styles.comparisonGrid}>
        {/* Packaged Column */}
        <div className={`${styles.compareColumn} ${styles.comparePackaged}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2.5rem' }}>📦</span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#3b82f6' }}>Packaged Software</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Off-the-shelf / Ready-made</span>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
            <strong>💡 Meaning:</strong>
            <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-muted)' }}>
              Ready-made software designed for <strong>many users</strong> with common/general needs.
            </p>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
            <strong>✨ Key Features:</strong>
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              <li>Ready to install and use immediately</li>
              <li>Shared by thousands of different people</li>
              <li>Developed for general everyday tasks</li>
              <li>Costs less because many people buy it</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong style={{ color: '#3b82f6' }}>Examples:</strong> 📝 Word Processor, 📊 Spreadsheet, 🎨 Paint App, 🌐 Browser
          </div>
        </div>

        {/* Tailored Column */}
        <div className={`${styles.compareColumn} ${styles.compareTailored}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2.5rem' }}>🛠️</span>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#8b5cf6' }}>Tailored Software</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Custom-made / Bespoke</span>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
            <strong>💡 Meaning:</strong>
            <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-muted)' }}>
              Software specially designed according to the needs of a <strong>particular user or organization</strong>.
            </p>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
            <strong>✨ Key Features:</strong>
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              <li>Built from custom requirements &amp; rules</li>
              <li>Made specifically for one client&apos;s workflow</li>
              <li>Takes time to design and develop</li>
              <li>Matches exact specialized needs</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong style={{ color: '#8b5cf6' }}>Examples:</strong> 🏫 School Management System, 🏥 Hospital Patient System, 🏦 Custom Bank App
          </div>
        </div>
      </div>

      {/* 2. MEMORY TRICK CARD */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '2px solid var(--color-accent)',
          borderRadius: '14px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
        }}
      >
        <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--color-text)' }}>
          ⭐ Simple Memory Trick for Class 5
        </h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginTop: '12px' }}>
          <div style={{ background: 'var(--color-surface-raised)', padding: '12px 24px', borderRadius: '10px', border: '1px solid #3b82f6' }}>
            <span style={{ fontSize: '1.8rem' }}>📦</span>
            <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '1.1rem' }}>Packaged Software</div>
            <div style={{ color: '#10b981', fontWeight: 'bold' }}>= READY-MADE</div>
          </div>

          <div style={{ background: 'var(--color-surface-raised)', padding: '12px 24px', borderRadius: '10px', border: '1px solid #8b5cf6' }}>
            <span style={{ fontSize: '1.8rem' }}>🛠️</span>
            <div style={{ fontWeight: 'bold', color: '#8b5cf6', fontSize: '1.1rem' }}>Tailored Software</div>
            <div style={{ color: '#10b981', fontWeight: 'bold' }}>= CUSTOM-MADE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
