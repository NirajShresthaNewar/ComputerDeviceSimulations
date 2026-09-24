import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InputDevicesPage from './pages/InputDevicesPage';
import OutputDevicesPage from './pages/OutputDevicesPage';
import StorageDevicesPage from './pages/StorageDevicesPage';
import DeviceComparisonPage from './pages/DeviceComparisonPage';
import InteractiveLabsPage from './pages/InteractiveLabsPage';
import QuizCenterPage from './pages/QuizCenterPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import AboutPage from './pages/AboutPage';
import ClassQAPage from './pages/ClassQAPage';
import ClassChapterQAView from './features/class-qa/ClassChapterQAView';
import CyberVirusLabSim from './features/cyber-lab/CyberVirusLabSim';
import KeyboardSim from './features/input-devices/keyboard/KeyboardSim';
import MouseSim from './features/input-devices/mouse/MouseSim';
import MicSim from './features/input-devices/microphone/MicSim';
import ScannerSim from './features/input-devices/scanner/ScannerSim';
import JoystickSim from './features/input-devices/joystick/JoystickSim';
import MonitorSim from './features/output-devices/monitor/MonitorSim';
import ImpactPrinterSim from './features/output-devices/printer/ImpactPrinterSim';
import SpeakerSim from './features/output-devices/speaker/SpeakerSim';
import HddSim from './features/storage-devices/hdd/HddSim';
import TapeSim from './features/storage-devices/magnetic-tape/TapeSim';
import LanguageTranslatorSim from './features/software/language-translators/LanguageTranslatorSim';
import DeviceDriverSim from './features/software/device-driver/DeviceDriverSim';
import OperatingSystemSim from './features/software/operating-system/OperatingSystemSim';
import ApplicationSoftwareSim from './features/software/application-software/ApplicationSoftwareSim';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/input-devices" element={<InputDevicesPage />} />
      <Route path="/input-devices/keyboard" element={<KeyboardSim />} />
      <Route path="/output-devices" element={<OutputDevicesPage />} />
      <Route path="/storage-devices" element={<StorageDevicesPage />} />
      <Route path="/compare" element={<DeviceComparisonPage />} />
      <Route path="/labs" element={<InteractiveLabsPage />} />
      <Route path="/labs/cyber-virus-lab" element={<CyberVirusLabSim />} />
      <Route path="/cyber-virus-lab" element={<CyberVirusLabSim />} />
      <Route path="/quiz" element={<QuizCenterPage />} />
      <Route path="/teacher" element={<TeacherDashboardPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/input-devices/mouse" element={<MouseSim />} />
      <Route path="/input-devices/microphone" element={<MicSim />} />
      <Route path="/input-devices/scanner" element={<ScannerSim />} />
      <Route path="/input-devices/joystick" element={<JoystickSim />} />
      <Route path="/output-devices/monitor" element={<MonitorSim />} />
      <Route path="/output-devices/printer" element={<ImpactPrinterSim />} />
      <Route path="/output-devices/speaker" element={<SpeakerSim />} />

      <Route path="/storage-devices/hdd" element={<HddSim />} />
      <Route path="/storage-devices/magnetic-tape" element={<TapeSim />} />

      <Route path="/software/application-software" element={<ApplicationSoftwareSim />} />
      <Route path="/application-software" element={<ApplicationSoftwareSim />} />
      <Route path="/software/operating-system" element={<OperatingSystemSim />} />
      <Route path="/operating-system" element={<OperatingSystemSim />} />
      <Route path="/software/device-driver" element={<DeviceDriverSim />} />
      <Route path="/device-driver" element={<DeviceDriverSim />} />
      <Route path="/software/language-translators" element={<LanguageTranslatorSim />} />
      <Route path="/language-translators" element={<LanguageTranslatorSim />} />

      {/* Class Syllabus Q&A Routes */}
      <Route path="/class-qa" element={<ClassQAPage />} />
      <Route path="/class-qa/:classId" element={<ClassQAPage />} />
      <Route path="/class-qa/class-6/chapter-5" element={<ClassChapterQAView />} />
      <Route path="/class-qa/:classId/:chapterId" element={<ClassChapterQAView />} />
      <Route path="/class/6/chapter/5" element={<ClassChapterQAView />} />
    </Routes>
  );
}