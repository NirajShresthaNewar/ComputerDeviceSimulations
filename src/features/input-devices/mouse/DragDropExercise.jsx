import { useState } from 'react';
import styles from './DragDropExercise.module.css';

const TARGETS = ['Folder A', 'Folder B', 'Folder C'];

export default function DragDropExercise() {
  const [placed, setPlaced] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (target) => {
    setPlaced(target);
    setDragging(false);
  };

  return (
    <div className={styles.wrap}>
      <p className={styles.title}>Drag-and-drop exercise</p>
      <div className={styles.row}>
        <div
          className={styles.draggable}
          draggable
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
        >
          📄 file.txt
        </div>
        <div className={styles.targets}>
          {TARGETS.map((target) => (
            <div
              key={target}
              className={
                placed === target ? `${styles.target} ${styles.targetFilled}` : styles.target
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(target)}
            >
              {target}
              {placed === target && <span className={styles.checkmark}>✓</span>}
            </div>
          ))}
        </div>
      </div>
      {placed && (
        <p className={styles.feedback}>file.txt dropped into {placed}.</p>
      )}
    </div>
  );
}