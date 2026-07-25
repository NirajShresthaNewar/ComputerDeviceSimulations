import React from 'react';
import styles from './TapeSim.module.css';

/**
 * Renders the physical tape drive mechanism:
 * - Left Reel (Supply Reel)
 * - Right Reel (Take-up Reel)
 * - Tape path winding around rollers, tension arms, and head
 * - Mechanical animations (reel rotations, tension arm flexes)
 * 
 * @param {Object} props
 * @param {number} props.position - Normalised tape position (0 = all on left/supply reel, 1 = all on right/take-up)
 * @param {number} props.rotation - Current cumulative rotation angle of the reels in degrees
 * @param {boolean} props.playing - Whether the tape is currently moving
 * @param {string} props.direction - Moving direction: 'forward' | 'reverse' | 'idle'
 */
export default function TapeDriveDiagram({ position = 0, rotation = 0, playing = false, direction = 'idle' }) {
  const width = 500;
  const height = 280;

  // Geometry parameters
  const leftX = 135;
  const rightX = 365;
  const reelY = 110;
  
  const minReelRadius = 24;
  const maxReelRadius = 75;

  // Calculate dynamic tape pack thickness
  // Volume is conserved: R^2 = R_min^2 + (R_max^2 - R_min^2) * fraction
  const leftRadius = Math.sqrt(minReelRadius ** 2 + (maxReelRadius ** 2 - minReelRadius ** 2) * (1 - position));
  const rightRadius = Math.sqrt(minReelRadius ** 2 + (maxReelRadius ** 2 - minReelRadius ** 2) * position);

  // Rollers and Head geometry
  const leftGuideX = 135;
  const leftGuideY = 210;
  
  const rightGuideX = 365;
  const rightGuideY = 210;

  const headX = 250;
  const headY = 210;
  const headWidth = 55;
  const headHeight = 40;

  // Capstans next to head
  const leftCapstanX = 205;
  const leftCapstanY = 210;
  const rightCapstanX = 295;
  const rightCapstanY = 210;

  // Tension arms deflection based on movement status (flexes slightly during start/stop/seek)
  const armDeflection = playing ? (direction === 'forward' ? 3 : -3) : 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={styles.tapeDeckSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metal background panel gradient */}
        <linearGradient id="deckPanelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Acrylic reel gradients */}
        <radialGradient id="leftReelGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#b91c1c" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="rightReelGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
        </radialGradient>

        {/* Brushed aluminum metallic highlights */}
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Glowing Head filter */}
        <filter id="headGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Deck Faceplate */}
      <rect x="10" y="10" width={width - 20} height={height - 20} rx="16" fill="url(#deckPanelGrad)" stroke="#334155" strokeWidth="3" />
      <rect x="15" y="15" width={width - 30} height={height - 30} rx="12" fill="none" stroke="#1e293b" strokeWidth="1" />

      {/* Tape Path Line (The actual tape wrapping from left pack, around rollers, capstans, head, to right pack) */}
      <path
        d={`
          M ${leftX - leftRadius},${reelY} 
          A ${leftRadius},${leftRadius} 0 0,0 ${leftX + leftRadius},${reelY}
          L ${leftGuideX + armDeflection},${leftGuideY}
          L ${leftCapstanX},${leftCapstanY + 6}
          L ${headX},${headY + 6}
          L ${rightCapstanX},${rightCapstanY + 6}
          L ${rightGuideX - armDeflection},${rightGuideY}
          L ${rightX - rightRadius},${reelY}
          A ${rightRadius},${rightRadius} 0 0,0 ${rightX + rightRadius},${reelY}
        `}
        fill="none"
        stroke="#78716c" // tape color: oxide brown/gray
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── LEFT REEL (Supply) ── */}
      <g transform={`translate(${leftX}, ${reelY})`}>
        {/* Dynamic Magnetic Tape Pack */}
        {leftRadius > minReelRadius && (
          <circle cx="0" cy="0" r={leftRadius} fill="#57534e" stroke="#292524" strokeWidth="0.5" />
        )}
        
        {/* Reel flange (spokes & body) rotating */}
        <g transform={`rotate(${rotation})`}>
          <circle cx="0" cy="0" r={maxReelRadius} fill="url(#leftReelGrad)" stroke="#f87171" strokeWidth="1" opacity="0.85" />
          {/* Radial slots/spokes in acrylic */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={angle}
              x1="0"
              y1="0"
              x2={maxReelRadius * 0.85 * Math.cos((angle * Math.PI) / 180)}
              y2={maxReelRadius * 0.85 * Math.sin((angle * Math.PI) / 180)}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2.5"
            />
          ))}
          {/* Outer circle decoration */}
          <circle cx="0" cy="0" r={maxReelRadius * 0.85} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </g>

        {/* Center Metal Hub (doesn't change size, just rotates) */}
        <g transform={`rotate(${rotation})`}>
          <circle cx="0" cy="0" r="20" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1" />
          <circle cx="0" cy="0" r="8" fill="#1e293b" />
          {/* 3 spoke lock-pins */}
          {[0, 120, 240].map((angle) => (
            <circle
              key={angle}
              cx={13 * Math.cos((angle * Math.PI) / 180)}
              cy={13 * Math.sin((angle * Math.PI) / 180)}
              r="2.5"
              fill="#cbd5e1"
            />
          ))}
        </g>
      </g>

      {/* ── RIGHT REEL (Take-up) ── */}
      <g transform={`translate(${rightX}, ${reelY})`}>
        {/* Dynamic Magnetic Tape Pack */}
        {rightRadius > minReelRadius && (
          <circle cx="0" cy="0" r={rightRadius} fill="#57534e" stroke="#292524" strokeWidth="0.5" />
        )}
        
        {/* Reel flange (spokes & body) rotating */}
        <g transform={`rotate(${rotation})`}>
          <circle cx="0" cy="0" r={maxReelRadius} fill="url(#rightReelGrad)" stroke="#60a5fa" strokeWidth="1" opacity="0.85" />
          {/* Radial slots/spokes in acrylic */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={angle}
              x1="0"
              y1="0"
              x2={maxReelRadius * 0.85 * Math.cos((angle * Math.PI) / 180)}
              y2={maxReelRadius * 0.85 * Math.sin((angle * Math.PI) / 180)}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2.5"
            />
          ))}
          {/* Outer circle decoration */}
          <circle cx="0" cy="0" r={maxReelRadius * 0.85} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </g>

        {/* Center Metal Hub */}
        <g transform={`rotate(${rotation})`}>
          <circle cx="0" cy="0" r="20" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1" />
          <circle cx="0" cy="0" r="8" fill="#1e293b" />
          {/* 3 spoke lock-pins */}
          {[0, 120, 240].map((angle) => (
            <circle
              key={angle}
              cx={13 * Math.cos((angle * Math.PI) / 180)}
              cy={13 * Math.sin((angle * Math.PI) / 180)}
              r="2.5"
              fill="#cbd5e1"
            />
          ))}
        </g>
      </g>

      {/* ── TAPE GUIDES / TENSION ARMS ── */}
      {/* Left guide roller */}
      <circle cx={leftGuideX + armDeflection} cy={leftGuideY} r="10" fill="url(#metalGrad)" stroke="#334155" strokeWidth="1" />
      <circle cx={leftGuideX + armDeflection} cy={leftGuideY} r="4" fill="#1e293b" />

      {/* Right guide roller */}
      <circle cx={rightGuideX - armDeflection} cy={rightGuideY} r="10" fill="url(#metalGrad)" stroke="#334155" strokeWidth="1" />
      <circle cx={rightGuideX - armDeflection} cy={rightGuideY} r="4" fill="#1e293b" />

      {/* ── CAPSTANS & PINCH ROLLERS ── */}
      {/* Left Capstan */}
      <circle cx={leftCapstanX} cy={leftCapstanY} r="7" fill="url(#metalGrad)" stroke="#334155" strokeWidth="1" />
      <circle cx={leftCapstanX} cy={leftCapstanY + 6} r="5" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />

      {/* Right Capstan */}
      <circle cx={rightCapstanX} cy={rightCapstanY} r="7" fill="url(#metalGrad)" stroke="#334155" strokeWidth="1" />
      <circle cx={rightCapstanX} cy={rightCapstanY + 6} r="5" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />

      {/* ── TAPE HEAD ASSEMBLY ── */}
      <g transform={`translate(${headX - headWidth / 2}, ${headY - headHeight / 2})`}>
        {/* Head shielding block */}
        <rect
          x="0"
          y="0"
          width={headWidth}
          height={headHeight}
          rx="6"
          fill="#334155"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        {/* Metal core inserts for Read/Write segments */}
        <rect x="12" y="5" width="10" height="30" rx="2" fill="#475569" />
        <rect x="33" y="5" width="10" height="30" rx="2" fill="#475569" />

        {/* Read / Write core gaps glowing when reading/writing */}
        <line
          x1="17" y1="3" x2="17" y2="37"
          stroke={playing && direction !== 'idle' ? '#60a5fa' : '#64748b'}
          strokeWidth="2.5"
          filter={playing && direction !== 'idle' ? 'url(#headGlow)' : 'none'}
        />
        <line
          x1="38" y1="3" x2="38" y2="37"
          stroke={playing && direction === 'forward' && !playing ? '#ef4444' : (playing ? '#34d399' : '#64748b')}
          strokeWidth="2.5"
          filter={playing ? 'url(#headGlow)' : 'none'}
        />

        {/* Head labels */}
        <text x="17" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">R</text>
        <text x="38" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">W</text>
      </g>

      {/* Status LEDs on mechanical deck */}
      <circle cx="35" cy="35" r="4" fill={playing ? '#22c55e' : '#475569'} stroke="#1e293b" strokeWidth="1" />
      <text x="46" y="38" fill="#94a3b8" fontSize="9" fontFamily="monospace">RUN</text>

      <circle cx="35" cy="50" r="4" fill={direction === 'reverse' ? '#e11d48' : '#475569'} stroke="#1e293b" strokeWidth="1" />
      <text x="46" y="53" fill="#94a3b8" fontSize="9" fontFamily="monospace">REV</text>
    </svg>
  );
}
