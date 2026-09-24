import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CLASS_6_OS_QA } from '../../data/classQAData';
import styles from './ClassChapterQAView.module.css';

const STORAGE_KEY = 'class6_os_qa_custom_v1';

export default function ClassChapterQAView() {
  const { chapterId } = useParams();

  // Load custom data from localStorage, fallback to default CLASS_6_OS_QA
  const [qaData, setQaData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved Q&A data:', e);
    }
    return CLASS_6_OS_QA;
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'questions' | 'dos' | 'table'
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(qaData));
      setSaveStatus('Saved locally');
      const timer = setTimeout(() => setSaveStatus(''), 2000);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('Error saving Q&A data:', e);
    }
  }, [qaData]);

  // Determine chapter display number (5 or 6 based on URL or default)
  const isChap6 = chapterId === 'chapter-6' || window.location.pathname.includes('chapter-6');
  const chapterNumber = isChap6 ? 6 : 5;

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
    if (window.confirm('Reset all questions and DOS commands back to default textbook answers?')) {
      setQaData(CLASS_6_OS_QA);
      localStorage.removeItem(STORAGE_KEY);
      setIsEditMode(false);
    }
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(qaData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Class6_Chapter5_QA_Notes.json`);
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
        if (parsed.questionsSection && parsed.dosCommandsSection) {
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

  // EDIT HANDLERS FOR SECTION 4 (QUESTIONS)
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
              rows: [...item.table.rows, { file: 'New file point...', directory: 'New directory point...' }],
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
    const nextCode = String.fromCharCode(97 + qaData.questionsSection.items.length); // a, b, c, ...
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
        items: [...prev.questionsSection.items, newQ],
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

  // EDIT HANDLERS FOR SECTION 5 (DOS COMMANDS)
  const handleUpdateDosCmd = (id, field, value) => {
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
    return qaData.questionsSection.items.filter((item) => {
      if (!query) return true;
      const qMatch = item.question?.toLowerCase().includes(query);
      const aMatch = item.answer?.toLowerCase().includes(query);
      const defMatch = item.definitions?.some(
        (d) => d.term?.toLowerCase().includes(query) || d.meaning?.toLowerCase().includes(query)
      );
      return qMatch || aMatch || defMatch;
    });
  }, [searchQuery, qaData.questionsSection.items]);

  // Filter DOS commands by search
  const filteredDosCommands = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return qaData.dosCommandsSection.commands.filter((cmd) => {
      if (!query) return true;
      return (
        cmd.command?.toLowerCase().includes(query) ||
        cmd.function?.toLowerCase().includes(query) ||
        cmd.category?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, qaData.dosCommandsSection.commands]);

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

      {/* Top Banner & Smart Board Toolbar */}
      <header className={styles.smartboardHeader}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerIcon}>🖥️</div>
          <div>
            <h1 className={styles.headerTitle}>
              Class 6 Chapter {chapterNumber}: {qaData.chapterTitle}
            </h1>
            <p className={styles.headerSubtitle}>
              Classroom & Smart Board Study Q&A Notes
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
            <strong>✏️ Teacher Live Edit Mode Active:</strong> Click any question, answer, table cell, or DOS command below to edit. Edits save automatically in browser memory.
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
          <span>📋 All Q&A & Commands</span>
          <span className={styles.badgePill}>
            {qaData.questionsSection.items.length + qaData.dosCommandsSection.commands.length}
          </span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'questions' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <span>📝 4. Question & Answers</span>
          <span className={styles.badgePill}>
            {qaData.questionsSection.items.length} items
          </span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'dos' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('dos')}
        >
          <span>⚡ 5. Functions of DOS Commands</span>
          <span className={styles.badgePill}>
            {qaData.dosCommandsSection.commands.length} cmds
          </span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'table' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('table')}
        >
          <span>⚖️ File vs Directory Table</span>
        </button>
      </nav>

      {/* Search Filter */}
      <div className={styles.searchContainer}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Filter questions, DOS commands (e.g. CD, Booting, File, Internal)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ============================================================ */}
      {/* 4. ANSWER THE FOLLOWING QUESTIONS */}
      {/* ============================================================ */}
      {(activeTab === 'all' || activeTab === 'questions' || activeTab === 'table') && (
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeadingRow}>
            <h2 className={styles.sectionHeading}>
              <span>📝</span> {qaData.questionsSection.title}
            </h2>
            {isEditMode && (
              <button className={styles.smallActionBtn} onClick={handleAddNewQuestion}>
                ➕ Add Question
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredQuestions.map((item) => {
              if (activeTab === 'table' && item.itemLabel !== 'f') return null;

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
                            <p className={styles.answerText}>
                              {item.answer?.includes('IO.SYS, MSDOS.SYS and COMMAND.COM') ? (
                                <>
                                  The essential DOS system files are{' '}
                                  <span className={styles.highlightBadge}>IO.SYS</span>,{' '}
                                  <span className={styles.highlightBadge}>MSDOS.SYS</span> and{' '}
                                  <span className={styles.highlightBadge}>COMMAND.COM</span>.
                                </>
                              ) : item.itemLabel === 'e' ? (
                                <>
                                  Booting is the process of starting a computer.
                                  <br />
                                  <strong>Types:</strong>{' '}
                                  <span className={styles.highlightBadge}>Cold booting</span> and{' '}
                                  <span className={styles.highlightBadge}>Warm booting</span>.
                                </>
                              ) : (
                                item.answer
                              )}
                            </p>
                          )}
                        </>
                      )}

                      {/* File vs Directory Table */}
                      {item.type === 'table' && (
                        <div className={styles.tableWrapper}>
                          <table className={styles.compactTable}>
                            <thead>
                              <tr>
                                <th style={{ width: '50%' }}>📁 {item.table?.headers[0]}</th>
                                <th style={{ width: '50%' }}>📂 {item.table?.headers[1]}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.table?.rows.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td>
                                    {isEditMode ? (
                                      <input
                                        type="text"
                                        className={styles.editInput}
                                        value={row.file}
                                        onChange={(e) =>
                                          handleUpdateTableData(item.id, rIdx, 'file', e.target.value)
                                        }
                                      />
                                    ) : (
                                      row.file
                                    )}
                                  </td>
                                  <td>
                                    {isEditMode ? (
                                      <input
                                        type="text"
                                        className={styles.editInput}
                                        value={row.directory}
                                        onChange={(e) =>
                                          handleUpdateTableData(
                                            item.id,
                                            rIdx,
                                            'directory',
                                            e.target.value
                                          )
                                        }
                                      />
                                    ) : (
                                      row.directory
                                    )}
                                  </td>
                                </tr>
                              ))}
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

                      {/* Definitions (Internal vs External) */}
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
      {/* 5. FUNCTIONS OF DOS COMMANDS */}
      {/* ============================================================ */}
      {(activeTab === 'all' || activeTab === 'dos') && (
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
        <span>📌 <strong>Class 6 Computer Science</strong> • High-Visibility Smart Board Presentation</span>
        <span>
          Total: {qaData.questionsSection.items.length} Questions + {qaData.dosCommandsSection.commands.length} DOS Commands
        </span>
      </footer>
    </div>
  );
}
