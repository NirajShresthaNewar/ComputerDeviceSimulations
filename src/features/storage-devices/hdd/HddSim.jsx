import { useState } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import CpuInternalsDiagram from '../../../components/simulation-shell/CpuInternalsDiagram';
import HddPlatterDiagram from './HddPlatterDiagram';
import styles from './HddSim.module.css';

export default function HddSim() {
    const [signal, setSignal] = useState(null);
    const [log, setLog] = useState([]);

    const handleSectorRead = (target) => {
        const entry = `Read track ${target.track + 1}, sector ${target.sector + 1}`;
        setLog((prev) => [entry, ...prev].slice(0, 5));

        setSignal({
            kind: 'Data',
            usesALU: false,
            usesStorage: true,
            detail: `The read/write head detected the magnetic pattern at track ${target.track + 1}, sector ${target.sector + 1}. This data was sent from Secondary Storage through Memory to the CPU's Control Unit.`,
        });
    };

    const simulateContent = (
        <div className={styles.simulateGrid}>
            <HddPlatterDiagram onSectorRead={handleSectorRead} />
            <div className={styles.right}>
                <div className={styles.log}>
                    <p className={styles.logLabel}>Recent reads</p>
                    {log.length === 0 && <p className={styles.logEmpty}>No reads yet.</p>}
                    {log.map((entry, i) => (
                        <p key={i} className={styles.logEntry}>{entry}</p>
                    ))}
                </div>
                <CpuInternalsDiagram signal={signal} />
            </div>
        </div>
    );

    const learnContent = (
        <ExplanationPanel
            description="A hard disk drive stores data on one or more spinning platters coated with a magnetic material. Data is organized into concentric tracks, each divided into sectors. An actuator arm moves a read/write head radially across the platter to reach the correct track (called seek time), then waits for the platter's continuous spin to bring the target sector underneath the head (called rotational latency) — together these two delays are why hard drives are slower than solid-state storage. The head itself never touches the platter; it flies on a microscopic cushion of air just nanometers above the surface, acting as an electromagnet that reads and writes data by detecting or changing the magnetic polarity of tiny regions on the disk."
            advantages={[
                'Very low cost per gigabyte compared to SSDs',
                'Mature, well-understood, reliable technology',
                'Available in very large capacities',
                'No write-cycle wear limit like flash memory',
            ]}
            disadvantages={[
                'Much slower than SSDs due to seek time and rotational latency',
                'Mechanical parts make it vulnerable to physical shock',
                'Consumes more power and generates more noise/heat',
                'Performance degrades with fragmented data',
            ]}
            uses={[
                'Bulk storage for large files, backups, and archives',
                'Cost-sensitive storage in servers and NAS devices',
                'Surveillance and video storage systems',
                'Secondary storage alongside a faster SSD for the OS',
            ]}
        />
    );

    const quizContent = (
        <p style={{ color: 'var(--color-text-muted)' }}>
            Quiz questions for this device are coming in Phase 6.
        </p>
    );

    return (
        <div>
            <h1>Hard Disk Drive</h1>
            <p className={styles.subtitle}>
                Click any sector to watch the actuator arm seek and the platter rotate to read it.
            </p>
            <SimTabs learnContent={learnContent} simulateContent={simulateContent} quizContent={quizContent} />
        </div>
    );
}