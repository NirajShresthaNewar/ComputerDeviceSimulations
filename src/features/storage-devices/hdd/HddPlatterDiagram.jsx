import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './HddPlatterDiagram.module.css';

const SECTOR_COUNT = 12;
const CENTER = { x: 210, y: 190 };
const PIVOT = { x: 60, y: 340 };
const ARM_LENGTH = 230;
const TRACK_RADII = [40, 65, 90, 115, 140, 160]; // innermost to outermost
const PLATTER_RPM_VISUAL = 30; // visual RPM (kept slow enough to see sectors)
const DEG_PER_MS = (PLATTER_RPM_VISUAL * 360) / 60000;

// Precompute the angle-to-center and distance-to-center once — fixed geometry constants
const DIST_PIVOT_CENTER = Math.hypot(CENTER.x - PIVOT.x, CENTER.y - PIVOT.y);
const ANGLE_TO_CENTER_DEG = (Math.atan2(CENTER.y - PIVOT.y, CENTER.x - PIVOT.x) * 180) / Math.PI;

// Law of cosines: given a fixed arm length and fixed pivot-to-center distance,
// solve for the arm angle that places the head exactly at radius `r` from center.
function armAngleForRadius(r) {
    const cosTheta =
        (ARM_LENGTH ** 2 + DIST_PIVOT_CENTER ** 2 - r ** 2) / (2 * ARM_LENGTH * DIST_PIVOT_CENTER);
    const theta = (Math.acos(Math.min(1, Math.max(-1, cosTheta))) * 180) / Math.PI;
    return ANGLE_TO_CENTER_DEG - theta;
}

// Inverse: given an arm angle, where is the head, and how far from center is it?
function headPositionForAngle(angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    const x = PIVOT.x + ARM_LENGTH * Math.cos(rad);
    const y = PIVOT.y + ARM_LENGTH * Math.sin(rad);
    return { x, y };
}

