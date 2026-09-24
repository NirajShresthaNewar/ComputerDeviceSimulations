import { useSidebar } from '../../context/SidebarContext';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import styles from './Topbar.module.css';

export default function Topbar() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <button
          className={styles.hamburgerBtn}
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          title={isOpen ? 'Close Sidebar (Ctrl + B)' : 'Open Sidebar (Ctrl + B)'}
        >
          <span className={`${styles.bar} ${!isOpen ? styles.barTopActive : ''}`} />
          <span className={`${styles.bar} ${!isOpen ? styles.barMidActive : ''}`} />
          <span className={`${styles.bar} ${!isOpen ? styles.barBotActive : ''}`} />
        </button>
        <SearchBar />
      </div>

      <div className={styles.actions}>
        <ThemeToggle />
      </div>
    </header>
  );
}