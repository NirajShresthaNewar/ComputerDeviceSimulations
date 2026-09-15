import { useState } from 'react';
import { osAudio } from './osAudio';
import { SECURITY_USERS, SECURITY_FOLDERS } from './osData';
import styles from './OperatingSystemSim.module.css';

export default function SecurityManagerView() {
  const [activeUser, setActiveUser] = useState(null); // null = locked, or user object
  const [selectedUserKey, setSelectedUserKey] = useState('student');
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeFolderModal, setActiveFolderModal] = useState(null);
  const [permissionAlert, setPermissionAlert] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = SECURITY_USERS.find((u) => u.id === selectedUserKey);
    if (user && user.password === inputPassword.trim()) {
      osAudio.playSuccessFanfare();
      setActiveUser(user);
      setLoginError(false);
      setInputPassword('');
      setPermissionAlert(null);
    } else {
      osAudio.playAccessDenied();
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    osAudio.playClick();
    setActiveUser(null);
    setActiveFolderModal(null);
    setPermissionAlert(null);
    setInputPassword('');
  };

  const handleOpenFolder = (folder) => {
    if (!activeUser) return;

    if (folder.requiresTeacher && activeUser.role === 'Student') {
      osAudio.playAccessDenied();
      setPermissionAlert({
        folderName: folder.name,
        message: '🚫 Permission Denied! Only teachers can access confidential exam files.',
      });
      setActiveFolderModal(null);
    } else {
      osAudio.playClick();
      setPermissionAlert(null);
      setActiveFolderModal(folder);
    }
  };

  return (
    <div className={styles.securityCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
            🔐 Privacy &amp; Security: &quot;Protect the Computer&quot;
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            The Operating System protects data with passwords and controls which users can open specific files.
          </p>
        </div>

        {activeUser && (
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleLogout}
          >
            🔒 Lock &amp; Switch User
          </button>
        )}
      </div>

      {/* 1. LOGIN SCREEN (When locked) */}
      {!activeUser ? (
        <div className={styles.loginBox}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔒</div>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)' }}>Computer Locked</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Choose a user profile and type the password to log in.
            </p>
          </div>

          {/* User selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {SECURITY_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                className={`${styles.secondaryBtn} ${selectedUserKey === user.id ? styles.primaryBtn : ''}`}
                onClick={() => {
                  osAudio.playClick();
                  setSelectedUserKey(user.id);
                  setInputPassword(user.id === 'student' ? '123' : 'abc');
                  setLoginError(false);
                }}
                style={{ padding: '10px' }}
              >
                <span>{user.icon}</span>
                <span style={{ fontSize: '0.85rem' }}>{user.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Password hint: (Student: <code>123</code> | Teacher: <code>abc</code>)
              </label>
              <input
                type="text"
                placeholder="Enter password..."
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${loginError ? '#ef4444' : 'var(--color-border)'}`,
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            {loginError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold' }}>
                ❌ Incorrect password! Please try again.
              </div>
            )}

            <button type="submit" className={styles.primaryBtn} style={{ width: '100%' }}>
              🔓 Log In as {selectedUserKey === 'student' ? 'Student' : 'Teacher'}
            </button>
          </form>
        </div>
      ) : (
        /* 2. LOGGED IN DASHBOARD */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* User Session Banner */}
          <div
            style={{
              background: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2.2rem' }}>{activeUser.icon}</span>
              <div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--color-text)' }}>
                  Logged in as: {activeUser.name}
                </strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>
                  Role: {activeUser.role}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              🔒 OS Permission Protection Active
            </div>
          </div>

          {/* Permission Alert if access denied */}
          {permissionAlert && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                borderLeft: '4px solid #ef4444',
                borderRadius: '8px',
                padding: '12px 18px',
                color: '#ef4444',
                fontSize: '0.95rem',
                fontWeight: 'bold',
              }}
            >
              {permissionAlert.message}
            </div>
          )}

          {/* Folders List */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-text)' }}>
              Click folders to test user permission access:
            </h4>
            <div className={styles.securityFoldersList}>
              {SECURITY_FOLDERS.map((folder) => {
                const isRestricted = folder.requiresTeacher && activeUser.role === 'Student';
                return (
                  <div
                    key={folder.id}
                    className={styles.secFolderItem}
                    onClick={() => handleOpenFolder(folder)}
                    style={{
                      borderLeft: isRestricted ? '4px solid #ef4444' : '4px solid #10b981',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.8rem' }}>{folder.icon}</span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: isRestricted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isRestricted ? '#ef4444' : '#10b981',
                        }}
                      >
                        {isRestricted ? '🔒 Protected' : '🔓 Allowed'}
                      </span>
                    </div>

                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>
                      {folder.name}
                    </strong>

                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {folder.files.length} documents inside
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Opened Folder Content Modal */}
          {activeFolderModal && (
            <div
              style={{
                background: 'var(--color-bg)',
                border: '2px solid var(--color-accent)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--color-accent)' }}>
                  📁 {activeFolderModal.name} (Access Granted)
                </strong>
                <button
                  type="button"
                  onClick={() => setActiveFolderModal(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                >
                  ✕ Close
                </button>
              </div>

              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                {activeFolderModal.files.map((file, i) => (
                  <li key={i} style={{ margin: '4px 0' }}>📄 {file}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