export default function HddPlatterDiagram({ onSectorRead }) {
    const [rotation, setRotation] = useState(0);
    const [phase, setPhase] = useState('idle');
    const [armAngle, setArmAngle] = useState(armAngleForRadius(TRACK_RADII[0]));
    const [target, setTarget] = useState(null);
    const [readFlash, setReadFlash] = useState(false);
    const [litSector, setLitSector] = useState(null);

    const rotationRef = useRef(0);
    const spinRafRef = useRef(null);
    const checkRafRef = useRef(null);

    // ── Continuous platter spin ──────────────────────────────────────────
    // Always runs — the platter never stops spinning, just like a real HDD.
    useEffect(() => {
        let lastTime = performance.now();

        const spin = (now) => {
            const dt = now - lastTime;
            lastTime = now;
            rotationRef.current = (rotationRef.current + DEG_PER_MS * dt) % 360;
            setRotation(rotationRef.current);
            spinRafRef.current = requestAnimationFrame(spin);
        };

        spinRafRef.current = requestAnimationFrame(spin);
        return () => cancelAnimationFrame(spinRafRef.current);
    }, []);

    // ── Sector detection (rotational latency phase) ─────────────────────
    // Once the arm has finished seeking, we wait for the spinning platter
    // to bring the target sector under the (now stationary) head.
    useEffect(() => {
        if (phase !== 'rotating' || !target) return;

        const sectorAngleSize = 360 / SECTOR_COUNT;

        // Compute the fixed angular position of the head relative to platter center
        const targetArmAngle = armAngleForRadius(TRACK_RADII[target.track]);
        const headPos = headPositionForAngle(targetArmAngle);
        const headAngleDeg =
            ((Math.atan2(headPos.y - CENTER.y, headPos.x - CENTER.x) * 180) / Math.PI + 360) % 360;

        const checkRotation = () => {
            const rot = rotationRef.current;
            // The platter rotates clockwise by `rot` degrees.
            // A sector drawn at angle `S` (in platter-local coords) is now
            // visually at angle `S + rot` in world-space.
            // The head is fixed at `headAngleDeg` in world-space.
            // So the platter-local angle under the head is `headAngleDeg - rot`.
            const localAngle = ((headAngleDeg - rot) % 360 + 360) % 360;
            const sectorUnderHead = Math.floor(localAngle / sectorAngleSize) % SECTOR_COUNT;

            if (sectorUnderHead === target.sector) {
                setPhase('reading');
                setReadFlash(true);
                setLitSector({ ...target });

                setTimeout(() => {
                    setReadFlash(false);
                    setPhase('idle');
                    setTarget(null);
                    onSectorRead?.(target);
                    setTimeout(() => setLitSector(null), 900);
                }, 500);
            } else {
                checkRafRef.current = requestAnimationFrame(checkRotation);
            }
        };

        checkRafRef.current = requestAnimationFrame(checkRotation);
        return () => cancelAnimationFrame(checkRafRef.current);
    }, [phase, target, onSectorRead]);

    const handleSectorClick = useCallback(
        (trackIndex, sectorIndex) => {
            if (phase !== 'idle') return;
            setTarget({ track: trackIndex, sector: sectorIndex });
            setLitSector(null);
            setPhase('seeking');

            const targetArmAngle = armAngleForRadius(TRACK_RADII[trackIndex]);
            const seekStart = performance.now();
            const seekStartAngle = armAngle;
            const seekDuration = 600;

            const seekStep = (now) => {
                const t = Math.min(1, (now - seekStart) / seekDuration);
                const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic, feels more mechanical
                setArmAngle(seekStartAngle + (targetArmAngle - seekStartAngle) * eased);
                if (t < 1) {
                    requestAnimationFrame(seekStep);
                } else {
                    setPhase('rotating');
                }
            };
            requestAnimationFrame(seekStep);
        },
        [phase, armAngle]
    );

    const headPos = headPositionForAngle(armAngle);

    return (
        <div className={styles.wrap}>
            <svg viewBox="0 0 420 400" className={styles.svg}>
                <defs>
                    <radialGradient id="platterGrad" cx="50%" cy="50%" r="70%">
                        <stop offset="0%" stopColor="#2a3142" />
                        <stop offset="70%" stopColor="#1c2128" />
                        <stop offset="100%" stopColor="#12151b" />
                    </radialGradient>
                    <radialGradient id="spindleGrad" cx="40%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#4a5568" />
                        <stop offset="100%" stopColor="#20273A" />
                    </radialGradient>
                </defs>

                {/* platter body, rotating */}
                <g transform={`rotate(${rotation}, ${CENTER.x}, ${CENTER.y})`}>
                    <circle cx={CENTER.x} cy={CENTER.y} r="170" className={styles.platterBody} />

                    {TRACK_RADII.map((r, i) => (
                        <circle key={i} cx={CENTER.x} cy={CENTER.y} r={r} className={styles.trackRing} />
                    ))}

                    {TRACK_RADII.map((r, trackIndex) =>
                        Array.from({ length: SECTOR_COUNT }).map((_, sectorIndex) => {
                            const angleStep = 360 / SECTOR_COUNT;
                            const startAngle = sectorIndex * angleStep;
                            const isTarget =
                                target && target.track === trackIndex && target.sector === sectorIndex;
                            const isLit =
                                litSector && litSector.track === trackIndex && litSector.sector === sectorIndex;
                            return (
                                <SectorWedge
                                    key={`${trackIndex}-${sectorIndex}`}
                                    center={CENTER}
                                    innerR={trackIndex === 0 ? 22 : TRACK_RADII[trackIndex - 1]}
                                    outerR={r}
                                    startAngle={startAngle}
                                    angleStep={angleStep}
                                    active={isTarget}
                                    lit={isLit}
                                    onClick={() => handleSectorClick(trackIndex, sectorIndex)}
                                />
                            );
                        })
                    )}

                    <circle cx={CENTER.x} cy={CENTER.y} r="18" className={styles.spindle} />
                    <circle cx={CENTER.x} cy={CENTER.y} r="4" className={styles.spindleCenter} />
                </g>

                {/* actuator arm — fixed length, rotates around the pivot, head traces correct radius */}
                <line
                    x1={PIVOT.x}
                    y1={PIVOT.y}
                    x2={headPos.x}
                    y2={headPos.y}
                    className={styles.arm}
                />
                <circle
                    cx={headPos.x}
                    cy={headPos.y}
                    r="7"
                    className={readFlash ? `${styles.head} ${styles.headActive}` : styles.head}
                />
                <circle cx={PIVOT.x} cy={PIVOT.y} r="12" className={styles.actuatorPivot} />

                {readFlash && (
                    <>
                        <circle cx={headPos.x} cy={headPos.y} r="10" className={styles.readFlashRing} />
                        <circle cx={headPos.x} cy={headPos.y} r="22" className={styles.readFlashRing2} />
                    </>
                )}

                {/* labels */}
                <Label x={CENTER.x} y={CENTER.y - 100} labelX={310} labelY={40} text="Platter" />
                <Label x={CENTER.x} y={CENTER.y} labelX={300} labelY={70} text="Spindle (center hub)" small />
                <Label x={headPos.x} y={headPos.y} labelX={320} labelY={100} text="Read/write head" />
                <Label
                    x={(PIVOT.x + headPos.x) / 2}
                    y={(PIVOT.y + headPos.y) / 2}
                    labelX={20}
                    labelY={250}
                    text="Actuator arm"
                    small
                />
                <Label x={PIVOT.x} y={PIVOT.y} labelX={140} labelY={370} text="Actuator pivot" small />
            </svg>

            <p className={styles.caption}>
                {phase === 'idle' && 'Click any sector on the platter to simulate reading data from it.'}
                {phase === 'seeking' && '⏱ Seek time — the actuator arm is moving the head to the correct track.'}
                {phase === 'rotating' && '⏱ Rotational latency — waiting for the platter to spin the target sector under the head.'}
                {phase === 'reading' && '✓ Reading — the head is detecting the magnetic pattern at this exact sector.'}
            </p>
        </div>
    );
}

