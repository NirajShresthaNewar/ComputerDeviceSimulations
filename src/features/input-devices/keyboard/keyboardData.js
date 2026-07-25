// Real PS/2 Scan Code Set 1 values (hex) for common keys — used to teach the
// actual hardware-level concept, not a fictional simplification.
export const scanCodeMap = {
  Backquote: 0x29, Digit1: 0x02, Digit2: 0x03, Digit3: 0x04, Digit4: 0x05,
  Digit5: 0x06, Digit6: 0x07, Digit7: 0x08, Digit8: 0x09, Digit9: 0x0A,
  Digit0: 0x0B, Minus: 0x0C, Equal: 0x0D, Backspace: 0x0E,
  Tab: 0x0F, KeyQ: 0x10, KeyW: 0x11, KeyE: 0x12, KeyR: 0x13, KeyT: 0x14,
  KeyY: 0x15, KeyU: 0x16, KeyI: 0x17, KeyO: 0x18, KeyP: 0x19,
  BracketLeft: 0x1A, BracketRight: 0x1B, Enter: 0x1C,
  CapsLock: 0x3A, KeyA: 0x1E, KeyS: 0x1F, KeyD: 0x20, KeyF: 0x21, KeyG: 0x22,
  KeyH: 0x23, KeyJ: 0x24, KeyK: 0x25, KeyL: 0x26, Semicolon: 0x27, Quote: 0x28,
  ShiftLeft: 0x2A, KeyZ: 0x2C, KeyX: 0x2D, KeyC: 0x2E, KeyV: 0x2F, KeyB: 0x30,
  KeyN: 0x31, KeyM: 0x32, Comma: 0x33, Period: 0x34, Slash: 0x35, ShiftRight: 0x36,
  ControlLeft: 0x1D, AltLeft: 0x38, Space: 0x39,
};

// QWERTY visual layout — each row is an array of { code, label, width }
// width is a flex-grow multiplier relative to a standard 1u key
export const keyboardLayout = [
  [
    { code: 'Backquote', label: '`' }, { code: 'Digit1', label: '1' },
    { code: 'Digit2', label: '2' }, { code: 'Digit3', label: '3' },
    { code: 'Digit4', label: '4' }, { code: 'Digit5', label: '5' },
    { code: 'Digit6', label: '6' }, { code: 'Digit7', label: '7' },
    { code: 'Digit8', label: '8' }, { code: 'Digit9', label: '9' },
    { code: 'Digit0', label: '0' }, { code: 'Minus', label: '-' },
    { code: 'Equal', label: '=' }, { code: 'Backspace', label: 'Backspace', width: 2 },
  ],
  [
    { code: 'Tab', label: 'Tab', width: 1.5 }, { code: 'KeyQ', label: 'Q' },
    { code: 'KeyW', label: 'W' }, { code: 'KeyE', label: 'E' },
    { code: 'KeyR', label: 'R' }, { code: 'KeyT', label: 'T' },
    { code: 'KeyY', label: 'Y' }, { code: 'KeyU', label: 'U' },
    { code: 'KeyI', label: 'I' }, { code: 'KeyO', label: 'O' },
    { code: 'KeyP', label: 'P' }, { code: 'BracketLeft', label: '[' },
    { code: 'BracketRight', label: ']' },
  ],
  [
    { code: 'CapsLock', label: 'Caps', width: 1.75 }, { code: 'KeyA', label: 'A' },
    { code: 'KeyS', label: 'S' }, { code: 'KeyD', label: 'D' },
    { code: 'KeyF', label: 'F' }, { code: 'KeyG', label: 'G' },
    { code: 'KeyH', label: 'H' }, { code: 'KeyJ', label: 'J' },
    { code: 'KeyK', label: 'K' }, { code: 'KeyL', label: 'L' },
    { code: 'Semicolon', label: ';' }, { code: 'Quote', label: "'" },
    { code: 'Enter', label: 'Enter', width: 2 },
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', width: 2.25 }, { code: 'KeyZ', label: 'Z' },
    { code: 'KeyX', label: 'X' }, { code: 'KeyC', label: 'C' },
    { code: 'KeyV', label: 'V' }, { code: 'KeyB', label: 'B' },
    { code: 'KeyN', label: 'N' }, { code: 'KeyM', label: 'M' },
    { code: 'Comma', label: ',' }, { code: 'Period', label: '.' },
    { code: 'Slash', label: '/' }, { code: 'ShiftRight', label: 'Shift', width: 2.25 },
  ],
  [
    { code: 'ControlLeft', label: 'Ctrl', width: 1.5 },
    { code: 'AltLeft', label: 'Alt', width: 1.5 },
    { code: 'Space', label: '', width: 6 },
  ],
];