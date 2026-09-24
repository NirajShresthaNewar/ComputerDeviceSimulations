export const CLASS_QA_CATALOG = [
  {
    classId: 'class-6',
    className: 'Class 6',
    grade: 6,
    badge: 'Active Syllabus',
    description: 'Computer Science Class 6 syllabus questions and answers for classroom & smart board learning.',
    chapters: [
      {
        chapterId: 'chapter-5',
        chapterNumber: 5,
        title: 'Operating System & DOS',
        icon: '⚙️',
        badge: 'Q&A Ready',
        isAvailable: true,
      },
      {
        chapterId: 'chapter-6',
        chapterNumber: 6,
        title: 'Operating System & DOS Commands',
        icon: '💻',
        badge: 'Q&A Ready',
        isAvailable: true,
      },
    ]
  },
  {
    classId: 'class-7',
    className: 'Class 7',
    grade: 7,
    badge: 'Coming Soon',
    description: 'Class 7 syllabus question answers.',
    chapters: [
      { chapterId: 'c7-ch1', chapterNumber: 1, title: 'Computer System Overview', icon: '🖥️', isAvailable: false },
    ]
  },
  {
    classId: 'class-8',
    className: 'Class 8',
    grade: 8,
    badge: 'Coming Soon',
    description: 'Class 8 syllabus question answers.',
    chapters: [
      { chapterId: 'c8-ch1', chapterNumber: 1, title: 'Computer Networks', icon: '🌐', isAvailable: false },
    ]
  }
];

export const CLASS_6_OS_QA = {
  class: 'Class 6',
  chapterTitle: 'Operating System & DOS Commands',
  chapterNumber: 5,
  subtitle: 'Classroom & Smart Board Study Notes',

  // Section 4: Answer the following questions
  questionsSection: {
    sectionNumber: 4,
    title: '4. Answer the following questions',
    items: [
      {
        id: 'q-a',
        itemLabel: 'a',
        question: 'What is an operating system?',
        answer: 'An operating system is system software that manages the computer and its resources.',
        type: 'text'
      },
      {
        id: 'q-b',
        itemLabel: 'b',
        question: 'What do you mean by a single-user operating system?',
        answer: 'A single-user operating system is a operating system that allows only one user to use the computer at a time.',
        type: 'text'
      },
      {
        id: 'q-c',
        itemLabel: 'c',
        question: 'What is single tasking?',
        answer: 'Single tasking is the process of running only one task or program at a time.',
        type: 'text'
      },
      {
        id: 'q-d',
        itemLabel: 'd',
        question: 'What are the essential DOS system files?',
        answer: 'The essential DOS system files are IO.SYS, MSDOS.SYS and COMMAND.COM.',
        highlightFiles: ['IO.SYS', 'MSDOS.SYS', 'COMMAND.COM'],
        type: 'text'
      },
      {
        id: 'q-e',
        itemLabel: 'e',
        question: 'What is booting? State its types.',
        answer: 'Booting is the process of starting a computer by loading small programs.\nTypes: Cold booting and Warm booting.',
        bootingTypes: ['Cold booting', 'Warm booting'],
        type: 'text'
      },
      {
        id: 'q-f',
        itemLabel: 'f',
        question: 'Differentiate between a file and a directory.',
        type: 'table',
        table: {
          headers: ['File', 'Directory'],
          rows: [
            {
              file: 'It Stores data or information.',
              directory: 'It Stores files and other directories.'
            },
            {
              file: 'It Has a file name and extension.',
              directory: 'It is used to organize files.'
            }
          ]
        }
      },
      {
        id: 'q-g',
        itemLabel: 'g',
        question: 'Define Internal and External Commands.',
        type: 'definitions',
        definitions: [
          {
            term: 'Internal commands',
            meaning: 'Internal commands are the commands that are stored inside DOS and always available.'
          },
          {
            term: 'External commands',
            meaning: 'External commands are the commands that are stored as separate program files.'
          }
        ]
      }
    ]
  },

  // Section 5: Functions of DOS Commands
  dosCommandsSection: {
    sectionNumber: 5,
    title: '5. Functions of DOS Commands',
    commands: [
      { id: 'cmd-a', itemLabel: 'a', command: 'CD', function: 'Changes the current directory.', category: 'Internal' },
      { id: 'cmd-b', itemLabel: 'b', command: 'MD', function: 'Creates a new directory.', category: 'Internal' },
      { id: 'cmd-c', itemLabel: 'c', command: 'COPY CON', function: 'Creates a new text file.', category: 'Internal' },
      { id: 'cmd-d', itemLabel: 'd', command: 'VER', function: 'Displays the DOS version.', category: 'Internal' },
      { id: 'cmd-e', itemLabel: 'e', command: 'EXIT', function: 'Exits the DOS command prompt.', category: 'Internal' },
      { id: 'cmd-f', itemLabel: 'f', command: 'DIR', function: 'Displays files and directories.', category: 'Internal' },
      { id: 'cmd-g', itemLabel: 'g', command: 'LABEL', function: 'Creates or changes a disk label.', category: 'External' },
      { id: 'cmd-h', itemLabel: 'h', command: 'SCANDISK', function: 'Checks and repairs disk errors.', category: 'External' },
      { id: 'cmd-i', itemLabel: 'i', command: 'DEL', function: 'Deletes files.', category: 'Internal' },
      { id: 'cmd-j', itemLabel: 'j', command: 'FORMAT', function: 'Formats a disk or drive.', category: 'External' },
    ]
  }
};
