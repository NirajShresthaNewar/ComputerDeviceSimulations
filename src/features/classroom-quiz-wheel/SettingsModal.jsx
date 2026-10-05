import React, { useState } from 'react';
import { DEFAULT_QUESTIONS } from './defaultQuestions';

export default function SettingsModal({
  isOpen,
  onClose,
  totalStudents,
  setTotalStudents,
  onGenerateStudents,
  onResetStudents,
  questions,
  setQuestions,
  spinDuration,
  setSpinDuration,
  soundEnabled,
  setSoundEnabled,
  confettiEnabled,
  setConfettiEnabled,
  onResetAll,
}) {
  const [activeTab, setActiveTab] = useState('students');
  const [tempStudentCount, setTempStudentCount] = useState(totalStudents);

  // New question form state
  const [newText, setNewText] = useState('');
  const [newShortText, setNewShortText] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  // Edit question state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editShortText, setEditShortText] = useState('');
  const [editCategory, setEditCategory] = useState('');

  if (!isOpen) return null;

  const handleApplyStudentCount = () => {
    const count = parseInt(tempStudentCount, 10);
    if (isNaN(count) || count < 2) {
      alert('Please enter a valid number of students (minimum 2).');
      return;
    }
    if (count > 100) {
      alert('Maximum 100 students supported.');
      return;
    }
    onGenerateStudents(count);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newItem = {
      id: `q_${Date.now()}`,
      text: newText.trim(),
      shortText: newShortText.trim() || newText.trim(),
      category: newCategory.trim() || 'General',
    };

    setQuestions([...questions, newItem]);
    setNewText('');
    setNewShortText('');
  };

  const handleStartEdit = (q) => {
    setEditingId(q.id);
    setEditText(q.text);
    setEditShortText(q.shortText || q.text);
    setEditCategory(q.category || 'General');
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              text: editText.trim(),
              shortText: editShortText.trim() || editText.trim(),
              category: editCategory.trim() || 'General',
            }
          : q
      )
    );
    setEditingId(null);
  };

  const handleDeleteQuestion = (id) => {
    if (questions.length <= 2) {
      alert('You must have at least 2 questions in the wheel.');
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleResetQuestions = () => {
    if (window.confirm('Reset questions back to the 17 default computer syllabus questions?')) {
      setQuestions(DEFAULT_QUESTIONS);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-surface, #1e293b)',
          border: '1px solid var(--color-border, #334155)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border, #334155)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚙️</span>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-text, #f8fafc)' }}>
              Quiz Wheel Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border, #334155)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          {[
            { id: 'students', label: '👨‍🎓 Students' },
            { id: 'questions', label: `🎯 Questions (${questions.length})` },
            { id: 'game', label: '🎮 Sound & Physics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--color-surface, #1e293b)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-accent, #38BDF8)' : 'var(--color-text-muted, #94a3b8)',
                fontWeight: activeTab === tab.id ? '700' : '500',
                borderBottom: activeTab === tab.id ? '3px solid var(--color-accent, #38BDF8)' : 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* TAB 1: STUDENTS */}
          {activeTab === 'students' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text, #f8fafc)' }}>
                  Number of Students in Class:
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="number"
                    min="2"
                    max="100"
                    value={tempStudentCount}
                    onChange={(e) => setTempStudentCount(e.target.value)}
                    style={{
                      width: '120px',
                      padding: '10px 14px',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #334155)',
                      background: 'rgba(0,0,0,0.3)',
                      color: '#ffffff',
                    }}
                  />
                  <button
                    onClick={handleApplyStudentCount}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      background: '#3B82F6',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    Generate Roll Numbers (1–{tempStudentCount})
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #94a3b8)', display: 'block', marginBottom: '6px' }}>
                  Quick Presets:
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[15, 20, 26, 30, 40, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setTempStudentCount(num);
                        onGenerateStudents(num);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        background: totalStudents === num ? '#3B82F6' : 'rgba(255,255,255,0.08)',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <hr style={{ borderColor: 'var(--color-border, #334155)', margin: '4px 0' }} />

              <div>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all completed student turns and restart round?')) {
                      onResetStudents();
                    }
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#FCD34D',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🔄 Reset Current Student Round
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTIONS */}
          {activeTab === 'questions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Add New Question Form */}
              <form
                onSubmit={handleAddQuestion}
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border, #334155)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#38BDF8' }}>
                  ➕ Add New Question
                </div>
                <input
                  type="text"
                  placeholder="Full Question (e.g., What is an Operating System?)"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border, #334155)',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#ffffff',
                  }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Short Wheel Label (optional)"
                    value={newShortText}
                    onChange={(e) => setNewShortText(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #334155)',
                      background: 'rgba(0,0,0,0.3)',
                      color: '#ffffff',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{
                      width: '140px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border, #334155)',
                      background: 'rgba(0,0,0,0.3)',
                      color: '#ffffff',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#10B981',
                    color: '#ffffff',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Add Question to Bank
                </button>
              </form>

              {/* Questions List */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: 'var(--color-text, #f8fafc)' }}>
                  Question Bank ({questions.length} Items)
                </span>
                <button
                  onClick={handleResetQuestions}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#F87171',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Reset to Default 17 Questions
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--color-border, #334155)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontWeight: '700', color: '#94a3b8', minWidth: '24px' }}>
                      {idx + 1}.
                    </span>

                    {editingId === q.id ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          style={{
                            padding: '6px',
                            borderRadius: '4px',
                            border: '1px solid #38BDF8',
                            background: '#0f172a',
                            color: '#fff',
                          }}
                        />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="Short label"
                            value={editShortText}
                            onChange={(e) => setEditShortText(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '4px 6px',
                              borderRadius: '4px',
                              border: '1px solid #334155',
                              background: '#0f172a',
                              color: '#fff',
                              fontSize: '0.85rem',
                            }}
                          />
                          <button
                            onClick={() => handleSaveEdit(q.id)}
                            style={{
                              padding: '4px 10px',
                              background: '#10B981',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: '600',
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              padding: '4px 8px',
                              background: '#64748b',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'var(--color-text, #f8fafc)', fontSize: '0.9rem' }}>
                            {q.text}
                          </div>
                          {q.shortText && q.shortText !== q.text && (
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              Slice label: {q.shortText}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleStartEdit(q)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#38BDF8',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GAME & SOUND SETTINGS */}
          {activeTab === 'game' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Sound Toggle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--color-text, #f8fafc)' }}>
                    🔊 Sound Effects & Fanfares
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)' }}>
                    Ticking pegs, wheel whoosh, and victory melodies
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                />
              </div>

              {/* Confetti Toggle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--color-text, #f8fafc)' }}>
                    🎉 Celebration Confetti
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #94a3b8)' }}>
                    Show confetti explosion when student/round finishes
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={confettiEnabled}
                  onChange={(e) => setConfettiEnabled(e.target.checked)}
                  style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                />
              </div>

              {/* Spin Duration Slider */}
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: 'var(--color-text, #f8fafc)' }}>
                    ⏱️ Spin Animation Duration:
                  </span>
                  <strong style={{ color: '#38BDF8' }}>{(spinDuration / 1000).toFixed(1)}s</strong>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="6000"
                  step="200"
                  value={spinDuration}
                  onChange={(e) => setSpinDuration(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>Fast (2.0s)</span>
                  <span>Standard (3.8s)</span>
                  <span>Dramatic (6.0s)</span>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--color-border, #334155)', margin: '4px 0' }} />

              {/* Reset Everything */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#EF4444' }}>⚠️ Reset Everything</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Clears history, resets students and questions to default
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset EVERYTHING (students, questions, history)?')) {
                      onResetAll();
                      onClose();
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#EF4444',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Reset All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border, #334155)',
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: '#3B82F6',
              color: '#ffffff',
              border: 'none',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
