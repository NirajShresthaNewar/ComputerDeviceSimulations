import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SidebarProvider } from './context/SidebarContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import AppRouter from './router';
import './styles/variables.css';
import './styles/global.css';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <BrowserRouter>
            <div style={{ display: 'flex', width: '100%', minHeight: '100vh', position: 'relative' }}>
              <Sidebar />
              <div style={{ flex: 1, minWidth: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Topbar />
                <main style={{ flex: 1, padding: '24px 32px' }}>
                  <AppRouter />
                </main>
              </div>
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}