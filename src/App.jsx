import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import AppRouter from './router';
import './styles/variables.css';
import './styles/global.css';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, minHeight: '100vh' }}>
              <Topbar />
              <main style={{ padding: '32px' }}>
                <AppRouter />
              </main>
            </div>
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}