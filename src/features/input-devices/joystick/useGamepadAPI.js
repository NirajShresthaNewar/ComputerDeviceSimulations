import { useState, useEffect, useRef } from 'react';

export function useGamepadAPI() {
  const [connected, setConnected] = useState(false);
  const [gamepadInfo, setGamepadInfo] = useState(null);
  const [axes, setAxes] = useState([0, 0, 0, 0]); // left X/Y, right X/Y
  const [buttons, setButtons] = useState([]); // array of { pressed, value }
  const rafRef = useRef(null);

  useEffect(() => {
    const handleConnect = (e) => {
      setConnected(true);
      setGamepadInfo({ id: e.gamepad.id, index: e.gamepad.index });
    };
    const handleDisconnect = () => {
      setConnected(false);
      setGamepadInfo(null);
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    const poll = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = Array.from(pads).find((p) => p && p.connected);

      if (pad) {
        setConnected(true);
        setGamepadInfo({ id: pad.id, index: pad.index });
        setAxes(pad.axes.slice(0, 4));
        setButtons(pad.buttons.map((b) => ({ pressed: b.pressed, value: b.value })));
      }
      rafRef.current = requestAnimationFrame(poll);
    };

    rafRef.current = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { connected, gamepadInfo, axes, buttons };
}