function Label({ x, y, labelX, labelY, text, small }) {
    return (
        <g className={styles.labelGroup}>
            <line x1={x} y1={y} x2={labelX} y2={labelY} className={styles.leaderLine} />
            <circle cx={x} cy={y} r="2.5" className={styles.leaderDot} />
            <text
                x={labelX}
                y={labelY}
                className={small ? styles.labelTextSmall : styles.labelText}
                textAnchor={labelX > CENTER.x ? 'start' : 'end'}
            >
                {text}
            </text>
        </g>
    );
}

function SectorWedge({ center, innerR, outerR, startAngle, angleStep, active, lit, onClick }) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const a1 = toRad(startAngle);
    const a2 = toRad(startAngle + angleStep);

    const p1 = { x: center.x + innerR * Math.cos(a1), y: center.y + innerR * Math.sin(a1) };
    const p2 = { x: center.x + outerR * Math.cos(a1), y: center.y + outerR * Math.sin(a1) };
    const p3 = { x: center.x + outerR * Math.cos(a2), y: center.y + outerR * Math.sin(a2) };
    const p4 = { x: center.x + innerR * Math.cos(a2), y: center.y + innerR * Math.sin(a2) };

    const d = `M${p1.x},${p1.y} L${p2.x},${p2.y} A${outerR},${outerR} 0 0,1 ${p3.x},${p3.y} L${p4.x},${p4.y} A${innerR},${innerR} 0 0,0 ${p1.x},${p1.y} Z`;

    const className = [
        styles.sector,
        active ? styles.sectorActive : '',
        lit ? styles.sectorLit : '',
    ].join(' ');

    return <path d={d} className={className} onClick={onClick} />;
}