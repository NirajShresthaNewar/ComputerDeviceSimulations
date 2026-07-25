import { useState } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import SpeakerCutaway from './SpeakerCutaway';
import WaveformCanvas from './WaveformCanvas';
import { useSpeakerAudio } from './useSpeakerAudio';
import styles from './SpeakerSim.module.css';

const WAVEFORMS = ['sine', 'square', 'triangle', 'sawtooth'];

const PRESETS = [
  { label: 'Bass 80 Hz', freq: 80 },
  { label: 'Mid 440 Hz', freq: 440 },
  { label: 'A4 Note', freq: 440 },
  { label: 'C5 Note', freq: 523 },
  { label: 'Treble 2 kHz', freq: 2000 },
  { label: 'High 5 kHz', freq: 5000 },
];

const PROCESS_STEPS = [
  {
    title: 'Digital → Analog',
    desc: 'The DAC (Digital-to-Analog Converter) transforms binary data into a continuous electrical audio signal (AC voltage).',
  },
  {
    title: 'Voice Coil Energized',
    desc: 'The AC signal flows through the voice coil, creating an alternating magnetic field that interacts with the permanent magnet.',
  },
  {
    title: 'Coil Oscillates',
    desc: `The changing polarity of the coil's magnetic field causes it to be attracted and repelled by the permanent magnet, oscillating back and forth.`,
  },
  {
    title: 'Cone Vibrates',
    desc: 'The voice coil is attached to the speaker cone (diaphragm), which vibrates in sync, pushing and pulling the surrounding air.',
  },
  {
    title: 'Sound Waves Propagate',
    desc: 'The vibrating cone creates alternating regions of high pressure (compression) and low pressure (rarefaction) that travel through the air.',
  },
  {
    title: 'Ear Perceives Sound',
    desc: 'These pressure waves reach your eardrum, which vibrates and your brain interprets the pattern as sound — pitch, volume, and timbre.',
  },
];

export default function SpeakerSim() {
  const {
    playing, start, stop,
    frequency, setFrequency,
    volume, setVolume,
    waveform, setWaveform,
    timeDomain, freqData,
    coneDisplacement,
  } = useSpeakerAudio();

  /* ---- Simulate Tab ---- */
  const simulateContent = (
    <div className={styles.simLayout}>
      {/* Row 1: Cutaway + Controls */}
      <div className={styles.topRow}>
        <SpeakerCutaway
          coneDisplacement={coneDisplacement}
          playing={playing}
          volume={volume}
        />

        <div className={styles.controlsPanel}>
          {/* Play / Stop */}
          <div className={styles.playBtns}>
            {!playing ? (
              <button className={`${styles.btnPlay} ${styles.btnStart}`} onClick={start}>
                ▶ Play Sound
              </button>
            ) : (
              <button className={`${styles.btnPlay} ${styles.btnStop}`} onClick={stop}>
                ■ Stop
              </button>
            )}
          </div>

          {/* Frequency slider */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              <span>Frequency</span>
              <span className={styles.controlValue}>{frequency} Hz</span>
            </label>
            <input
              type="range"
              min="20"
              max="8000"
              step="1"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.presets}>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  className={styles.presetChip}
                  onClick={() => setFrequency(p.freq)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Volume slider */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              <span>Volume</span>
              <span className={styles.controlValue}>{Math.round(volume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          {/* Waveform selector */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              <span>Waveform Type</span>
            </label>
            <div className={styles.waveformBtns}>
              {WAVEFORMS.map((w) => (
                <button
                  key={w}
                  className={`${styles.waveBtn} ${waveform === w ? styles.waveBtnActive : ''}`}
                  onClick={() => setWaveform(w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className={styles.infoBar}>
            <div className={styles.infoItem}>
              <span className={`${styles.infoDot} ${playing ? styles.infoDotPlaying : styles.infoDotStopped}`} />
              {playing ? 'Playing' : 'Stopped'}
            </div>
            <div className={styles.infoItem}>
              Wave: {waveform}
            </div>
            <div className={styles.infoItem}>
              {frequency < 200 ? 'Bass' : frequency < 2000 ? 'Mid' : 'Treble'} Range
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Waveform + Spectrum */}
      <WaveformCanvas
        timeDomain={timeDomain}
        freqData={freqData}
        waveform={waveform}
        playing={playing}
      />

      {/* Row 3: How it works concept diagram */}
      <div className={styles.conceptDiagram}>
        <h3 className={styles.conceptTitle}>How a Speaker Converts Electricity → Sound</h3>
        <p className={styles.conceptText}>
          A dynamic loudspeaker converts electrical energy into mechanical vibrations that push air molecules,
          creating pressure waves our ears perceive as sound. Here is the step-by-step process:
        </p>
        <div className={styles.conceptSteps}>
          {PROCESS_STEPS.map((step, i) => (
            <div key={i} className={styles.conceptStep}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <div className={styles.stepContent}>
                <p className={styles.stepTitle}>{step.title}</p>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ---- Learn Tab ---- */
  const learnContent = (
    <ExplanationPanel
      description="A Speaker (loudspeaker) is an electroacoustic transducer that converts electrical audio signals into sound waves. The most common type is the dynamic (moving-coil) speaker. It uses a permanent magnet, a voice coil (a tightly wound coil of wire attached to the speaker cone), and a flexible cone-shaped diaphragm. When alternating current (AC) from an audio amplifier flows through the voice coil, it creates an electromagnetic field that interacts with the permanent magnet's field. This causes the coil — and the attached cone — to vibrate back and forth rapidly. These vibrations push and pull the surrounding air, creating compression (high-pressure) and rarefaction (low-pressure) waves that propagate outward as sound. The frequency of vibration determines the pitch (e.g., 440 Hz = note A4), while the amplitude determines the loudness."
      advantages={[
        'Can reproduce a wide range of frequencies (20 Hz – 20 kHz for full-range speakers)',
        'Simple, robust electromechanical design with no moving electronics',
        'Available in many sizes: tweeters for high frequencies, woofers for bass, subwoofers for deep bass',
        'Can be combined into multi-driver speaker systems for high-fidelity audio reproduction',
      ]}
      disadvantages={[
        'Single drivers cannot accurately reproduce the full audible frequency range',
        'Physical cone vibration introduces distortion at very high volumes',
        'Require enclosures (cabinets) to prevent sound cancellation between front and back waves',
        'Power-hungry — larger speakers and higher volumes need powerful amplifiers',
      ]}
      uses={[
        'Headphones, earbuds, and personal audio devices',
        'Computer speakers, TV speakers, and home theater surround systems',
        'Public address (PA) systems, concert venues, and stadium sound reinforcement',
        'Car audio systems, smart speakers, and portable Bluetooth speakers',
      ]}
    />
  );

  /* ---- Quiz Tab ---- */
  const quizContent = (
    <p style={{ color: 'var(--color-text-muted)' }}>
      Quiz questions for this device are coming in Phase 6.
    </p>
  );

  return (
    <div>
      <h1>Speaker Simulation</h1>
      <p className={styles.subtitle}>
        Explore how electrical signals become sound waves through a dynamic loudspeaker.
      </p>
      <SimTabs
        learnContent={learnContent}
        simulateContent={simulateContent}
        quizContent={quizContent}
      />
    </div>
  );
}
