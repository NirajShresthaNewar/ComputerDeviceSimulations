// Educational data for Class 5 "You Are the Operating System!" simulation

export const OS_APPS = [
  { id: 'notes', name: 'Notes', icon: '📝', ramBlocks: 2, cpuPercent: 15, category: 'work', desc: 'Writing homework and essays' },
  { id: 'music', name: 'Music Player', icon: '🎵', ramBlocks: 1, cpuPercent: 10, category: 'media', desc: 'Playing audio and songs' },
  { id: 'browser', name: 'Web Browser', icon: '🌐', ramBlocks: 3, cpuPercent: 25, category: 'internet', desc: 'Searching internet and learning' },
  { id: 'game', name: 'Math Space Game', icon: '🎮', ramBlocks: 3, cpuPercent: 35, category: 'game', desc: 'Fun 3D space math adventure' },
  { id: 'calc', name: 'Calculator', icon: '🧮', ramBlocks: 1, cpuPercent: 5, category: 'tools', desc: 'Doing quick math calculations' },
  { id: 'photos', name: 'Photo Viewer', icon: '🖼️', ramBlocks: 2, cpuPercent: 15, category: 'media', desc: 'Viewing school & family photos' },
];

export const INITIAL_FILES = [
  { id: 'f1', name: 'Homework.docx', icon: '📄', targetFolder: 'school', currentFolder: 'inbox' },
  { id: 'f2', name: 'Song.mp3', icon: '🎵', targetFolder: 'music', currentFolder: 'inbox' },
  { id: 'f3', name: 'Friends.jpg', icon: '🖼️', targetFolder: 'photos', currentFolder: 'inbox' },
  { id: 'f4', name: 'ScienceProject.docx', icon: '📄', targetFolder: 'school', currentFolder: 'inbox' },
  { id: 'f5', name: 'Melody.mp3', icon: '🎵', targetFolder: 'music', currentFolder: 'inbox' },
  { id: 'f6', name: 'SchoolPicture.jpg', icon: '🖼️', targetFolder: 'photos', currentFolder: 'inbox' },
];

export const FOLDERS = [
  { id: 'school', name: 'School Work', icon: '📁', color: '#3b82f6', acceptedTypes: ['Homework.docx', 'ScienceProject.docx'] },
  { id: 'photos', name: 'Photos', icon: '📁', color: '#10b981', acceptedTypes: ['Friends.jpg', 'SchoolPicture.jpg'] },
  { id: 'music', name: 'Music', icon: '📁', color: '#8b5cf6', acceptedTypes: ['Song.mp3', 'Melody.mp3'] },
];

export const SECURITY_USERS = [
  { id: 'student', name: 'Aarav (Student)', role: 'Student', icon: '👦', password: '123', accessibleFolders: ['my_work', 'homework'], restrictedFolders: ['teacher_grades', 'exam_questions'] },
  { id: 'teacher', name: 'Ms. Sharma (Teacher)', role: 'Administrator / Teacher', icon: '👩', password: 'abc', accessibleFolders: ['my_work', 'homework', 'teacher_grades', 'exam_questions'], restrictedFolders: [] },
];

export const SECURITY_FOLDERS = [
  { id: 'my_work', name: 'My School Work', icon: '📁', requiresTeacher: false, files: ['Math_Homework.docx', 'Drawing.png'] },
  { id: 'homework', name: 'Homework Submissions', icon: '📁', requiresTeacher: false, files: ['English_Essay.docx'] },
  { id: 'teacher_grades', name: 'Final Exam Grades', icon: '🔒', requiresTeacher: true, files: ['Class5_ReportCards.xlsx', 'Marks_Master.pdf'] },
  { id: 'exam_questions', name: 'Confidential Exam Papers', icon: '🔒', requiresTeacher: true, files: ['Term_Exam_Questions.docx'] },
];

export const OS_CHALLENGE_TASKS = [
  {
    id: 1,
    title: '1. Launch an Application',
    desc: 'Open the 📝 Notes app to start your homework.',
    type: 'process',
    actionBadge: 'Process Managed',
    targetApp: 'notes',
  },
  {
    id: 2,
    title: '2. Allocate Memory (RAM)',
    desc: 'The OS gives 2 blocks of memory to the Notes app.',
    type: 'memory',
    actionBadge: 'Memory Managed',
    targetApp: 'notes',
  },
  {
    id: 3,
    title: '3. Organize Document in Files',
    desc: 'Save "Homework.docx" into the 📁 School folder.',
    type: 'file',
    actionBadge: 'File Managed',
  },
  {
    id: 4,
    title: '4. Print to Hardware Device',
    desc: 'Send print command to 🖨️ Printer via the Printer Driver.',
    type: 'device',
    actionBadge: 'Device Managed',
  },
  {
    id: 5,
    title: '5. Manage Multitasking (CPU)',
    desc: 'Play 🎵 Music while Notes is open (CPU time-sharing).',
    type: 'multitasking',
    actionBadge: 'Multitasking Managed',
  },
  {
    id: 6,
    title: '6. Protect Computer with Password',
    desc: 'Lock the computer and log in with your Student account.',
    type: 'security',
    actionBadge: 'Security Managed',
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is the main role of an Operating System?',
    options: [
      { id: 'a', text: 'It acts like the manager of the computer, coordinating programs, memory, files, and devices.', isCorrect: true },
      { id: 'b', text: 'It only plays music and games.', isCorrect: false },
      { id: 'c', text: 'It replaces the computer monitor screen.', isCorrect: false },
    ],
    explanation: 'Correct! The Operating System is the master manager of the whole computer system.',
  },
  {
    id: 2,
    question: 'How does the OS manage Memory (RAM)?',
    options: [
      { id: 'a', text: 'It provides memory to programs when they open, and frees it when they close.', isCorrect: true },
      { id: 'b', text: 'It permanently glues memory to one program forever.', isCorrect: false },
      { id: 'c', text: 'It throws away all memory every minute.', isCorrect: false },
    ],
    explanation: 'Correct! The OS allocates memory blocks when apps need it and recovers memory when apps close.',
  },
  {
    id: 3,
    question: 'What does Process Management / Multitasking mean?',
    options: [
      { id: 'a', text: 'The OS shares CPU time between running programs so they can appear to run smoothly together.', isCorrect: true },
      { id: 'b', text: 'Only one program is allowed to exist on the computer.', isCorrect: false },
      { id: 'c', text: 'The computer stops working when two programs are opened.', isCorrect: false },
    ],
    explanation: 'Correct! The OS rapidly switches CPU time between active applications so multiple apps can run at the same time.',
  },
  {
    id: 4,
    question: 'Why does the OS use passwords and permissions (Security Management)?',
    options: [
      { id: 'a', text: 'To protect private files and control which users can access specific folders.', isCorrect: true },
      { id: 'b', text: 'To change the keyboard color.', isCorrect: false },
      { id: 'c', text: 'To delete all student homework.', isCorrect: false },
    ],
    explanation: 'Correct! Privacy and security controls protect files and stop unauthorized users from accessing confidential data.',
  },
  {
    id: 5,
    question: 'Complete the sentence: "Just like a school has a principal/manager, a computer has a(n) ________."',
    options: [
      { id: 'a', text: 'Operating System', isCorrect: true },
      { id: 'b', text: 'Mouse Pad', isCorrect: false },
      { id: 'c', text: 'Printer Paper', isCorrect: false },
    ],
    explanation: 'Correct! The Operating System manages all computer resources, just like a school manager organizes school activities!',
  },
];
