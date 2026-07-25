import { useRef, useEffect } from 'react';
import styles from './SpeakerSim.module.css';

/**
 * Animated SVG cutaway diagram of a dynamic (moving-coil) loudspeaker.
 * The cone, voice coil, and dust cap move vertically based on `coneDisplacement` (-1…1).
 * Sound-wave arcs propagate outward when playing.
 */
export default function SpeakerCutaway({ coneDisplacement = 0, playing = false, volume = 0.35 }) {
  const W = 480, H = 360;
  // The max pixel travel of the cone
  const maxTravel = 18;
  const dy = coneDisplacement * maxTravel;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={styles.cutawaySvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for the magnet */}
        <linearGradient id="magnetGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        {/* Gradient for the frame / basket */}
        <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        {/* Glow filter for voice coil */}
        <filter id="coilGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Glow filter for sound waves */}
        <filter id="waveGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width={W} height={H} rx="16" fill="#0f172a" />

      {/* ---- Frame / Basket (static) ---- */}
      <path
        d={`M 90,${H/2 - 130} L 220,${H/2 - 40} L 220,${H/2 + 40} L 90,${H/2 + 130} Z`}
        fill="url(#frameGrad)"
        stroke="#64748b"
        strokeWidth="2"
        opacity="0.85"
      />
      {/* Back plate */}
      <rect x="60" y={H/2 - 135} width="35" height="270" rx="6" fill="#334155" stroke="#475569" strokeWidth="1.5" />

      {/* ---- Permanent Magnet (static) ---- */}
      <rect x="100" y={H/2 - 35} width="80" height="70" rx="4" fill="url(#magnetGrad)" stroke="#8b5cf6" strokeWidth="1.5" />
      {/* Magnet pole labels */}
      <text x="115" y={H/2 - 8} fill="#e2e8f0" fontSize="11" fontWeight="700" fontFamily="monospace">N</text>
      <text x="115" y={H/2 + 22} fill="#e2e8f0" fontSize="11" fontWeight="700" fontFamily="monospace">S</text>
      {/* Magnet field lines */}
      <path d="M 155,155 C 170,140 195,140 195,160" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5" strokeDasharray="3 3">
        <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M 155,205 C 170,220 195,220 195,200" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5" strokeDasharray="3 3">
        <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="2s" repeatCount="indefinite" />
      </path>

      {/* ---- Voice Coil (moves with cone) ---- */}
      <g transform={`translate(0, ${dy})`}>
        <rect
          x="185" y={H/2 - 22} width="18" height="44" rx="3"
          fill={playing ? '#f59e0b' : '#78716c'}
          stroke={playing ? '#fbbf24' : '#a8a29e'}
          strokeWidth="1.5"
          filter={playing ? 'url(#coilGlow)' : 'none'}
        />
        {/* Coil wire windings */}
        {[...Array(6)].map((_, i) => (
          <line
            key={i}
            x1="187" y1={H/2 - 18 + i * 8}
            x2="201" y2={H/2 - 18 + i * 8}
            stroke={playing ? '#fef3c7' : '#d6d3d1'}
            strokeWidth="1"
            opacity="0.7"
          />
        ))}
      </g>

      {/* ---- Spider / Suspension (flexes) ---- */}
      <path
        d={`M 218,${H/2 - 38 + dy * 0.5}
            C 225,${H/2 - 45 + dy * 0.3} 230,${H/2 - 32 + dy * 0.7} 240,${H/2 - 38 + dy}
            `}
        fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.6"
      />
      <path
        d={`M 218,${H/2 + 38 + dy * 0.5}
            C 225,${H/2 + 45 + dy * 0.3} 230,${H/2 + 32 + dy * 0.7} 240,${H/2 + 38 + dy}
            `}
        fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.6"
      />

      {/* ---- Cone / Diaphragm (moves) ---- */}
      <g transform={`translate(0, ${dy})`}>
        <path
          d={`M 240,${H/2 - 40} L 330,${H/2 - 115} L 330,${H/2 + 115} L 240,${H/2 + 40} Z`}
          fill="#1e293b"
          stroke="#38bdf8"
          strokeWidth="2"
          opacity="0.9"
        />
        {/* Cone surface texture lines */}
        {[...Array(5)].map((_, i) => {
          const t = (i + 1) / 6;
          const x = 240 + t * 90;
          const yTop = (H/2 - 40) + t * ((H/2 - 115) - (H/2 - 40));
          const yBot = (H/2 + 40) + t * ((H/2 + 115) - (H/2 + 40));
          return (
            <line key={i} x1={x} y1={yTop} x2={x} y2={yBot}
              stroke="#38bdf8" strokeWidth="0.5" opacity="0.3" />
          );
        })}
      </g>

      {/* ---- Dust Cap (moves) ---- */}
      <g transform={`translate(0, ${dy})`}>
        <ellipse cx="240" cy={H/2} rx="16" ry="20" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
      </g>

      {/* ---- Surround / Edge suspension (flexes subtly) ---- */}
      <ellipse
        cx="330" cy={H/2 + dy * 0.6}
        rx="6" ry={115 + Math.abs(dy) * 0.5}
        fill="none"
        stroke="#64748b"
        strokeWidth="3"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* ---- Sound Wave Arcs (visible when playing) ---- */}
      {playing && [1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M 340,${H/2 - 80} A ${40 * i},${60 * i} 0 0 1 340,${H/2 + 80}`}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={2.5 - i * 0.4}
          filter="url(#waveGlow)"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values={`${0.7 * volume / 0.5};0`}
            dur={`${0.6 + i * 0.35}s`}
            begin={`${i * 0.18}s`}
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0;${30 + i * 20},0`}
            dur={`${0.6 + i * 0.35}s`}
            begin={`${i * 0.18}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {/* ---- Labels ---- */}
      <text x="55" y="38" fill="#94a3b8" fontSize="11" fontFamily="monospace">Back Plate</text>
      <line x1="77" y1="42" x2="77" y2={H/2 - 138} stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 2" />

      <text x="110" y="38" fill="#a78bfa" fontSize="11" fontFamily="monospace">Magnet</text>
      <line x1="140" y1="42" x2="140" y2={H/2 - 38} stroke="#8b5cf6" strokeWidth="0.8" strokeDasharray="3 2" />

      <text x="180" y="38" fill="#fbbf24" fontSize="11" fontFamily="monospace">Voice Coil</text>
      <line x1="197" y1="42" x2="197" y2={H/2 - 26 + dy} stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2" />

      <text x="270" y="38" fill="#38bdf8" fontSize="11" fontFamily="monospace">Cone</text>
      <line x1="285" y1="42" x2="285" y2={H/2 - 80 + dy} stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 2" />

      <text x="180" y={H - 22} fill="#94a3b8" fontSize="11" fontFamily="monospace">Spider</text>
      <line x1="205" y1={H - 28} x2="225" y2={H/2 + 42 + dy * 0.5} stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 2" />

      {playing && (
        <text x="370" y="38" fill="#38bdf8" fontSize="11" fontFamily="monospace" opacity="0.8">
          Sound Waves
        </text>
      )}

      {/* ---- Electrical signal indicator ---- */}
      <g>
        <text x="20" y={H/2 - 2} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" transform={`rotate(-90, 20, ${H/2})`}>
          {playing ? 'AC Signal →' : 'No Signal'}
        </text>
        {playing && (
          <>
            <line x1="38" y1={H/2 - 10} x2="55" y2={H/2 - 10} stroke="#22d3ee" strokeWidth="1.5">
              <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
            </line>
            <line x1="38" y1={H/2 + 10} x2="55" y2={H/2 + 10} stroke="#22d3ee" strokeWidth="1.5">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="0.5s" repeatCount="indefinite" />
            </line>
          </>
        )}
      </g>
    </svg>
  );
}
