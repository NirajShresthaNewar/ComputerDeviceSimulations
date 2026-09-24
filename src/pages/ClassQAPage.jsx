import { Link } from 'react-router-dom';
import { CLASS_QA_CATALOG } from '../data/classQAData';

export default function ClassQAPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <header style={{
        background: 'linear-gradient(135deg, rgba(61, 220, 151, 0.12), rgba(32, 39, 58, 0.95))',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '28px 32px'
      }}>
        <span style={{
          background: 'rgba(61, 220, 151, 0.15)',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-accent)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          Curriculum Q&A Center
        </span>
        <h1 style={{ fontSize: '32px', margin: '14px 0 8px', color: 'var(--color-text)' }}>
          📚 School Class Q&A Bank
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>
          Select a class and chapter below to explore comprehensive question answers, conceptual summaries, difference tables, and unit test revision papers.
        </p>
      </header>

      {CLASS_QA_CATALOG.map((cls) => (
        <section
          key={cls.classId}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '24px 28px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', color: 'var(--color-text)' }}>{cls.className}</h2>
                <span style={{
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-accent)',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {cls.badge}
                </span>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {cls.description}
              </p>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {cls.chapters.length} Chapters
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {cls.chapters.map((ch) => {
              const isCh5 = ch.chapterNumber === 5 && cls.classId === 'class-6';
              const targetRoute = isCh5 ? `/class-qa/class-6/chapter-5` : `/class-qa/${cls.classId}/${ch.chapterId}`;

              return (
                <div
                  key={ch.chapterId}
                  style={{
                    background: isCh5 ? 'rgba(61, 220, 151, 0.08)' : 'var(--color-surface-raised)',
                    border: `1px solid ${isCh5 ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px' }}>{ch.icon}</span>
                      {ch.badge && (
                        <span style={{
                          background: 'var(--color-accent)',
                          color: '#000',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {ch.badge}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '16px', color: 'var(--color-text)', marginBottom: '4px' }}>
                      Ch {ch.chapterNumber}: {ch.title}
                    </h3>
                    {ch.topics && (
                      <ul style={{ paddingLeft: '16px', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                        {ch.topics.slice(0, 3).map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    {isCh5 ? (
                      <Link
                        to={targetRoute}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'var(--color-accent)',
                          color: '#0B0E14',
                          padding: '7px 14px',
                          borderRadius: '4px',
                          fontSize: '12.5px',
                          fontWeight: '600',
                          textDecoration: 'none'
                        }}
                      >
                        Open Q&A Study Center ➔
                      </Link>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        {cls.classId === 'class-6' ? '📘 Content available via simulations' : '⏳ Syllabus in preparation'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
