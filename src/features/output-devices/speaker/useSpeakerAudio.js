import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook that drives a Web Audio oscillator + analyser.
 * Returns controls (start / stop / setFrequency / setVolume / setWaveform)
 * and real-time data (timeDomainData, frequencyData, coneDisplacement).
 */
export function useSpeakerAudio() {
  const [playing, setPlaying] = useState(false);
  const [frequency, setFrequencyState] = useState(440);
  const [volume, setVolumeState] = useState(0.35);
  const [waveform, setWaveformState] = useState('sine'); // sine | square | triangle | sawtooth

  // Real-time data exposed to canvas renderers
  const [timeDomain, setTimeDomain] = useState(() => new Uint8Array(256));
  const [freqData, setFreqData] = useState(() => new Uint8Array(128));
  const [coneDisplacement, setConeDisplacement] = useState(0); // -1 … 1

  const ctxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  /* ---------- tick: pull analyser data each frame ---------- */
  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const td = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(td);
    setTimeDomain(td);

    const fd = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fd);
    setFreqData(fd);

    // Derive cone displacement from the instantaneous sample at index 0
    // Map 0-255 → -1 … 1
    setConeDisplacement((td[0] - 128) / 128);

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  /* ---------- start ---------- */
  const start = useCallback(() => {
    if (ctxRef.current) return; // already playing

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;

    osc.type = waveform;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    osc.connect(gain).connect(analyser).connect(ctx.destination);
    osc.start();

    ctxRef.current = ctx;
    oscRef.current = osc;
    gainRef.current = gain;
    analyserRef.current = analyser;

    setPlaying(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [frequency, volume, waveform, tick]);

  /* ---------- stop ---------- */
  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
    gainRef.current = null;
    analyserRef.current = null;
    setPlaying(false);
    setConeDisplacement(0);
    setTimeDomain(new Uint8Array(256));
    setFreqData(new Uint8Array(128));
  }, []);

  /* ---------- live parameter updates ---------- */
  const setFrequency = useCallback((f) => {
    setFrequencyState(f);
    if (oscRef.current && ctxRef.current) {
      oscRef.current.frequency.setValueAtTime(f, ctxRef.current.currentTime);
    }
  }, []);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setValueAtTime(v, ctxRef.current.currentTime);
    }
  }, []);

  const setWaveform = useCallback((w) => {
    setWaveformState(w);
    if (oscRef.current) {
      oscRef.current.type = w;
    }
  }, []);

  /* cleanup on unmount */
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (_) { /* already stopped */ }
        oscRef.current.disconnect();
      }
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  return {
    playing,
    start,
    stop,
    frequency,
    setFrequency,
    volume,
    setVolume,
    waveform,
    setWaveform,
    timeDomain,
    freqData,
    coneDisplacement,
  };
}
