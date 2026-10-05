import React from 'react';

export default function ResultSpotlight({
  currentStudent,
  currentQuestion,
  onUndoStudent,
  onRespinStudent,
  onRespinQuestion,
  onRecordTurn,
  canRecord = false,
}) {
  const hasStudent = currentStudent !== null;
  const hasQuestion = currentQuestion !== null;
  const isBothSelected = hasStudent && hasQuestion;

  return (
    <div
      style={{
        background: isBothSelected
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))'
          : 'var(--color-surface, #1e293b)',
        border: isBothSelected
          ? '2px solid rgba(168, 85, 247, 0.6)'
          : '1px solid var(--color-border, #334155)',
        borderRadius: '20px',
        padding: '24px 32px',
        boxShadow: isBothSelected
          ? '0 20px 40px -15px rgba(168, 85, 247, 0.35), 0 0 20px rgba(59, 130, 246, 0.15)'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌟</span>
          <span
            style={{
              fontSize: '1rem',
              fontWeight: '800',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: isBothSelected ? '#C084FC' : 'var(--color-text-muted, #94a3b8)',
            }}
          >
            {isBothSelected
              ? '🎯 READY FOR CLASSROOM RESPONSE'
              : hasStudent || hasQuestion
              ? '⚡ SELECTION IN PROGRESS'
              : '🎲 SPIN WHEELS TO BEGIN'}
          </span>
        </div>

        {hasStudent && (
          <button
            onClick={onUndoStudent}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#F87171',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Restore this student back to the available pool"
          >
            <span>↩️</span> Undo Student
          </button>
        )}
      </div>

      {/* Main Grid: Student on Left/Top, Question on Right/Bottom */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* Student Result Card */}
        <div
          style={{
            background: hasStudent
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.08))'
              : 'rgba(255, 255, 255, 0.03)',
            border: hasStudent
              ? '1px solid rgba(59, 130, 246, 0.5)'
              : '1px dashed rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '700',
              color: '#60A5FA',
            }}
          >
            👨‍🎓 SELECTED STUDENT
          </span>

          <div style={{ marginTop: '8px' }}>
            {hasStudent ? (
              <div
                style={{
                  fontSize: '2.4rem',
                  fontWeight: '900',
                  fontFamily: 'var(--font-display, sans-serif)',
                  color: '#93C5FD',
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                }}
              >
                ROLL NO. {currentStudent}
              </div>
            ) : (
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: 'var(--color-text-muted, #94a3b8)',
                  padding: '12px 0',
                }}
              >
                (Waiting for Student Spin)
              </div>
            )}
          </div>
        </div>

        {/* Question Result Card */}
        <div
          style={{
            background: hasQuestion
              ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.08))'
              : 'rgba(255, 255, 255, 0.03)',
            border: hasQuestion
              ? '1px solid rgba(236, 72, 153, 0.5)'
              : '1px dashed rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '700',
                color: '#F472B6',
              }}
            >
              🎯 SELECTED QUESTION
            </span>
            {hasQuestion && currentQuestion.category && (
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(236, 72, 153, 0.3)',
                  color: '#FBCFE8',
                  fontWeight: '600',
                }}
              >
                {currentQuestion.category}
              </span>
            )}
          </div>

          <div style={{ marginTop: '8px' }}>
            {hasQuestion ? (
              <div
                style={{
                  fontSize: '1.45rem',
                  fontWeight: '700',
                  lineHeight: '1.35',
                  color: '#FDE047',
                  textShadow: '0 0 15px rgba(253, 224, 71, 0.3)',
                }}
              >
                "{currentQuestion.text}"
              </div>
            ) : (
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: 'var(--color-text-muted, #94a3b8)',
                  padding: '12px 0',
                }}
              >
                (Waiting for Question Spin)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer for Recording Turn */}
      {isBothSelected && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            onClick={onRecordTurn}
            style={{
              padding: '12px 28px',
              fontSize: '1.1rem',
              fontWeight: '800',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✅</span> Mark Answered & Log Turn
          </button>
        </div>
      )}
    </div>
  );
}
