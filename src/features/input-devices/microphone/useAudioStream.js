import { useState, useRef, useCallback, useEffect } from 'react';

export function useAudioStream() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(0); // 0–1 normalized

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafRef = useRef(null);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioCtxRef.current?.close();
    setIsActive(false);
    setVolume(0);
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      setIsActive(true);
    } catch (err) {
      setError(
        err.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Allow access in your browser settings to try again.'
          : 'Could not access the microphone on this device.'
      );
    }
  }, []);

  // Continuously sample volume while active
  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;
      if (analyser && dataArray) {
        analyser.getByteTimeDomainData(dataArray);
        // RMS amplitude relative to silence (128 = center of 0-255 range)
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        setVolume(Math.min(1, rms * 4)); // scaled up for visible response
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive]);

  useEffect(() => stop, [stop]);

  return {
    isActive,
    error,
    volume,
    analyser: analyserRef.current,
    start,
    stop,
  };
}