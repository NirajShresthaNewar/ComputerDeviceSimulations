import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import styles from './Topbar.module.css';

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <SearchBar />
      <div className={styles.actions}>
        <ThemeToggle />
      </div>
    </header>
  );

  
}