import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import styles from './Sidebar.module.css';

const standardNavSections = [
  { label: 'Overview', links: [{ to: '/', label: 'Home' }] },
  {
    label: 'Hardware Categories',
    links: [
      { to: '/input-devices', label: '⌨️ Input Devices' },
      { to: '/output-devices', label: '🖥️ Output Devices' },
      { to: '/storage-devices', label: '💾 Storage Devices' },
    ],
  },
  {
    label: 'Software & Systems',
    links: [
      { to: '/software/application-software', label: '📦 Application Software' },
      { to: '/software/operating-system', label: '🖥️ Operating System' },
      { to: '/software/device-driver', label: '🧑‍🔧 Device Driver' },
      { to: '/software/language-translators', label: '🔀 Language Translators' },
    ],
  },
];

const classQASyllabus = [
  {
    classId: 'class-6',
    name: 'Class 6 Q&A',
    badge: 'Active',
    chapters: [
      { to: '/class-qa/class-6/chapter-5', label: '⚙️ Ch 5: Operating System & DOS', isFeatured: true },
      { to: '/class-qa/class-6/chapter-6', label: '💻 Ch 6: Operating System & DOS', isFeatured: true },
      { to: '/class-qa/class-6/chapter-1', label: '💻 Ch 1: Intro to Computers', isSim: true },
      { to: '/class-qa/class-6/chapter-2', label: '⌨️ Ch 2: Input Devices', isSim: true },
      { to: '/class-qa/class-6/chapter-3', label: '🖥️ Ch 3: Output Devices', isSim: true },
      { to: '/class-qa/class-6/chapter-4', label: '💾 Ch 4: Storage & Memory', isSim: true },
    ]
  },
  {
    classId: 'class-7',
    name: 'Class 7 Q&A',
    badge: 'Middle',
    chapters: [
      { to: '/class-qa/class-7/chapter-1', label: '🖥️ Ch 1: Computer System', isSim: true },
      { to: '/class-qa/class-7/chapter-2', label: '🔢 Ch 2: Number Systems', isSim: true },
      { to: '/class-qa/class-7/chapter-3', label: '⚙️ Ch 3: OS Settings & Control', isSim: true },
      { to: '/class-qa/class-7/chapter-4', label: '🛡️ Ch 4: Cybersecurity & Virus', isSim: true },
    ]
  },
  {
    classId: 'class-8',
    name: 'Class 8 Q&A',
    badge: 'Senior',
    chapters: [
      { to: '/class-qa/class-8/chapter-1', label: '🌐 Ch 1: Networks & Topologies', isSim: true },
      { to: '/class-qa/class-8/chapter-2', label: '☁️ Ch 2: Cloud Computing', isSim: true },
      { to: '/class-qa/class-8/chapter-3', label: '🗄️ Ch 3: Database Concepts', isSim: true },
      { to: '/class-qa/class-8/chapter-4', label: '🐍 Ch 4: Programming Basics', isSim: true },
    ]
  }
];

const practiceSections = [
  {
    label: 'Practice & Labs',
    links: [
      { to: '/labs/cyber-virus-lab', label: '🛡️ Cyber Virus Lab' },
      { to: '/labs', label: '🧪 Interactive Labs' },
      { to: '/quiz', label: '🎯 Quiz Center' },
      { to: '/compare', label: '⚖️ Device Comparison' },
    ],
  },
  {
    label: 'Other',
    links: [
      { to: '/teacher', label: '👩‍🏫 Teacher Dashboard' },
      { to: '/about', label: 'ℹ️ About' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { isOpen, closeSidebar } = useSidebar();

  // Class 6 expanded by default
  const [openClasses, setOpenClasses] = useState({
    'class-6': true,
    'class-7': false,
    'class-8': false,
  });

  const toggleClass = (classId) => {
    setOpenClasses((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  return (
    <aside
      className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ''}`}
      aria-hidden={!isOpen}
    >
      <div className={styles.brand}>
        <div className={styles.brandLeft}>
          <span className={styles.brandMark} aria-hidden="true">⌁</span>
          <span className={styles.brandName}>Device Sim</span>
        </div>
        <button
          className={styles.closeSidebarBtn}
          onClick={closeSidebar}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          ✕
        </button>
      </div>

      <nav className={styles.nav}>
        {/* Standard Nav Sections */}
        {standardNavSections.map((section) => (
          <div key={section.label} className={styles.section}>
            <p className={styles.sectionLabel}>{section.label}</p>
            <ul className={styles.linkList}>
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      isActive ? `${styles.link} ${styles.linkActive}` : styles.link
                    }
                  >
                    <span className={styles.linkTrace} aria-hidden="true" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* 📚 CLASS & CHAPTER Q&A BANK (MENU & SUB-MENUS) */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            <span>📚 Class Q&A Bank</span>
            <NavLink
              to="/class-qa"
              style={{ fontSize: '10px', color: 'var(--color-accent)', textTransform: 'none' }}
            >
              View Hub
            </NavLink>
          </div>

          {classQASyllabus.map((cls) => {
            const isOpenAccordion = openClasses[cls.classId];
            const isAnyActive = cls.chapters.some((ch) => location.pathname === ch.to);

            return (
              <div key={cls.classId} className={styles.classAccordion}>
                {/* Main Class Menu Button */}
                <button
                  className={`${styles.classHeader} ${
                    isAnyActive ? styles.classHeaderActive : ''
                  }`}
                  onClick={() => toggleClass(cls.classId)}
                  aria-expanded={isOpenAccordion}
                >
                  <div className={styles.classTitle}>
                    <span
                      className={`${styles.chevron} ${
                        isOpenAccordion ? styles.chevronOpen : ''
                      }`}
                    >
                      ▶
                    </span>
                    <span>{cls.name}</span>
                  </div>
                  <span
                    className={`${styles.badge} ${
                      cls.classId === 'class-6' ? styles.badgeHighlight : ''
                    }`}
                  >
                    {cls.badge}
                  </span>
                </button>

                {/* Sub-menu Chapters */}
                {isOpenAccordion && (
                  <ul className={styles.subMenuList}>
                    {cls.chapters.map((ch) => (
                      <li key={ch.to}>
                        <NavLink
                          to={ch.to}
                          className={({ isActive }) =>
                            isActive
                              ? `${styles.subLink} ${styles.subLinkActive}`
                              : styles.subLink
                          }
                        >
                          <span>{ch.label}</span>
                          {ch.isFeatured && (
                            <span className={styles.hotTag}>Q&A</span>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Practice and Other Sections */}
        {practiceSections.map((section) => (
          <div key={section.label} className={styles.section}>
            <p className={styles.sectionLabel}>{section.label}</p>
            <ul className={styles.linkList}>
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      isActive ? `${styles.link} ${styles.linkActive}` : styles.link
                    }
                  >
                    <span className={styles.linkTrace} aria-hidden="true" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}