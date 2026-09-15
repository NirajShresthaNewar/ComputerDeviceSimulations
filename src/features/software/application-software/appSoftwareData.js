// Educational data for Class 5 Application Software simulation

export const INTRO_TASKS = [
  { id: 'write', icon: '📝', label: 'Write Stories & Homework', appExample: 'Word Processor' },
  { id: 'draw', icon: '🎨', label: 'Draw Pictures & Art', appExample: 'Drawing Software' },
  { id: 'calculate', icon: '🧮', label: 'Calculate & Math', appExample: 'Calculator' },
  { id: 'music', icon: '🎵', label: 'Play Songs & Videos', appExample: 'Media Player' },
  { id: 'tables', icon: '📊', label: 'Make Data Tables & Charts', appExample: 'Spreadsheet' },
  { id: 'school', icon: '🏫', label: 'Manage School Records', appExample: 'School Management System' },
];

export const REAL_APPLICATIONS = [
  {
    id: 'word',
    name: 'Word Processor',
    icon: '📝',
    badge: 'Ready-Made (Packaged)',
    usedFor: ['Writing essays and stories', 'Typing homework documents', 'Formatting text and letters'],
    users: [
      { role: 'Student', icon: '👨‍🎓', useCase: 'Types science homework' },
      { role: 'Teacher', icon: '👩‍🏫', useCase: 'Prepares exam papers' },
      { role: 'Office Worker', icon: '👨‍💼', useCase: 'Writes business letters' },
      { role: 'Author / Writer', icon: '✍️', useCase: 'Writes books and novels' },
    ],
  },
  {
    id: 'spreadsheet',
    name: 'Spreadsheet',
    icon: '📊',
    badge: 'Ready-Made (Packaged)',
    usedFor: ['Making tables and lists', 'Calculating math totals and averages', 'Drawing colorful charts and graphs'],
    users: [
      { role: 'Teacher', icon: '👩‍🏫', useCase: 'Calculates student report marks' },
      { role: 'Shopkeeper', icon: '🏪', useCase: 'Tracks daily store sales' },
      { role: 'Banker', icon: '🏦', useCase: 'Organizes monthly budgets' },
      { role: 'Student', icon: '👨‍🎓', useCase: 'Graphs science experiment data' },
    ],
  },
  {
    id: 'drawing',
    name: 'Drawing Software',
    icon: '🎨',
    badge: 'Ready-Made (Packaged)',
    usedFor: ['Drawing shapes and sketches', 'Painting with colors and brushes', 'Creating digital artwork'],
    users: [
      { role: 'Student', icon: '👨‍🎓', useCase: 'Draws a solar system diagram' },
      { role: 'Artist', icon: '🧑‍🎨', useCase: 'Paints digital landscape art' },
      { role: 'Designer', icon: '👩‍💻', useCase: 'Creates posters and logos' },
    ],
  },
  {
    id: 'browser',
    name: 'Web Browser',
    icon: '🌐',
    badge: 'Ready-Made (Packaged)',
    usedFor: ['Opening websites and search engines', 'Watching educational videos', 'Exploring online encyclopedias'],
    users: [
      { role: 'Student', icon: '👨‍🎓', useCase: 'Researches animals for homework' },
      { role: 'Teacher', icon: '👩‍🏫', useCase: 'Finds interactive quizzes' },
      { role: 'Parent', icon: '👨‍👩‍👧', useCase: 'Reads news and articles' },
    ],
  },
];

export const PACKAGED_MATCH_TASKS = [
  {
    id: 1,
    task: '“I want to type and print my English homework essay.”',
    userIcon: '👨‍🎓',
    userName: 'Student Aarav',
    options: [
      { id: 'word', name: 'Word Processor', icon: '📝', isCorrect: true },
      { id: 'music', name: 'Music Player', icon: '🎵', isCorrect: false },
      { id: 'draw', name: 'Drawing Software', icon: '🎨', isCorrect: false },
    ],
    explanation: 'Correct! A Word Processor is ready-made for writing, typing, and printing documents.',
  },
  {
    id: 2,
    task: '“I need to calculate total marks and find averages for 40 students.”',
    userIcon: '👩‍🏫',
    userName: 'Teacher Ms. Sharma',
    options: [
      { id: 'draw', name: 'Drawing Software', icon: '🎨', isCorrect: false },
      { id: 'spreadsheet', name: 'Spreadsheet', icon: '📊', isCorrect: true },
      { id: 'music', name: 'Music Player', icon: '🎵', isCorrect: false },
    ],
    explanation: 'Correct! A Spreadsheet is specially designed for tables, numbers, and automatic calculations.',
  },
  {
    id: 3,
    task: '“I want to draw a colorful house and paint trees with digital brushes.”',
    userIcon: '🧑‍🎨',
    userName: 'Art Student Maya',
    options: [
      { id: 'spreadsheet', name: 'Spreadsheet', icon: '📊', isCorrect: false },
      { id: 'draw', name: 'Drawing Software', icon: '🎨', isCorrect: true },
      { id: 'browser', name: 'Web Browser', icon: '🌐', isCorrect: false },
    ],
    explanation: 'Correct! Drawing Software provides paints, shapes, and color palettes for art.',
  },
];

