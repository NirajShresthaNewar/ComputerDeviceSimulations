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
        topics: ['Operating System Definition', 'Booting Types', 'File vs Directory', 'DOS Internal & External Commands']
      },
      {
        chapterId: 'chapter-6',
        chapterNumber: 6,
        title: 'Operating System & DOS Commands',
        icon: '💻',
        badge: 'Q&A Ready',
        isAvailable: true,
        topics: ['Essential DOS Files', 'Command Execution', 'Disk Utilities', 'File Management Commands']
      },
    ]
  },
  {
    classId: 'class-7',
    className: 'Class 7',
    grade: 7,
    badge: 'Active Syllabus',
    description: 'Computer Science Class 7 syllabus question answers, difference tables, definitions & key concepts.',
    chapters: [
      {
        chapterId: 'chapter-5',
        chapterNumber: 5,
        title: 'Software',
        icon: '💿',
        badge: 'Q&A Ready',
        isAvailable: true,
        topics: ['System vs Application Software', 'Operating System Functions', 'Packaged vs Tailored Software', 'Language Processors & Drivers']
      },
      { chapterId: 'chapter-1', chapterNumber: 1, title: 'Computer System Overview', icon: '🖥️', isAvailable: false },
      { chapterId: 'chapter-2', chapterNumber: 2, title: 'Number Systems', icon: '🔢', isAvailable: false },
      { chapterId: 'chapter-3', chapterNumber: 3, title: 'OS Settings & Control', icon: '⚙️', isAvailable: false },
      { chapterId: 'chapter-4', chapterNumber: 4, title: 'Cybersecurity & Virus', icon: '🛡️', isAvailable: false },
    ]
  },
  {
    classId: 'class-8',
    className: 'Class 8',
    grade: 8,
    badge: 'Coming Soon',
    description: 'Class 8 syllabus question answers.',
    chapters: [
      { chapterId: 'chapter-1', chapterNumber: 1, title: 'Computer Networks', icon: '🌐', isAvailable: false },
    ]
  }
];

export const CLASS_6_OS_QA = {
  classId: 'class-6',
  className: 'Class 6',
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
              col1: 'It Stores data or information.',
              col2: 'It Stores files and other directories.'
            },
            {
              col1: 'It Has a file name and extension.',
              col2: 'It is used to organize files.'
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

export const CLASS_7_SOFTWARE_QA = {
  classId: 'class-7',
  className: 'Class 7',
  class: 'Class 7',
  chapterTitle: 'Software',
  chapterNumber: 5,
  subtitle: 'Exercise Answers, Conceptual Notes & Smart Board Study Guide',

  // Section: Exercise Answers
  questionsSection: {
    sectionNumber: 1,
    title: 'Exercise Answers — Chapter 5: Software',
    items: [
      {
        id: 'c7-q-a',
        itemLabel: 'a',
        question: 'Define software. Write its types.',
        answer: 'Software is a set of programs that perform specific task.\n\nIts types are:\ni) System software\nii) Application software.',
        highlights: ['System software', 'Application software'],
        type: 'text'
      },
      {
        id: 'c7-q-b',
        itemLabel: 'b',
        question: 'Explain system software. List its features.',
        answer: 'System software controls and manages the computer and its hardware.\n\nFeatures:\n• It manages hardware.\n• Provides a platform for applications.\n• Works in the background.\n• Helps the computer run properly.',
        type: 'text'
      },
      {
        id: 'c7-q-c',
        itemLabel: 'c',
        question: 'Write the functions of an operating system.',
        answer: 'The main functions of Operating system are:\n• It helps in managing files and memory.\n• It helps in managing hardware and programs.',
        type: 'text'
      },
      {
        id: 'c7-q-d',
        itemLabel: 'd',
        question: 'What is application software? What are the features of a computer?',
        answer: 'Application software is software made to perform specific user tasks, such as typing, drawing, or calculating.\n\nFeatures of a computer are:\n• Speed\n• Accuracy\n• Storage\n• Diligence\n• Versatility\n• Automation',
        type: 'text'
      },
      {
        id: 'c7-q-e',
        itemLabel: 'e',
        question: 'Why is customized software developed?',
        answer: 'Customized software is developed on the demand of users or organization.',
        type: 'text'
      },
      {
        id: 'c7-q-f',
        itemLabel: 'f',
        question: 'Difference between packaged software and tailored software',
        type: 'table',
        table: {
          headers: ['Packaged Software', 'Tailored Software'],
          rows: [
            {
              col1: 'It’s Made for general users.',
              col2: 'It’s Made for a specific user or organization.'
            },
            {
              col1: 'It can’t be modified.',
              col2: 'It can be modified.'
            },
            {
              col1: 'Eg: MS Word, MS Excel.',
              col2: 'Eg: School management software'
            }
          ]
        }
      },
      {
        id: 'c7-q-g',
        itemLabel: 'g',
        question: 'What is a language processor? List its types.',
        answer: 'A language processor is system software that translates a program written in a high level language into machine language.\n\nIts types are: compiler, interpreter, and assembler.',
        highlights: ['compiler', 'interpreter', 'assembler'],
        type: 'text'
      },
      {
        id: 'c7-q-h',
        itemLabel: 'h',
        question: 'Define the following:',
        type: 'definitions',
        definitions: [
          {
            term: 'Device driver',
            meaning: 'Software that helps the operating system communicate with a hardware device.'
          },
          {
            term: 'Utility software',
            meaning: 'It is a Software used to maintain, protect, and manage a computer.'
          },
          {
            term: 'Compiler',
            meaning: 'A language processor that translates the whole program into machine language at once.'
          },
          {
            term: 'Interpreter',
            meaning: 'It is A language processor that translates and executes a program line by line.'
          }
        ]
      }
    ]
  },

  // Key Terms & Quick Concept Cards for interactive classroom study
  keyConceptsSection: {
    title: '💡 Quick Study Concepts & Key Definitions',
    items: [
      {
        badge: 'Core Concept',
        title: 'Software',
        desc: 'Set of instructions or programs that direct the hardware to execute operations.'
      },
      {
        badge: 'System Software',
        title: 'OS & Translators',
        desc: 'Base software layer running in the background to manage CPU, RAM, disk, and input/output devices.'
      },
      {
        badge: 'Application Software',
        title: 'User Productivity',
        desc: 'Task-specific applications like text editors, spreadsheets, drawing tools, and tailored enterprise software.'
      },
      {
        badge: 'Language Processor',
        title: 'Code Translators',
        desc: 'Converts human-readable source code (High-Level Language) into binary machine code (0s & 1s).'
      }
    ]
  }
};

export const CLASS_QA_REGISTRY = {
  'class-6/chapter-5': CLASS_6_OS_QA,
  'class-6/chapter-6': CLASS_6_OS_QA,
  'class-7/chapter-5': CLASS_7_SOFTWARE_QA,
  'class-7/c7-ch5': CLASS_7_SOFTWARE_QA,
};

export function getQAData(classId = 'class-6', chapterId = 'chapter-5') {
  const key = `${classId}/${chapterId}`;
  if (CLASS_QA_REGISTRY[key]) {
    return CLASS_QA_REGISTRY[key];
  }
  if (classId === 'class-7') {
    return CLASS_7_SOFTWARE_QA;
  }
  return CLASS_6_OS_QA;
}

