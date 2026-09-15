import { NavLink } from 'react-router-dom';
import { categories } from '../../data/deviceCatalog';
import styles from './Sidebar.module.css';

const navSections = [
  { label: 'Overview', links: [{ to: '/', label: 'Home' }] },
  {
    label: 'Categories',
    links: [
      { to: '/input-devices', label: 'Input Devices' },
      { to: '/output-devices', label: 'Output Devices' },
      { to: '/storage-devices', label: 'Storage Devices' },
      { to: '/software/application-software', label: '📦 Application Software' },
      { to: '/software/operating-system', label: '🖥️ Operating System' },
      { to: '/software/device-driver', label: '🧑‍🔧 Device Driver' },
      { to: '/software/language-translators', label: '🔀 Language Translators' },
    ],
  },
  {
    label: 'Practice',
    links: [
      { to: '/labs', label: 'Interactive Labs' },
      { to: '/quiz', label: 'Quiz Center' },
      { to: '/compare', label: 'Device Comparison' },
    ],
  },
  {
    label: 'Other',
    links: [
      { to: '/teacher', label: 'Teacher Dashboard' },
      { to: '/about', label: 'About' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">⌁</span>
        <span className={styles.brandName}>Device Sim</span>
      </div>

      <nav className={styles.nav}>
        {navSections.map((section) => (
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