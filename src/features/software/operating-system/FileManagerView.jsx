import { useState } from 'react';
import { osAudio } from './osAudio';
import { INITIAL_FILES, FOLDERS } from './osData';
import styles from './OperatingSystemSim.module.css';

export default function FileManagerView() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolderView, setActiveFolderView] = useState('inbox'); // 'inbox' | folderId

  const handleSelectFile = (id) => {
    osAudio.playClick();
    setSelectedFileId((prev) => (prev === id ? null : id));
  };

  const handleMoveToFolder = (targetFolderId) => {
    if (!selectedFileId) return;

    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === selectedFileId) {
          return { ...f, currentFolder: targetFolderId };
        }
        return f;
      })
    );

    const file = files.find((f) => f.id === selectedFileId);
    if (file && file.targetFolder === targetFolderId) {
      osAudio.playFileOrganized();
    } else {
      osAudio.playClick();
    }

    setSelectedFileId(null);
  };

  const handleResetFiles = () => {
    osAudio.playClick();
    setFiles(INITIAL_FILES);
    setSelectedFileId(null);
  };

  const unorganizedCount = files.filter((f) => f.currentFolder === 'inbox').length;
  const correctlyOrganizedCount = files.filter(
    (f) => f.currentFolder === f.targetFolder
  ).length;

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
            📁 File Management: &quot;Organize Your Computer&quot;
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            The Operating System helps create, organize, find, open, move, and delete files & folders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleResetFiles}
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            🔄 Reset Files
          </button>
        </div>
      </div>

      {/* Challenge Progress Banner */}
      <div
        style={{
          background: correctlyOrganizedCount === files.length
            ? 'rgba(16, 185, 129, 0.12)'
            : 'rgba(59, 130, 246, 0.12)',
          borderLeft: `4px solid ${correctlyOrganizedCount === files.length ? '#10b981' : '#3b82f6'}`,
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
          <strong>Challenge:</strong> Select a file from the Inbox and click the matching folder to organize it!
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: correctlyOrganizedCount === files.length ? '#10b981' : 'var(--color-accent)' }}>
          {correctlyOrganizedCount === files.length
            ? '🎉 All 6 Files Perfectly Organized!'
            : `${correctlyOrganizedCount} of ${files.length} Files Organized`}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '1.1rem' }}>🔍</span>
        <input
          type="text"
          placeholder="Search files (e.g. Homework, Song, Photo)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* MAIN FILE CABINET GRID */}
      <div className={styles.fileCabinetGrid}>
        {/* LEFT: UNORGANIZED INBOX */}
        <div className={styles.inboxBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>📥 Inbox (Unsorted)</strong>
            <span style={{ fontSize: '0.75rem', background: 'var(--color-bg)', padding: '2px 8px', borderRadius: '10px', color: 'var(--color-text-muted)' }}>
              {unorganizedCount} left
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '180px' }}>
            {filteredFiles.filter((f) => f.currentFolder === 'inbox').map((file) => {
              const isSelected = selectedFileId === file.id;
              return (
                <button
                  key={file.id}
                  type="button"
                  className={`${styles.fileChip} ${isSelected ? styles.fileChipSelected : ''}`}
                  onClick={() => handleSelectFile(file.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{file.icon}</span>
                    <span>{file.name}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                    {isSelected ? '✓ Ready to move' : 'Select'}
                  </span>
                </button>
              );
            })}

            {filteredFiles.filter((f) => f.currentFolder === 'inbox').length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 'auto' }}>
                🎉 Inbox is empty! All files are in folders.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: TARGET FOLDERS */}
        <div className={styles.foldersContainer}>
          {FOLDERS.map((folder) => {
            const folderFiles = filteredFiles.filter((f) => f.currentFolder === folder.id);
            return (
              <div
                key={folder.id}
                className={styles.folderTargetCard}
                onClick={() => handleMoveToFolder(folder.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{folder.icon}</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>{folder.name}</strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {folderFiles.length} {folderFiles.length === 1 ? 'file' : 'files'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {folderFiles.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        padding: '6px 10px',
                        background: 'var(--color-surface)',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <span>{f.icon} {f.name}</span>
                      <span style={{ color: '#10b981', fontSize: '0.75rem' }}>✓</span>
                    </div>
                  ))}

                  {folderFiles.length === 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '12px 0' }}>
                      {selectedFileId ? '➔ Click here to move selected file' : 'Empty folder'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
