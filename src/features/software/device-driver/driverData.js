// Educational data for Class 5 Device Driver Simulation

export const DEVICES_DATA = {
  printer: {
    id: 'printer',
    name: 'Printer',
    icon: '🖨️',
    driverName: 'Printer Driver',
    actionBtnText: '🖨️ Print Test Page',
    computerRequest: '“I want you to print this page.”',
    confusedResponse: '“What do you mean? 🤔 I need to know about paper, ink, and print resolution!”',
    driverGreeting: '“Hello! I am the Printer Driver. I will explain the computer\'s print request to the printer!”',
    driverTranslation: [
      '1. Feed a blank paper sheet from tray',
      '2. Warm up print head & check ink level',
      '3. Print text lines from top to bottom',
      '4. Eject the finished printed page',
    ],
    deviceSuccessResponse: '“Oh! Now I understand! 👍 Printing the page right now!”',
    actionVisualType: 'printer',
    successResultText: '📄 Test Page Printed Successfully!',
  },
  speaker: {
    id: 'speaker',
    name: 'Speaker',
    icon: '🔊',
    driverName: 'Audio Driver',
    actionBtnText: '🔊 Play Sound',
    computerRequest: '“Play a welcome melody sound.”',
    confusedResponse: '“What do you mean? 🤔 I only understand electronic audio frequencies and voltage waves!”',
    driverGreeting: '“Hello! I am the Audio Driver. I will convert the music request into audio signal pulses!”',
    driverTranslation: [
      '1. Check audio volume level (50%)',
      '2. Convert digital audio notes to analog signal',
      '3. Send electrical pulses to speaker coil',
      '4. Vibrate speaker cone to make sound',
    ],
    deviceSuccessResponse: '“Oh! Now I understand! 👍 Playing sound through the speaker cone!”',
    actionVisualType: 'speaker',
    successResultText: '🎵 Sound Melody Played Successfully!',
  },
  keyboard: {
    id: 'keyboard',
    name: 'Keyboard',
    icon: '⌨️',
    driverName: 'Keyboard Driver',
    actionBtnText: '⌨️ Send Key Press',
    computerRequest: '“Check if any key was pressed.”',
    confusedResponse: '“What do you mean? 🤔 I only send raw electrical grid switch matrix signals!”',
    driverGreeting: '“Hello! I am the Keyboard Driver. I will look up the key matrix and tell the computer which letter was typed!”',
    driverTranslation: [
      '1. Read key electrical scan code (Row 2, Col 4)',
      '2. Look up key code in keyboard mapping table',
      '3. Identify the letter "A" was pressed',
      '4. Send character "A" to the Operating System',
    ],
    deviceSuccessResponse: '“Oh! Now I understand! 👍 Sending keypress data to OS!”',
    actionVisualType: 'keyboard',
    successResultText: '🔤 Key "A" Typed & Displayed on Screen!',
  },
  mouse: {
    id: 'mouse',
    name: 'Mouse',
    icon: '🖱️',
    driverName: 'Mouse Driver',
    actionBtnText: '🖱️ Move Pointer',
    computerRequest: '“Update the cursor position on screen.”',
    confusedResponse: '“What do you mean? 🤔 I only take fast optical sensor snapshots of the table surface!”',
    driverGreeting: '“Hello! I am the Mouse Driver. I will calculate X and Y motion coordinates from sensor data!”',
    driverTranslation: [
      '1. Read optical sensor Delta X (+120) and Delta Y (-80)',
      '2. Apply mouse pointer sensitivity & speed',
      '3. Calculate new screen coordinate (X: 450, Y: 320)',
      '4. Move the pointer on the monitor smoothly',
    ],
    deviceSuccessResponse: '“Oh! Now I understand! 👍 Moving pointer to new coordinates!”',
    actionVisualType: 'mouse',
    successResultText: '🎯 Cursor Moved Smoothly on Screen!',
  },
};

