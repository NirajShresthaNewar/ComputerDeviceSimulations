import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getQAData, CLASS_QA_CATALOG } from '../../data/classQAData';
import styles from './ClassChapterQAView.module.css';

export default function ClassChapterQAView() {
  const { classId: paramClassId, chapterId: paramChapterId } = useParams();
  const location = useLocation();

  // Determine current class and chapter from URL parameters or pathname
  const effectiveClassId = useMemo(() => {
    if (paramClassId) return paramClassId;
    if (location.pathname.includes('class-7')) return 'class-7';
    if (location.pathname.includes('class-8')) return 'class-8';
    return 'class-6';
  }, [paramClassId, location.pathname]);

  const effectiveChapterId = useMemo(() => {
    if (paramChapterId) return paramChapterId;
    if (location.pathname.includes('chapter-6')) return 'chapter-6';
    return 'chapter-5';
  }, [paramChapterId, location.pathname]);

  const storageKey = `qa_custom_${effectiveClassId}_${effectiveChapterId}_v2`;

  // Load custom data from localStorage, fallback to getQAData
  const [qaData, setQaData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved Q&A data:', e);
    }
    return getQAData(effectiveClassId, effectiveChapterId);
  });

  // Re-sync if classId or chapterId route changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setQaData(JSON.parse(saved));
        return;
      }
    } catch (e) {
      console.error('Error reading localStorage for route change:', e);
    }
    setQaData(getQAData(effectiveClassId, effectiveChapterId));
    setActiveTab('all');
    setSearchQuery('');
  }, [effectiveClassId, effectiveChapterId, storageKey]);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'questions' | 'dos' | 'table' | 'concepts'
  const [zoomLevel, setZoomLevel] = useState('large'); // 'normal' | 'large' | 'xlarge'
  const [searchQuery, setSearchQuery] = useState('');
  const [hideAllAnswers, setHideAllAnswers] = useState(false);
  const [revealedItems, setRevealedItems] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const fileInputRef = useRef(null);

  // Save to localStorage whenever qaData changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(qaData));
      setSaveStatus('Saved locally');
      const timer = setTimeout(() => setSaveStatus(''), 2000);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('Error saving Q&A data:', e);
    }
  }, [qaData, storageKey]);

  const chapterNumber = qaData.chapterNumber || (effectiveChapterId.includes('6') ? 6 : 5);
  const className = qaData.className || (effectiveClassId === 'class-7' ? 'Class 7' : 'Class 6');

  const hasDosCommands = Boolean(qaData.dosCommandsSection && qaData.dosCommandsSection.commands?.length > 0);
  const hasKeyConcepts = Boolean(qaData.keyConceptsSection && qaData.keyConceptsSection.items?.length > 0);
  const hasTableItems = Boolean(qaData.questionsSection?.items?.some((i) => i.type === 'table'));

  const toggleReveal = (id) => {
    setRevealedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllAnswers = () => {
    setHideAllAnswers((prev) => !prev);
    setRevealedItems({});
  };

  // Reset to original defaults
  const handleResetDefaults = () => {
    if (window.confirm(`Reset all ${className} Chapter ${chapterNumber} questions back to default textbook answers?`)) {
      const defaultData = getQAData(effectiveClassId, effectiveChapterId);
      setQaData(defaultData);
      localStorage.removeItem(storageKey);
      setIsEditMode(false);
    }
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(qaData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${effectiveClassId}_Chapter${chapterNumber}_QA_Notes.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.questionsSection) {
          setQaData(parsed);
          alert('✅ Custom Q&A dataset imported successfully!');
        } else {
          alert('❌ Invalid file format.');
        }
      } catch (err) {
        alert('❌ Error reading JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset input
  };

  // EDIT HANDLERS FOR QUESTIONS
  const handleUpdateQuestionText = (id, newText) => {
    setQaData((prev) => ({
      ...prev,
      questionsSection: {
        ...prev.questionsSection,
        items: prev.questionsSection.items.map((item) =>
          item.id === id ? { ...item, question: newText } : item
        ),
      },
    }));
  };

  const handleUpdateAnswerText = (id, newAnswer) => {
    setQaData((prev) => ({
      ...prev,
      questionsSection: {
        ...prev.questionsSection,
        items: prev.questionsSection.items.map((item) =>
          item.id === id ? { ...item, answer: newAnswer } : item
        ),
      },
    }));
  };

  const handleUpdateTableData = (id, rowIndex, field, value) => {
    setQaData((prev) => ({
      ...prev,
      questionsSection: {
        ...prev.questionsSection,
        items: prev.questionsSection.items.map((item) => {
          if (item.id !== id || !item.table) return item;
          const updatedRows = [...item.table.rows];
          updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
          return {
            ...item,
            table: { ...item.table, rows: updatedRows },
          };
        }),
      },
    }));
  };

  const handleAddTableRow = (id) => {
    setQaData((prev) => ({
      ...prev,
      questionsSection: {
        ...prev.questionsSection,
        items: prev.questionsSection.items.map((item) => {
          if (item.id !== id || !item.table) return item;
          return {
            ...item,
            table: {
              ...item.table,
              rows: [...item.table.rows, { col1: 'Point 1...', col2: 'Point 2...' }],
            },
          };
        }),
      },
    }));
  };

  const handleUpdateDefinition = (id, defIndex, field, value) => {
    setQaData((prev) => ({
      ...prev,
      questionsSection: {
        ...prev.questionsSection,
        items: prev.questionsSection.items.map((item) => {
          if (item.id !== id || !item.definitions) return item;
          const updatedDefs = [...item.definitions];
          updatedDefs[defIndex] = { ...updatedDefs[defIndex], [field]: value };
          return {
            ...item,
            definitions: updatedDefs,
          };
        }),
      },
    }));
  };

  const handleAddNewQuestion = () => {
    const itemsCount = qaData.questionsSection?.items?.length || 0;
    const nextCode = String.fromCharCode(97 + itemsCount); // a, b, c, ...
    const newQ = {
      id: `q-custom-${Date.now()}`,
      itemLabel: nextCode,
      question: 'New Question title?',
      answer: 'Type the answer here...',
      type: 'text',
    };
    setQaData((prev) => ({
      ...prev,
      questionsSection: {
        ...prev.questionsSection,
        items: [...(prev.questionsSection?.items || []), newQ],
      },
    }));
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Delete this question?')) {
      setQaData((prev) => ({
        ...prev,
        questionsSection: {
          ...prev.questionsSection,
          items: prev.questionsSection.items.filter((item) => item.id !== id),
        },
      }));
    }
  };

  // EDIT HANDLERS FOR DOS COMMANDS
  const handleUpdateDosCmd = (id, field, value) => {
    if (!qaData.dosCommandsSection) return;
    setQaData((prev) => ({
      ...prev,
      dosCommandsSection: {
        ...prev.dosCommandsSection,
        commands: prev.dosCommandsSection.commands.map((cmd) =>
          cmd.id === id ? { ...cmd, [field]: value } : cmd
        ),
      },
    }));
  };

  const handleAddNewDosCommand = () => {
    if (!qaData.dosCommandsSection) return;
    const nextCode = String.fromCharCode(97 + qaData.dosCommandsSection.commands.length);
    const newCmd = {
      id: `cmd-custom-${Date.now()}`,
      itemLabel: nextCode,
      command: 'NEW_CMD',
      function: 'Description of what this command does.',
      category: 'Internal',
    };
    setQaData((prev) => ({
      ...prev,
      dosCommandsSection: {
        ...prev.dosCommandsSection,
        commands: [...prev.dosCommandsSection.commands, newCmd],
      },
    }));
  };

  const handleDeleteDosCommand = (id) => {
    if (!qaData.dosCommandsSection) return;
    if (window.confirm('Delete this DOS command?')) {
      setQaData((prev) => ({
        ...prev,
        dosCommandsSection: {
          ...prev.dosCommandsSection,
          commands: prev.dosCommandsSection.commands.filter((cmd) => cmd.id !== id),
        },
      }));
    }
  };

  // Filter questions by search
  const filteredQuestions = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const items = qaData.questionsSection?.items || [];
    return items.filter((item) => {
      if (!query) return true;
      const qMatch = item.question?.toLowerCase().includes(query);
      const aMatch = item.answer?.toLowerCase().includes(query);
      const defMatch = item.definitions?.some(
        (d) => d.term?.toLowerCase().includes(query) || d.meaning?.toLowerCase().includes(query)
      );
      return qMatch || aMatch || defMatch;
    });
  }, [searchQuery, qaData.questionsSection?.items]);

  // Filter DOS commands by search
  const filteredDosCommands = useMemo(() => {
    if (!qaData.dosCommandsSection?.commands) return [];
    const query = searchQuery.toLowerCase();
    return qaData.dosCommandsSection.commands.filter((cmd) => {
      if (!query) return true;
      return (
        cmd.command?.toLowerCase().includes(query) ||
        cmd.function?.toLowerCase().includes(query) ||
        cmd.category?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, qaData.dosCommandsSection?.commands]);

  // Zoom class mapping
  const zoomClass =
    zoomLevel === 'xlarge'
      ? styles.zoomXLarge
      : zoomLevel === 'large'
      ? styles.zoomLarge
      : styles.zoomNormal;

  return (
    <div className={`${styles.smartboardWrapper} ${zoomClass}`}>
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleImportJSON}
      />

      {/* Top Breadcrumb & Class Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          <Link to="/class-qa" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>📚 Q&A Bank</Link>
          <span>/</span>
          <span>{className}</span>
          <span>/</span>
          <span style={{ color: 'var(--color-text)', fontWeight: '600' }}>Ch {chapterNumber}: {qaData.chapterTitle}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/class-qa/class-6/chapter-5"
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              textDecoration: 'none',
              fontWeight: effectiveClassId === 'class-6' ? '700' : '400',
              background: effectiveClassId === 'class-6' ? 'var(--color-accent)' : 'var(--color-surface-raised)',
              color: effectiveClassId === 'class-6' ? '#000' : 'var(--color-text-muted)',
              border: '1px solid var(--color-border)'
            }}
          >
            ⚙️ Class 6 Ch 5
          </Link>
          <Link
            to="/class-qa/class-7/chapter-5"
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              textDecoration: 'none',
              fontWeight: effectiveClassId === 'class-7' ? '700' : '400',
              background: effectiveClassId === 'class-7' ? 'var(--color-accent)' : 'var(--color-surface-raised)',
              color: effectiveClassId === 'class-7' ? '#000' : 'var(--color-text-muted)',
              border: '1px solid var(--color-border)'
            }}
          >
            💿 Class 7 Ch 5 (Software)
          </Link>
        </div>
      </div>

      {/* Top Banner & Smart Board Toolbar */}
      <header className={styles.smartboardHeader}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerIcon}>{effectiveClassId === 'class-7' ? '💿' : '🖥️'}</div>
          <div>
            <h1 className={styles.headerTitle}>
              {className} Chapter {chapterNumber}: {qaData.chapterTitle}
            </h1>
            <p className={styles.headerSubtitle}>
              {qaData.subtitle || 'Classroom & Smart Board Study Q&A Notes'}
            </p>
          </div>
        </div>

        <div className={styles.toolbarControls}>
          {/* Smart Board Zoom Controller */}
          <div className={styles.zoomControls} title="Adjust text size for Smart Board readability">
            <button
              className={`${styles.zoomBtn} ${zoomLevel === 'normal' ? styles.zoomBtnActive : ''}`}
              onClick={() => setZoomLevel('normal')}
            >
              100%
            </button>
            <button
              className={`${styles.zoomBtn} ${zoomLevel === 'large' ? styles.zoomBtnActive : ''}`}
              onClick={() => setZoomLevel('large')}
            >
              125% (Board)
            </button>
            <button
              className={`${styles.zoomBtn} ${zoomLevel === 'xlarge' ? styles.zoomBtnActive : ''}`}
              onClick={() => setZoomLevel('xlarge')}
            >
              150% (Large)
            </button>
          </div>

          {/* Teacher Edit Mode Toggle */}
          <button
            className={`${styles.toolBtn} ${isEditMode ? styles.toolBtnActive : styles.editModeBtn}`}
            onClick={() => setIsEditMode(!isEditMode)}
            title="Edit question text and answers on the fly without database"
          >
            <span>{isEditMode ? '💾 Finish Editing' : '✏️ Edit Q&A'}</span>
          </button>

          {/* Test / Reveal Answers Toggle */}
          <button
            className={`${styles.toolBtn} ${hideAllAnswers ? styles.toolBtnActive : ''}`}
            onClick={toggleAllAnswers}
            title="Hide or show answers for classroom active quiz"
          >
            {hideAllAnswers ? '👁️ Show All Answers' : '🙈 Hide Answers (Quiz Mode)'}
          </button>

          {/* Print Button */}
          <button
            className={styles.toolBtn}
            onClick={() => window.print()}
            title="Print clean handout for students"
          >
            🖨️ Print
          </button>
        </div>
      </header>

      {/* Teacher Edit Mode Banner & Backup Bar */}
      {isEditMode && (
        <div className={styles.editModeBanner}>
          <div>
            <strong>✏️ Teacher Live Edit Mode Active:</strong> Click any question, answer, table cell, or definition below to edit. Edits save automatically in your browser.
            {saveStatus && <span style={{ marginLeft: '10px', color: 'var(--color-accent)' }}>• {saveStatus}</span>}
          </div>
          <div className={styles.editActionsGroup}>
            <button className={styles.smallActionBtn} onClick={handleExportJSON} title="Download notes as JSON file">
              📥 Export JSON
            </button>
            <button className={styles.smallActionBtn} onClick={() => fileInputRef.current?.click()} title="Import JSON backup from file">
              📤 Import JSON
            </button>
            <button className={`${styles.smallActionBtn} ${styles.dangerBtn}`} onClick={handleResetDefaults} title="Restore default questions">
              🔄 Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Sub-menu Tabs */}
      <nav className={styles.tabNav}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>📋 All Notes</span>
          <span className={styles.badgePill}>
            {(qaData.questionsSection?.items?.length || 0) + (qaData.dosCommandsSection?.commands?.length || 0)}
          </span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'questions' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <span>📝 Question Answers</span>
          <span className={styles.badgePill}>
            {qaData.questionsSection?.items?.length || 0} items
          </span>
        </button>

        {hasDosCommands && (
          <button
            className={`${styles.tabBtn} ${activeTab === 'dos' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('dos')}
          >
            <span>⚡ 5. Functions of DOS Commands</span>
            <span className={styles.badgePill}>
              {qaData.dosCommandsSection.commands.length} cmds
            </span>
          </button>
        )}

        {hasTableItems && (
          <button
            className={`${styles.tabBtn} ${activeTab === 'table' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('table')}
          >
            <span>⚖️ Comparison Tables</span>
          </button>
        )}

        {hasKeyConcepts && (
          <button
            className={`${styles.tabBtn} ${activeTab === 'concepts' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('concepts')}
          >
            <span>💡 Key Concepts</span>
            <span className={styles.badgePill}>
              {qaData.keyConceptsSection.items.length}
            </span>
          </button>
        )}
      </nav>

      {/* Search Filter */}
      <div className={styles.searchContainer}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={`Filter ${className} Ch ${chapterNumber} questions, definitions, topics...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ============================================================ */}
      {/* KEY CONCEPTS SECTION (if available) */}
      {/* ============================================================ */}
      {hasKeyConcepts && (activeTab === 'all' || activeTab === 'concepts') && (
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeadingRow}>
            <h2 className={styles.sectionHeading}>
              {qaData.keyConceptsSection.title}
            </h2>
          </div>
          <div className={styles.conceptGrid}>
            {qaData.keyConceptsSection.items.map((concept, idx) => (
              <div key={idx} className={styles.conceptCard}>
                <span className={styles.conceptBadge}>{concept.badge}</span>
                <h3 className={styles.conceptTitle}>{concept.title}</h3>
                <p className={styles.conceptDesc}>{concept.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* ANSWER THE FOLLOWING QUESTIONS */}
      {/* ============================================================ */}
      {(activeTab === 'all' || activeTab === 'questions' || activeTab === 'table') && (
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeadingRow}>
            <h2 className={styles.sectionHeading}>
              <span>📝</span> {qaData.questionsSection?.title || 'Questions & Answers'}
            </h2>
            {isEditMode && (
              <button className={styles.smallActionBtn} onClick={handleAddNewQuestion}>
                ➕ Add Question
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredQuestions.map((item) => {
              if (activeTab === 'table' && item.type !== 'table') return null;

              const isAnswerVisible = hideAllAnswers
                ? revealedItems[item.id]
                : !revealedItems[item.id];

              return (
                <article key={item.id} className={styles.qaCard}>
                  {/* Question Header */}
                  <div className={styles.questionLine}>
                    <div className={styles.qTextGroup}>
                      <span className={styles.qLabelBadge}>{item.itemLabel}.</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          className={styles.editInput}
                          value={item.question}
                          onChange={(e) => handleUpdateQuestionText(item.id, e.target.value)}
                        />
                      ) : (
                        <h3 className={styles.questionTitle}>{item.question}</h3>
                      )}
                    </div>

                    <div className={styles.cardRightBtns}>
                      {!isEditMode && (
                        <button
                          className={styles.toggleCardBtn}
                          onClick={() => toggleReveal(item.id)}
                        >
                          {isAnswerVisible ? 'Hide' : 'Show Answer'}
                        </button>
                      )}
                      {isEditMode && (
                        <button
                          className={styles.deleteItemBtn}
                          onClick={() => handleDeleteQuestion(item.id)}
                          title="Delete this question"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Answer Content */}
                  {(isAnswerVisible || isEditMode) && (
                    <div className={styles.answerBox}>
                      {/* Standard text answers */}
                      {item.type === 'text' && (
                        <>
                          {isEditMode ? (
                            <textarea
                              className={styles.editTextarea}
                              value={item.answer}
                              onChange={(e) => handleUpdateAnswerText(item.id, e.target.value)}
                              placeholder="Type answer here..."
                            />
                          ) : (
                            <div className={styles.answerText} style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                              {item.answer}
                            </div>
                          )}
                        </>
                      )}

                      {/* Comparison / Difference Table */}
                      {item.type === 'table' && (
                        <div className={styles.tableWrapper}>
                          <table className={styles.compactTable}>
                            <thead>
                              <tr>
                                <th style={{ width: '50%' }}>
                                  {item.table?.headers?.[0] || 'Column 1'}
                                </th>
                                <th style={{ width: '50%' }}>
                                  {item.table?.headers?.[1] || 'Column 2'}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.table?.rows.map((row, rIdx) => {
                                const val1 = row.col1 !== undefined ? row.col1 : row.file;
                                const val2 = row.col2 !== undefined ? row.col2 : row.directory;
                                const field1 = row.col1 !== undefined ? 'col1' : 'file';
                                const field2 = row.col2 !== undefined ? 'col2' : 'directory';

                                return (
                                  <tr key={rIdx}>
                                    <td>
                                      {isEditMode ? (
                                        <input
                                          type="text"
                                          className={styles.editInput}
                                          value={val1 || ''}
                                          onChange={(e) =>
                                            handleUpdateTableData(item.id, rIdx, field1, e.target.value)
                                          }
                                        />
                                      ) : (
                                        val1
                                      )}
                                    </td>
                                    <td>
                                      {isEditMode ? (
                                        <input
                                          type="text"
                                          className={styles.editInput}
                                          value={val2 || ''}
                                          onChange={(e) =>
                                            handleUpdateTableData(item.id, rIdx, field2, e.target.value)
                                          }
                                        />
                                      ) : (
                                        val2
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {isEditMode && (
                            <button
                              className={styles.smallActionBtn}
                              style={{ marginTop: '8px' }}
                              onClick={() => handleAddTableRow(item.id)}
                            >
                              ➕ Add Table Row
                            </button>
                          )}
                        </div>
                      )}

                      {/* Definitions Block */}
                      {item.type === 'definitions' && (
                        <div className={styles.defGrid}>
                          {item.definitions?.map((def, dIdx) => (
                            <div key={dIdx} className={styles.defItem}>
                              {isEditMode ? (
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <input
                                    type="text"
                                    className={styles.editInput}
                                    style={{ width: '180px', fontWeight: 'bold' }}
                                    value={def.term}
                                    onChange={(e) =>
                                      handleUpdateDefinition(item.id, dIdx, 'term', e.target.value)
                                    }
                                  />
                                  <input
                                    type="text"
                                    className={styles.editInput}
                                    value={def.meaning}
                                    onChange={(e) =>
                                      handleUpdateDefinition(item.id, dIdx, 'meaning', e.target.value)
                                    }
                                  />
                                </div>
                              ) : (
                                <>
                                  <strong style={{ color: 'var(--color-accent)' }}>
                                    {def.term}:
                                  </strong>{' '}
                                  <span>{def.meaning}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 5. FUNCTIONS OF DOS COMMANDS (if present in dataset) */}
      {/* ============================================================ */}
      {hasDosCommands && (activeTab === 'all' || activeTab === 'dos') && (
        <section className={styles.sectionBlock} style={{ marginTop: '10px' }}>
          <div className={styles.sectionHeadingRow}>
            <h2 className={styles.sectionHeading}>
              <span>⚡</span> {qaData.dosCommandsSection.title}
            </h2>
            {isEditMode && (
              <button className={styles.smallActionBtn} onClick={handleAddNewDosCommand}>
                ➕ Add DOS Command
              </button>
            )}
          </div>

          <div className={styles.dosGrid}>
            {filteredDosCommands.map((cmd) => (
              <div key={cmd.id} className={styles.dosCard}>
                <div className={styles.dosLeft}>
                  <span className={styles.dosLabel}>{cmd.itemLabel}.</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      className={styles.editInput}
                      style={{ width: '90px', fontFamily: 'monospace', fontWeight: 'bold' }}
                      value={cmd.command}
                      onChange={(e) => handleUpdateDosCmd(cmd.id, 'command', e.target.value)}
                    />
                  ) : (
                    <span className={styles.dosCmdBadge}>{cmd.command}</span>
                  )}
                </div>

                <div className={styles.dosFunction}>
                  {isEditMode ? (
                    <input
                      type="text"
                      className={styles.editInput}
                      value={cmd.function}
                      onChange={(e) => handleUpdateDosCmd(cmd.id, 'function', e.target.value)}
                    />
                  ) : (
                    cmd.function
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isEditMode ? (
                    <>
                      <select
                        className={styles.editInput}
                        style={{ width: '85px', fontSize: '11px', padding: '4px' }}
                        value={cmd.category}
                        onChange={(e) => handleUpdateDosCmd(cmd.id, 'category', e.target.value)}
                      >
                        <option value="Internal">Internal</option>
                        <option value="External">External</option>
                      </select>
                      <button
                        className={styles.deleteItemBtn}
                        onClick={() => handleDeleteDosCommand(cmd.id)}
                        title="Delete command"
                      >
                        🗑️
                      </button>
                    </>
                  ) : (
                    <span
                      className={`${styles.dosTypeTag} ${
                        cmd.category === 'Internal' ? styles.tagInternal : styles.tagExternal
                      }`}
                    >
                      {cmd.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Summary Bar */}
      <footer className={styles.bottomStatsBar}>
        <span>📌 <strong>{className} Computer Science</strong> • High-Visibility Smart Board Presentation</span>
        <span>
          Total: {qaData.questionsSection?.items?.length || 0} Questions
          {hasDosCommands ? ` + ${qaData.dosCommandsSection.commands.length} DOS Commands` : ''}
        </span>
      </footer>
    </div>
  );
}
