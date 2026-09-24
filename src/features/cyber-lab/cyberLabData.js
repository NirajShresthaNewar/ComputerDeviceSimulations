export const VIRUS_TYPES_INFO = [
  {
    id: 'boot-sector',
    name: 'Boot Sector Virus',
    icon: '🥾',
    target: 'Master Boot Record (MBR) & Storage Sector 0',
    description: 'Infects the critical startup code on hard disks or USB drives so that the virus runs before the operating system even loads.',
    historicalExample: 'Brain Virus (1986), Michelangelo Virus',
    prevention: 'Never boot from untrusted USB drives; enable BIOS/UEFI Secure Boot and Antivirus Pre-Boot scanner.'
  },
  {
    id: 'file-infector',
    name: 'File Infector Virus',
    icon: '📄',
    target: 'Executable Files (.EXE, .COM, .BAT, .SYS)',
    description: 'Attaches malicious parasitic code onto executable programs. When the user opens the infected program, the virus executes first, then spreads to other files.',
    historicalExample: 'CIH (Chernobyl) Virus, Jerusalem Virus',
    prevention: 'Scan downloaded files with antivirus before opening; look for unexpected file size changes.'
  },
  {
    id: 'system-infector',
    name: 'System / Kernel Infector',
    icon: '⚙️',
    target: 'Operating System Kernel, RAM, System DLLs & Services',
    description: 'Hijacks core OS components in memory to gain administrative control, hide from task manager, and manipulate background processes.',
    historicalExample: 'Rootkits, Stuxnet, Conficker',
    prevention: 'Keep Operating System updated with security patches; enable Real-Time Behavior Shield.'
  },
  {
    id: 'message-carrier',
    name: 'Message & Network Carrier (Worm)',
    icon: '✉️',
    target: 'Email Inboxes, Messaging Apps, LAN Networks',
    description: 'Disguises itself as tempting email attachments or chat links (e.g. "Free_Game.exe") and automatically forwards itself to everyone in your contact list.',
    historicalExample: 'ILOVEYOU Worm (2000), Mydoom',
    prevention: 'Never open attachments from unknown senders; scan attachments before running; verify file extensions.'
  }
];

export const DETECTIVE_SCENARIOS = [
  {
    id: 'case-1',
    title: 'Case #1: The Monday Morning Black Screen',
    scenario: 'A school student plugged in an old USB flash drive to copy homework, shut down their computer, and when turning it back on next morning, the PC displayed "No Operating System Found" before Windows could even start.',
    options: [
      { id: 'boot-sector', label: '🥾 Boot Sector Virus', isCorrect: true, reason: 'The virus corrupted Sector 0 (startup sector) during the boot phase before Windows loaded.' },
      { id: 'file-infector', label: '📄 File Infector Virus', isCorrect: false, reason: 'File infectors attack specific .exe files while OS is running, not during initial PC power-on.' },
      { id: 'message-carrier', label: '✉️ Message / Email Carrier', isCorrect: false, reason: 'Message carriers spread through chat apps or email, not through boot-order power-up.' },
    ]
  },
  {
    id: 'case-2',
    title: 'Case #2: The Growing Calculator App',
    scenario: 'After playing a cracked video game, a student noticed that Calculator, MS Paint, and Notepad started taking twice as long to open, and their file sizes grew by exactly 45 KB each.',
    options: [
      { id: 'file-infector', label: '📄 File Infector Virus', isCorrect: true, reason: 'File infectors append their malicious code directly into executable files, increasing their file size.' },
      { id: 'boot-sector', label: '🥾 Boot Sector Virus', isCorrect: false, reason: 'Boot sector viruses do not modify individual user applications like Calculator or Paint.' },
      { id: 'system-infector', label: '⚙️ System Infector', isCorrect: false, reason: 'While it affects apps, the physical growth of .exe file sizes is the classic trademark of File Infectors.' },
    ]
  },
  {
    id: 'case-3',
    title: 'Case #3: The Suspicious School Chat Link',
    scenario: 'A student received a direct message on SchoolChat from a classmate saying "Look at this cool Minecraft mod! Click Free_Mod.exe". Moments after opening it, all 30 students in the class chat received the same message automatically.',
    options: [
      { id: 'message-carrier', label: '✉️ Message / Network Carrier (Worm)', isCorrect: true, reason: 'It hijacked the messaging contact list and self-propagated across the chat network.' },
      { id: 'boot-sector', label: '🥾 Boot Sector Virus', isCorrect: false, reason: 'Boot sector viruses cannot send chat messages across the internet.' },
      { id: 'file-infector', label: '📄 File Infector Virus', isCorrect: false, reason: 'Standard file infectors stay on one machine unless shared; auto-sending across chats is a Worm/Carrier behavior.' },
    ]
  },
  {
    id: 'case-4',
    title: 'Case #4: The Ghost Task Manager Process',
    scenario: 'An unknown background service is consuming 90% CPU. When the user opens Task Manager to terminate it, Task Manager immediately crashes and user access is blocked.',
    options: [
      { id: 'system-infector', label: '⚙️ System / Kernel Infector', isCorrect: true, reason: 'It hijacked OS administrative services and memory to prevent the user from closing rogue processes.' },
      { id: 'boot-sector', label: '🥾 Boot Sector Virus', isCorrect: false, reason: 'Boot sector viruses operate during pre-boot, not inside running Windows Task Manager.' },
      { id: 'message-carrier', label: '✉️ Message Carrier', isCorrect: false, reason: 'Message carriers focus on spreading messages rather than tampering with OS Kernel processes.' },
    ]
  }
];