export const MATCH_ACTIVITY_DATA = [
  {
    deviceId: 'printer',
    deviceName: 'Printer',
    deviceIcon: '🖨️',
    correctDriverId: 'printer_driver',
    correctDriverName: 'Printer Driver',
    options: [
      { id: 'printer_driver', name: 'Printer Driver', icon: '🖨️', isCorrect: true },
      { id: 'audio_driver', name: 'Audio Driver', icon: '🔊', isCorrect: false },
      { id: 'mouse_driver', name: 'Mouse Driver', icon: '🖱️', isCorrect: false },
      { id: 'keyboard_driver', name: 'Keyboard Driver', icon: '⌨️', isCorrect: false },
    ],
  },
  {
    deviceId: 'speaker',
    deviceName: 'Speaker',
    deviceIcon: '🔊',
    correctDriverId: 'audio_driver',
    correctDriverName: 'Audio Driver',
    options: [
      { id: 'keyboard_driver', name: 'Keyboard Driver', icon: '⌨️', isCorrect: false },
      { id: 'audio_driver', name: 'Audio Driver', icon: '🔊', isCorrect: true },
      { id: 'printer_driver', name: 'Printer Driver', icon: '🖨️', isCorrect: false },
      { id: 'camera_driver', name: 'Camera Driver', icon: '📷', isCorrect: false },
    ],
  },
  {
    deviceId: 'mouse',
    deviceName: 'Mouse',
    deviceIcon: '🖱️',
    correctDriverId: 'mouse_driver',
    correctDriverName: 'Mouse Driver',
    options: [
      { id: 'audio_driver', name: 'Audio Driver', icon: '🔊', isCorrect: false },
      { id: 'mouse_driver', name: 'Mouse Driver', icon: '🖱️', isCorrect: true },
      { id: 'printer_driver', name: 'Printer Driver', icon: '🖨️', isCorrect: false },
      { id: 'keyboard_driver', name: 'Keyboard Driver', icon: '⌨️', isCorrect: false },
    ],
  },
  {
    deviceId: 'keyboard',
    deviceName: 'Keyboard',
    deviceIcon: '⌨️',
    correctDriverId: 'keyboard_driver',
    correctDriverName: 'Keyboard Driver',
    options: [
      { id: 'camera_driver', name: 'Camera Driver', icon: '📷', isCorrect: false },
      { id: 'printer_driver', name: 'Printer Driver', icon: '🖨️', isCorrect: false },
      { id: 'keyboard_driver', name: 'Keyboard Driver', icon: '⌨️', isCorrect: true },
      { id: 'audio_driver', name: 'Audio Driver', icon: '🔊', isCorrect: false },
    ],
  },
];

export const REAL_WORLD_EXAMPLES = [
  { device: 'Printer', icon: '🖨️', driver: 'Printer Driver', role: 'Helps the computer send page layouts and ink instructions to the printer.' },
  { device: 'Mouse', icon: '🖱️', driver: 'Mouse Driver', role: 'Converts sensor movement into smooth cursor gliding on your monitor.' },
  { device: 'Keyboard', icon: '⌨️', driver: 'Keyboard Driver', role: 'Translates physical key presses into letters and numbers on screen.' },
  { device: 'Speaker', icon: '🔊', driver: 'Audio Driver', role: 'Sends sound wave instructions so your speakers can play music and alerts.' },
  { device: 'Camera / Webcam', icon: '📷', driver: 'Camera Driver', role: 'Helps the computer capture and show video frames from the camera lens.' },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What does a Device Driver do in a computer system?',
    options: [
      { id: 'a', text: 'Makes the computer look colorful', isCorrect: false },
      { id: 'b', text: 'Helps the computer/OS communicate with a hardware device', isCorrect: true },
      { id: 'c', text: 'Stores family photographs', isCorrect: false },
      { id: 'd', text: 'Turns off the computer power', isCorrect: false },
    ],
    explanation: 'Correct! A device driver is a special software helper that allows the operating system to talk to hardware devices.',
  },
  {
    id: 2,
    question: 'Which device needs a Printer Driver to work properly?',
    options: [
      { id: 'a', text: 'Speaker', isCorrect: false },
      { id: 'b', text: 'Mouse', isCorrect: false },
      { id: 'c', text: 'Printer', isCorrect: true },
      { id: 'd', text: 'Keyboard', isCorrect: false },
    ],
    explanation: 'Correct! A Printer needs a Printer Driver so it knows how to feed paper and print ink on the page.',
  },
  {
    id: 3,
    question: 'Complete the flow: Computer / OS ➔ ____________ ➔ Hardware Device',
    options: [
      { id: 'a', text: 'Device Driver', isCorrect: true },
      { id: 'b', text: 'Computer Monitor', isCorrect: false },
      { id: 'c', text: 'Electric Bulb', isCorrect: false },
      { id: 'd', text: 'CD Disk', isCorrect: false },
    ],
    explanation: 'Correct! The Device Driver sits in the middle as the helper between the Computer/OS and the Hardware Device.',
  },
  {
    id: 4,
    question: 'Which diagram correctly shows the role of a Device Driver?',
    options: [
      { id: 'a', text: '🖥️ Computer ➔ 🧑‍🔧 Device Driver ➔ 🖨️ Hardware Device', isCorrect: true },
      { id: 'b', text: '🖨️ Printer ➔ 🖥️ Computer ➔ 🧑‍🔧 Driver', isCorrect: false },
      { id: 'c', text: '🧑‍🔧 Driver ➔ 🧑‍🔧 Driver ➔ 🖥️ Computer', isCorrect: false },
    ],
    explanation: 'Correct! The Computer sends requests to the Driver helper, which explains them to the Hardware Device!',
  },
];
