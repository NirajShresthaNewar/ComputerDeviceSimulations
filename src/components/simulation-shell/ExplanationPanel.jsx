import styles from './ExplanationPanel.module.css';

export default function ExplanationPanel({ description, advantages, disadvantages, uses }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.description}>{description}</p>

      <div className={styles.grid}>
        <div className={styles.block}>
          <h4 className={styles.heading}>Advantages</h4>
          <ul className={styles.list}>
            {advantages.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
         <div className={styles.block}>
        <h4 className={styles.heading}>Real-world uses</h4>
        <ul className={styles.list}>
          {uses.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </div>
        <div className={styles.block}>
          <h4 className={styles.heading}>Types</h4>
          <ul className={styles.list}>
            {disadvantages.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>

     
  );
}