import React, { useState } from 'react';

export default function TurnHistory({
  history = [],
  onClearHistory,
  onUndoLastTurn,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyHistory = () => {
    if (history.length === 0) return;
    const text = history
      .map((item, idx) => `#${history.length - idx}  Roll ${item.roll}  →  ${item.questionText}`)
      .join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        background: 'var(--color-surface, #1e293b)',
        border: '1px solid var(--color-border, #334155)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>📋</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text, #f8fafc)' }}>
            Turn History ({history.length})
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {history.length > 0 && (
            <>
              <button
                onClick={handleCopyHistory}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#93C5FD',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                {copied ? '✅ Copied!' : '📋 Copy Log'}
              </button>

              <button
                onClick={onUndoLastTurn}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#FCD34D',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                ↩️ Undo Last
              </button>

              <button
                onClick={onClearHistory}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                🗑️ Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            color: 'var(--color-text-muted, #94a3b8)',
            fontSize: '0.95rem',
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '8px',
          }}
        >
          No turns recorded yet. Spin the wheels to begin!
        </div>
      ) : (
        <div
          style={{
            maxHeight: '260px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingRight: '4px',
          }}
        >
          {history.map((turn, idx) => {
            const turnNumber = history.length - idx;
            return (
              <div
                key={turn.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: idx === 0 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: idx === 0 ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#94A3B8',
                    minWidth: '32px',
                  }}
                >
                  #{turnNumber}
                </span>

                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '800',
                    color: '#60A5FA',
                    background: 'rgba(59, 130, 246, 0.2)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Roll {turn.roll}
                </span>

                <span
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text, #f8fafc)',
                    flex: 1,
                  }}
                >
                  {turn.questionText}
                </span>

                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted, #94a3b8)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {turn.time || ''}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
