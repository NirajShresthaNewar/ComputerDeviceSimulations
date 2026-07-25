import { useEffect, useState } from 'react';
import styles from './CpuInternalsDiagram.module.css';

/**
 * Generic, reusable CPU-internals flow diagram.
 *
 * signal shape:
 * {
 *   kind: 'Instruction' | 'Data',
 *   detail: string,        // caption text explaining what happened
 *   usesALU: boolean,       // true if this signal needs computation
 *   usesStorage: boolean,   // true if this signal touches secondary storage
 * }
 */
export default function CpuInternalsDiagram({ signal }) {
  const [pulseId, setPulseId] = useState(0);

  useEffect(() => {
    if (signal) setPulseId((id) => id + 1);
  }, [signal]);

  const toALU = !!signal?.usesALU;
  const toStorage = !!signal?.usesStorage;

  // Base path: entry -> CU. Then CU branches to ALU and/or Memory.
  // Memory -> Secondary Storage is a separate, optional final leg.
  const entryToCU = 'M30,140 L140,140';
  const cuToALU = 'M220,140 L220,60 L320,60';
  const cuToMemory = 'M220,140 L220,140 L320,140';
  const cuToOutputDirect = 'M220,140 L220,220 L320,220'; // unused visually, kept for symmetry
  const memoryToStorage = 'M460,140 L460,220 L560,220';
  const aluOrMemoryToOutput = 'M460,140 L560,140 L640,140';

  // Build the actual traveled path for this signal
  const traveledPath = toALU
    ? `${entryToCU.slice(1)} ${cuToALU.slice(1)} M320,60 L380,60 L380,140 L460,140 ${aluOrMemoryToOutput.slice(1)}`
    : toStorage
    ? `${entryToCU.slice(1)} ${cuToMemory.slice(1)} ${memoryToStorage.slice(1)} M560,220 L640,220 L640,140 L640,140`
    : `${entryToCU.slice(1)} ${cuToMemory.slice(1)} ${aluOrMemoryToOutput.slice(1)}`;

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 700 280" className={styles.svg}>
        {/* CPU boundary */}
        <rect x="90" y="20" width="470" height="240" rx="14" className={styles.cpuBoundary} />
        <text x="325" y="14" textAnchor="middle" className={styles.cpuLabel}>CPU</text>

        {/* static tracks */}
        <path d={entryToCU} className={styles.track} />
        <path d={cuToALU} className={styles.track} />
        <path d={cuToMemory} className={styles.track} />
        <path d={aluOrMemoryToOutput} className={styles.track} />
        <path d={memoryToStorage} className={`${styles.track} ${styles.storageTrack}`} />

        {/* traveling pulse with label, replays via key={pulseId} */}
        {signal && (
          <g key={pulseId} className={styles.pulseGroup}>
            <circle r="6" className={styles.pulse}>
              <animateMotion dur="2.4s" repeatCount="1" path={traveledPath} />
            </circle>
            <text className={styles.pulseLabel} textAnchor="middle" dy="-14">
              {signal.kind}
              <animateMotion dur="2.4s" repeatCount="1" path={traveledPath} />
            </text>
          </g>
        )}

        {/* nodes */}
        <CpuNode x={30} y={140} r={20} label="In" active={!!signal} />
        <CpuNode x={180} y={140} r={42} label="Control Unit" active={!!signal} />
        <CpuNode x={380} y={60} r={38} label="ALU" active={toALU} dim={!toALU} />
        <CpuNode x={380} y={140} r={38} label="Memory" active={!!signal} />
        <CpuNode x={640} y={140} r={20} label="Out" active={!!signal} />

        {/* secondary storage sits outside the CPU boundary, connected via memory */}
        <CpuNode
          x={600}
          y={220}
          r={34}
          label="Secondary Storage"
          active={toStorage}
          dim={!toStorage}
          outside
        />
      </svg>

      <p className={styles.caption}>
        {signal ? signal.detail : 'Trigger an input to watch the signal move through the CPU.'}
      </p>
    </div>
  );
}

function CpuNode({ x, y, r, label, active, dim, outside }) {
  return (
    <g
      className={[
        active ? styles.nodeActive : '',
        dim ? styles.nodeDim : '',
        outside ? styles.nodeOutside : '',
      ].join(' ')}
    >
      <circle cx={x} cy={y} r={r} className={styles.node} />
      <text x={x} y={y + 4} textAnchor="middle" className={styles.nodeLabel}>
        {label}
      </text>
    </g>
  );
}