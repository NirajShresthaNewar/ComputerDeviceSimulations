import React from 'react';

export default function StudentGrid({
  totalStudents = 26,
  usedStudents = [],
  currentStudent = null,
  onToggleStudent,
}) {
  const students = Array.from({ length: totalStudents }, (_, i) => i + 1);
  const completedCount = usedStudents.length;
  const remainingCount = Math.max(0, totalStudents - completedCount);
  const percentComplete = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;

  return (
    <div
      style={{
        background: 'var(--color-surface, #1e293b)',
        border: '1px solid var(--color-border, #334155)',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      {/* Header & Stats */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>👨‍🎓</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text, #f8fafc)' }}>
            Class Participation Status
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.95rem' }}>
          <div>
            <span style={{ color: 'var(--color-text-muted, #94a3b8)' }}>Completed: </span>
            <strong style={{ color: '#10B981' }}>{completedCount}</strong> / {totalStudents}
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted, #94a3b8)' }}>Remaining: </span>
            <strong style={{ color: '#38BDF8' }}>{remainingCount}</strong>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentComplete}%`,
            background: 'linear-gradient(90deg, #3B82F6, #10B981)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Roll Number Badges Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
          gap: '8px',
        }}
      >
        {students.map((roll) => {
          const isUsed = usedStudents.includes(roll);
          const isCurrent = currentStudent === roll;

          return (
            <button
              key={roll}
              onClick={() => onToggleStudent && onToggleStudent(roll)}
              title={
                isUsed
                  ? `Roll ${roll}: Completed (Click to toggle)`
                  : `Roll ${roll}: Available (Click to toggle)`
              }
              style={{
                height: '42px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '700',
                border: isCurrent
                  ? '2px solid #FDE047'
                  : isUsed
                  ? '1px solid rgba(255, 255, 255, 0.08)'
                  : '1px solid rgba(59, 130, 246, 0.4)',
                background: isCurrent
                  ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                  : isUsed
                  ? 'rgba(51, 65, 85, 0.6)'
                  : 'rgba(59, 130, 246, 0.15)',
                color: isCurrent
                  ? '#ffffff'
                  : isUsed
                  ? 'rgba(148, 163, 184, 0.6)'
                  : '#93C5FD',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: isUsed ? 'line-through' : 'none',
                boxShadow: isCurrent ? '0 0 12px rgba(245, 158, 11, 0.6)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {roll}
            </button>
          );
        })}
      </div>
    </div>
  );
}