export const SCHOOL_BUILDER_FEATURES = [
  { id: 'students', name: 'Student Records', icon: '👨‍🎓', desc: 'Store names, class, roll numbers, and parent contacts' },
  { id: 'attendance', name: 'Daily Attendance', icon: '📅', desc: 'Mark Present / Absent every morning' },
  { id: 'marks', name: 'Exam Marks & Grades', icon: '📝', desc: 'Generate terminal report cards and scorecards' },
  { id: 'fees', name: 'Fee Collection & Billing', icon: '💰', desc: 'Print custom fee receipts and discount vouchers' },
  { id: 'teachers', name: 'Teacher Records', icon: '👩‍🏫', desc: 'Track subject assignments and staff details' },
  { id: 'timetable', name: 'Class Timetable', icon: '🕐', desc: 'Organize period bell schedules for all grades' },
];

export const SORTING_ITEMS = [
  { id: 's1', name: 'Word Processor', icon: '📝', type: 'packaged', desc: 'Ready-made for general writing' },
  { id: 's2', name: 'School Management System', icon: '🏫', type: 'tailored', desc: 'Specially built for a school’s rules' },
  { id: 's3', name: 'Spreadsheet Software', icon: '📊', type: 'packaged', desc: 'Ready-made for table calculations' },
  { id: 's4', name: 'Hospital Patient System', icon: '🏥', type: 'tailored', desc: 'Specially built for hospital beds & doctors' },
  { id: 's5', name: 'Drawing / Paint App', icon: '🎨', type: 'packaged', desc: 'Ready-made for anyone to draw' },
  { id: 's6', name: 'Bank Custom ATM System', icon: '🏦', type: 'tailored', desc: 'Specially built for a bank’s security' },
];

export const ADVISOR_SCENARIOS = [
  {
    id: 1,
    client: 'Student',
    clientIcon: '👨‍🎓',
    need: '“I need software to type my school homework essays and print them.”',
    correctType: 'packaged',
    reason: 'A standard ready-made Word Processor is perfect and ready to use immediately!',
  },
  {
    id: 2,
    client: 'City School',
    clientIcon: '🏫',
    need: '“We need software designed specifically to manage our student attendance, exams, custom fee receipts, and bus routes.”',
    correctType: 'tailored',
    reason: 'The school has unique rules and fee structures, so a custom-made Tailored Software is best!',
  },
  {
    id: 3,
    client: 'Central Hospital',
    clientIcon: '🏥',
    need: '“We need a system built specifically for our 500 patient beds, doctor emergency shifts, and pharmacy stock.”',
    correctType: 'tailored',
    reason: 'A hospital has specific workflows requiring custom-made Tailored Software!',
  },
  {
    id: 4,
    client: 'Math Teacher',
    clientIcon: '👩‍🏫',
    need: '“I need software to calculate student test scores and make a quick bar chart.”',
    correctType: 'packaged',
    reason: 'A ready-made Spreadsheet application handles calculations and charts easily for any teacher!',
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is Application Software?',
    options: [
      { id: 'a', text: 'Software that helps users perform specific tasks (like writing, drawing, or calculations)', isCorrect: true },
      { id: 'b', text: 'A physical computer wire or plug', isCorrect: false },
      { id: 'c', text: 'A plastic keyboard key', isCorrect: false },
    ],
    explanation: 'Correct! Application software helps users do specific work, like typing a letter, drawing a picture, or calculating marks.',
  },
  {
    id: 2,
    question: 'Which type of software is READY-MADE and available for many people to use for general needs?',
    options: [
      { id: 'a', text: 'Tailored Software', isCorrect: false },
      { id: 'b', text: 'Packaged Software', isCorrect: true },
      { id: 'c', text: 'Device Driver', isCorrect: false },
    ],
    explanation: 'Correct! Packaged software is ready-made by developers and used by many people (e.g. Word processors, Spreadsheets).',
  },
  {
    id: 3,
    question: 'A school orders software built specially according to its own custom fee structure and attendance rules. What type is it?',
    options: [
      { id: 'a', text: 'Packaged Software', isCorrect: false },
      { id: 'b', text: 'Tailored Software', isCorrect: true },
      { id: 'c', text: 'Hardware Device', isCorrect: false },
    ],
    explanation: 'Correct! Tailored software is custom-made according to the specific requirements of a particular person or organization.',
  },
  {
    id: 4,
    question: 'Which of the following is a good example of Packaged Software?',
    options: [
      { id: 'a', text: 'A custom hospital system made only for City Hospital', isCorrect: false },
      { id: 'b', text: 'A general Word Processor or Drawing application', isCorrect: true },
      { id: 'c', text: 'A secret bank ATM database', isCorrect: false },
    ],
    explanation: 'Correct! Word processors and drawing apps are ready-made packaged software used by students, teachers, and offices worldwide.',
  },
  {
    id: 5,
    question: 'What is the simple memory trick to remember Packaged vs Tailored?',
    options: [
      { id: 'a', text: 'Packaged = Ready-made | Tailored = Custom-made', isCorrect: true },
      { id: 'b', text: 'Packaged = Broken | Tailored = Working', isCorrect: false },
      { id: 'c', text: 'Packaged = Keyboard | Tailored = Mouse', isCorrect: false },
    ],
    explanation: 'Correct! Remember: 📦 Packaged = Ready-made (like off-the-shelf clothes) and 🛠️ Tailored = Custom-made (like a tailor sewing to your exact size)!',
  },
];
