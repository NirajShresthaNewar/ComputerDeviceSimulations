import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deviceCatalog } from '../../data/deviceCatalog';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = query.trim()
    ? deviceCatalog.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (route) => {
    navigate(route);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        placeholder="Search devices..."
        className={styles.input}
        aria-label="Search devices"
      />
      {open && results.length > 0 && (
        <ul className={styles.results} role="listbox">
          {results.map((device) => (
            <li key={device.id}>
              <button
                className={styles.resultItem}
                onClick={() => handleSelect(device.route)}
              >
                <span>{device.name}</span>
                <span className={styles.resultCategory}>{device.category}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className={styles.noResults}>No devices match "{query}"</div>
      )}
    </div>
  );
}