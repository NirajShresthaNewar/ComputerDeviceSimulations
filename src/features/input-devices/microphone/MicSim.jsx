import { useState } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import CpuInternalsDiagram from '../../../components/simulation-shell/CpuInternalsDiagram';
import SoundWaveTravel from './SoundWaveTravel';
import WaveformCanvas from './WaveformCanvas';
import VolumeMeter from './VolumeMeter';
import { useAudioStream } from './useAudioStream';
import styles from './MicSim.module.css';

export default function MicSim() {
  const { isActive, error, volume, analyser, start, stop } = useAudioStream();
  const [signal, setSignal] = useState(null);

  // Whenever volume crosses an audible threshold, log it as a Data signal
  // (throttled implicitly since this only runs on volume state changes that matter)
  const prevLoud = useState(false)[0];
  if (isActive && volume > 0.15 && (!signal || signal.kind !== 'Data')) {
    setSignal({
      kind: 'Data',
      usesALU: false,
      usesStorage: false,
      detail: `The microphone's diaphragm converted air pressure into an analog electrical signal, which was sampled into digital audio data. The Control Unit routed this data through Memory as an audio buffer.`,
    });
  }

  const simulateContent = (
    <div className={styles.simulateGrid}>
      <div className={styles.left}>
        <SoundWaveTravel volume={volume} isActive={isActive} />

        {!isActive && (
          <button className={styles.enableBtn} onClick={start}>
            🎙 Enable Microphone
          </button>
        )}
        {isActive && (
          <button className={styles.stopBtn} onClick={stop}>
            Stop
          </button>
        )}
        {error && <p className={styles.error}>{error}</p>}

        <WaveformCanvas analyser={analyser} isActive={isActive} />
        <VolumeMeter volume={volume} />
      </div>
      <div className={styles.right}>
        <CpuInternalsDiagram signal={signal} />
      </div>
    </div>
  );

  const learnContent = (
    <ExplanationPanel
      description="A microphone converts sound — physical vibrations traveling through air — into an electrical signal. Inside, a thin diaphragm vibrates in response to incoming sound waves, and that vibration is converted into a varying electrical voltage. A sound card then samples this analog signal thousands of times per second, converting it into digital audio data the CPU can store, process, or send to speech-recognition software."
      advantages={[
        'Captures natural speech and sound directly',
        'Enables hands-free input via voice commands',
        'Essential for calls, recording, and voice assistants',
        'Modern mics are highly sensitive and compact',
      ]}
      disadvantages={[
        'Picks up background noise without filtering',
        'Raises privacy concerns if always-on',
        'Voice recognition accuracy varies by accent/environment',
        'Requires quiet conditions for best results',
      ]}
      uses={[
        'Voice calls and video conferencing',
        'Voice assistants and dictation software',
        'Audio and podcast recording',
        'Voice-controlled accessibility tools',
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
      <h1>Microphone</h1>
      <p className={styles.subtitle}>
        Enable your microphone to see real sound travel from source to signal.
      </p>
      <SimTabs learnContent={learnContent} simulateContent={simulateContent} quizContent={quizContent} />
    </div>
  );
}