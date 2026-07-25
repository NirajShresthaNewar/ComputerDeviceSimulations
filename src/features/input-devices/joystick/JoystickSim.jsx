import { useState, useEffect, useRef } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import CpuInternalsDiagram from '../../../components/simulation-shell/CpuInternalsDiagram';
import GamepadDiagram from './GamepadDiagram';
import { useGamepadAPI } from './useGamepadAPI';
import styles from './JoystickSim.module.css';

export default function JoystickSim() {
  const { connected, gamepadInfo, axes, buttons } = useGamepadAPI();
  const [signal, setSignal] = useState(null);
  const wasPressedRef = useRef(new Set());

  useEffect(() => {
    if (!connected) return;

    // Stick movement -> Data signal (throttled by only firing on meaningful movement)
    const [lx, ly] = axes;
    if (Math.abs(lx) > 0.15 || Math.abs(ly) > 0.15) {
      setSignal({
        kind: 'Data',
        usesALU: true,
        usesStorage: false,
        detail: `The left analog stick reported axis values (${lx.toFixed(2)}, ${ly.toFixed(2)}). The ALU used this data to compute movement or aim direction before the Control Unit updated game state in Memory.`,
      });
    }

    // Button press edge-detection
    buttons.forEach((btn, i) => {
      const wasPressed = wasPressedRef.current.has(i);
      if (btn.pressed && !wasPressed) {
        wasPressedRef.current.add(i);
        setSignal({
          kind: 'Instruction',
          usesALU: false,
          usesStorage: false,
          detail: `Button ${i} was pressed. The Control Unit decoded this as a discrete instruction and triggered the corresponding in-game action.`,
        });
      } else if (!btn.pressed && wasPressed) {
        wasPressedRef.current.delete(i);
      }
    });
  }, [connected, axes, buttons]);

  const simulateContent = (
    <div className={styles.simulateGrid}>
      <div className={styles.left}>
        {!connected ? (
          <div className={styles.connectPrompt}>
            <p>No controller detected.</p>
            <p className={styles.connectHint}>
              Connect a gamepad and press any button on it — browsers only detect
              a controller after it sends its first input.
            </p>
          </div>
        ) : (
          <>
            <p className={styles.connectedLabel}>Connected: {gamepadInfo?.id || 'Unknown controller'}</p>
            <GamepadDiagram axes={axes} buttons={buttons} />
          </>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.readout}>
          <p className={styles.readoutLabel}>Axes</p>
          {axes.map((val, i) => (
            <div className={styles.row} key={i}>
              <span className={styles.label}>Axis {i}</span>
              <span className={styles.value}>{val.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <CpuInternalsDiagram signal={signal} />
      </div>
    </div>
  );

  const learnContent = (
    <ExplanationPanel
      description="A joystick or gamepad is an input device that reports continuous analog values (from its sticks and triggers) and discrete digital values (from its buttons) to the computer. Analog sticks contain tiny potentiometers or Hall-effect sensors that measure how far the stick is tilted in each direction, producing a smooth range of values rather than just on/off. The CPU's Control Unit reads this data many times per second; the ALU often computes resulting movement, aim, or physics from those raw axis values, while button presses are typically decoded as discrete instructions that trigger specific actions."
      advantages={[
        'Precise analog control for movement and aiming',
        'Ergonomic for extended use compared to keyboard for games',
        'Supports a wide range of simultaneous inputs',
        'Standardized mapping makes most controllers instantly compatible',
      ]}
      disadvantages={[
        'Less precise than a mouse for fine pointing tasks',
        'Sticks and buttons can wear out or drift over time',
        'Requires a compatible game or software to be useful',
        'Browsers only detect it after an initial button press',
      ]}
      uses={[
        'Video games on consoles, PCs, and browsers',
        'Robotics and drone control',
        'Flight and vehicle simulation',
        'Accessibility input for some assistive setups',
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
      <h1>Joystick / Gamepad</h1>
      <p className={styles.subtitle}>
        Connect a controller and move the sticks or press buttons to see live input.
      </p>
      <SimTabs learnContent={learnContent} simulateContent={simulateContent} quizContent={quizContent} />
    </div>
  );
}