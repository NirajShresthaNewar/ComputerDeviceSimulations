import { useState } from 'react';
import { appAudio } from './appSoftwareAudio';
import { REAL_APPLICATIONS } from './appSoftwareData';
import styles from './ApplicationSoftwareSim.module.css';

export default function OverviewSection() {
  const [selectedAppId, setSelectedAppId] = useState('word');

  const selectedApp = REAL_APPLICATIONS.find((a) => a.id === selectedAppId) || REAL_APPLICATIONS[0];

  const handleSelectApp = (id) => {
    appAudio.playCardSelect();
    setSelectedAppId(id);
  };

  return (
    <div className={styles.overviewStage}>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--color-text)' }}>
          💻 What is Application Software?
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
          Application software comes in two main types depending on how it is designed.
        </p>
      </div>

      {/* 1. CENTRAL HIERARCHY DIAGRAM */}
      <div className={styles.hierarchyDiagram}>
        <div style={{ background: 'var(--color-surface-raised)', padding: '12px 24px', borderRadius: '12px', border: '2px solid var(--color-accent)', textAlign: 'center' }}>
          <span style={{ fontSize: '1.8rem' }}>💻</span>
          <div style={{ fontWeight: 'bold', color: 'var(--color-text)', fontSize: '1.1rem' }}>
            APPLICATION SOFTWARE
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Helps users do specific tasks</span>
        </div>

        <div style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>│<br />┌───────────┴───────────┐</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', maxWidth: '720px' }}>
          {/* Packaged Card */}
          <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: '12px', border: '2px solid #3b82f6', textAlign: 'center' }}>
            <span style={{ fontSize: '2.2rem' }}>📦</span>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: '#3b82f6' }}>
              PACKAGED SOFTWARE
            </strong>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Ready-made software designed for <strong>many users</strong> with general needs.
            </p>
          </div>

          {/* Tailored Card */}
          <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: '12px', border: '2px solid #8b5cf6', textAlign: 'center' }}>
            <span style={{ fontSize: '2.2rem' }}>🛠️</span>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: '#8b5cf6' }}>
              TAILORED SOFTWARE
            </strong>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Software specially designed according to the needs of a <strong>particular organization</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 2. EXPLORE REAL APPLICATIONS & MULTI-USER CONCEPT */}
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--color-text)' }}>
          🔍 Click an Application to See Who Uses It:
        </h4>

        {/* App selector buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {REAL_APPLICATIONS.map((app) => (
            <button
              key={app.id}
              type="button"
              className={`${styles.secondaryBtn} ${selectedAppId === app.id ? styles.primaryBtn : ''}`}
              onClick={() => handleSelectApp(app.id)}
            >
              <span>{app.icon}</span>
              <span>{app.name}</span>
            </button>
          ))}
        </div>

        {/* Multi-user illustration container */}
        <div className={styles.multiUserBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '2rem' }}>{selectedApp.icon}</span>
              <div>
                <strong style={{ fontSize: '1.2rem', color: 'var(--color-text)' }}>
                  {selectedApp.name}
                </strong>
                <span style={{ marginLeft: '10px', fontSize: '0.75rem', background: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
                  {selectedApp.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Used for list */}
          <div style={{ background: 'var(--color-bg)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>COMMON USES:</span>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', color: 'var(--color-text)', fontSize: '0.85rem' }}>
              {selectedApp.usedFor.map((use, i) => (
                <li key={i}>{use}</li>
              ))}
            </ul>
          </div>

          {/* Many users diagram */}
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
              MANY DIFFERENT PEOPLE USE THIS EXACT SAME READY-MADE APP:
            </span>
            <div className={styles.usersRow} style={{ marginTop: '10px' }}>
              {selectedApp.users.map((user, idx) => (
                <div key={idx} className={styles.userCardItem}>
                  <div style={{ fontSize: '2rem' }}>{user.icon}</div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{user.role}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {user.useCase}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 'bold', fontSize: '0.95rem', background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '6px' }}>
            💡 “The same ready-made software is packaged for thousands of different people to use!”
          </div>
        </div>
      </div>
    </div>
  );
}
