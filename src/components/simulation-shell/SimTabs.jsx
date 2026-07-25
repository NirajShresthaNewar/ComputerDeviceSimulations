import { useState } from 'react';
import styles from './SimTabs.module.css';

const TABS = ['Learn', 'Simulate', 'Quiz'];

export default function SimTabs({ learnContent, simulateContent, quizContent }) {
  const [active, setActive] = useState('Simulate');

  const content = {
    Learn: learnContent,
    Simulate: simulateContent,
    Quiz: quizContent,
  };

  return (
    <div>
      <div className={styles.tabBar} role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            className={active === tab ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setActive(tab)}
          >
            {tab}
            <span className={styles.trace} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">
        {content[active]}
      </div>
    </div>
  );
}