// Educational data & presets for Class 5 Language Translators simulation

export const REAL_COMPUTER_PRESETS = [
  {
    id: 'default',
    title: 'Hello & Welcome',
    lines: [
      { code: 'print("Hello")', label: 'Line 1', binary: '01001000 01100101 01101100 01101100 01101111', screenOutput: 'Hello' },
      { code: 'print("Welcome")', label: 'Line 2', binary: '01010111 01100101 01101100 01100011 01101111', screenOutput: 'Welcome' },
      { code: 'print("Class 5")', label: 'Line 3', binary: '01000011 01101100 01100001 01110011 01110011', screenOutput: 'Class 5' },
    ],
  },
  {
    id: 'math',
    title: 'Fun Math',
    lines: [
      { code: 'a = 10', label: 'Line 1', binary: '00010000 00001010 00000001 00000000', screenOutput: '(a = 10 set)' },
      { code: 'b = 5', label: 'Line 2', binary: '00010000 00000101 00000010 00000000', screenOutput: '(b = 5 set)' },
      { code: 'print("Total is 15")', label: 'Line 3', binary: '01010100 01101111 01110100 01100001 01101100', screenOutput: 'Total is 15' },
    ],
  },
  {
    id: 'robot',
    title: 'Robot Commands',
    lines: [
      { code: 'robot.moveForward()', label: 'Line 1', binary: '11000001 00000001 00000000 11110000', screenOutput: '🤖 Robot moved forward' },
      { code: 'robot.turnRight()', label: 'Line 2', binary: '11000010 00000010 00000000 11110001', screenOutput: '🤖 Robot turned right' },
      { code: 'robot.sayHello()', label: 'Line 3', binary: '11000011 00000011 00000000 11110010', screenOutput: '🤖 Beep boop! Hello!' },
    ],
  },
];

export const ANALOGY_PRESETS = [
  {
    id: 'default',
    title: 'Daily Conversation',
    lines: [
      {
        source: 'Hello, how are you?',
        translated: 'नमस्ते, तपाईंलाई कस्तो छ?',
        explanation: 'The English greeting is converted into natural Nepali.',
      },
      {
        source: 'I am fine.',
        translated: 'म सन्चै छु।',
        explanation: 'The response sentence is converted into Nepali.',
      },
      {
        source: 'Thank you.',
        translated: 'धन्यवाद।',
        explanation: 'Polite closing word is converted into Nepali.',
      },
    ],
  },
  {
    id: 'school',
    title: 'Computer Class',
    lines: [
      {
        source: 'Good morning teacher.',
        translated: 'शुभप्रभात गुरु/गुरुआमा।',
        explanation: 'Morning greeting translated.',
      },
      {
        source: 'We love computer science.',
        translated: 'हामीलाई कम्प्युटर विज्ञान मन पर्छ।',
        explanation: 'Subject interest sentence translated.',
      },
      {
        source: 'Let us start learning.',
        translated: 'आउनुहोस् सिक्न सुरु गरौँ।',
        explanation: 'Call to action translated.',
      },
    ],
  },
];

export const ASSEMBLY_DATA = {
  title: 'Assembly Language Example',
  description: 'Assembly language uses short human-readable codes (mnemonics) like MOV, ADD, and SUB.',
  lines: [
    {
      code: 'MOV A, 1',
      meaning: 'Put number 1 into Register A',
      binary: '10110000 00000001',
      result: 'Register A = 1',
    },
    {
      code: 'ADD A, 2',
      meaning: 'Add number 2 to Register A',
      binary: '00000100 00000010',
      result: 'Register A = 3',
    },
    {
      code: 'SUB A, 1',
      meaning: 'Subtract 1 from Register A',
      binary: '00101100 00000001',
      result: 'Register A = 2',
    },
  ],
};

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Which language translator converts the ENTIRE program into machine language all at once before running it?',
    options: [
      { id: 'compiler', text: 'Compiler', isCorrect: true },
      { id: 'interpreter', text: 'Interpreter', isCorrect: false },
      { id: 'assembler', text: 'Assembler', isCorrect: false },
    ],
    explanation: 'Correct! A Compiler translates the whole source code all at once into an executable machine code file.',
  },
  {
    id: 2,
    question: 'Which translator translates and executes a program ONE LINE at a time?',
    options: [
      { id: 'compiler', text: 'Compiler', isCorrect: false },
      { id: 'interpreter', text: 'Interpreter', isCorrect: true },
      { id: 'assembler', text: 'Assembler', isCorrect: false },
    ],
    explanation: 'Correct! An Interpreter takes one line of high-level code, translates it, and executes it immediately before moving to the next line.',
  },
  {
    id: 3,
    question: 'What type of program does an ASSEMBLER convert into machine language?',
    options: [
      { id: 'english', text: 'Nepali / English text', isCorrect: false },
      { id: 'assembly', text: 'Assembly Language (MOV, ADD, etc.)', isCorrect: true },
      { id: 'python', text: 'High-Level Python program', isCorrect: false },
    ],
    explanation: 'Correct! An Assembler is specifically designed to convert Assembly Language mnemonics into 0s and 1s (Machine Code).',
  },
  {
    id: 4,
    question: 'Why do we need Language Translators in a computer system?',
    options: [
      { id: 'q4_a', text: 'Because computers can only understand Machine Language (0s and 1s), not human words directly.', isCorrect: true },
      { id: 'q4_b', text: 'To make computer monitors brighter.', isCorrect: false },
      { id: 'q4_c', text: 'To clean dust from the hard disk.', isCorrect: false },
    ],
    explanation: 'Correct! Humans write in user-friendly code, but computer CPUs only run binary machine language.',
  },
  {
    id: 5,
    question: 'In our "Easy Language Analogy" mode, why do we use English → Nepali?',
    options: [
      { id: 'q5_a', text: 'Because Nepali is an official CPU machine language.', isCorrect: false },
      { id: 'q5_b', text: 'As an analogy to help our brains visualize how a translator converts words we understand.', isCorrect: true },
      { id: 'q5_c', text: 'Because computers run only in Nepali.', isCorrect: false },
    ],
    explanation: 'Correct! English → Nepali is just an everyday analogy to make the concept easy to imagine for Class 5 students.',
  },
];
