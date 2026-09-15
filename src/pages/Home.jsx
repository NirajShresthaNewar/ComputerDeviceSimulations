import { Link } from 'react-router-dom';
import { deviceCatalog } from '../data/deviceCatalog';
import DeviceCard from '../components/simulation-shell/DeviceCard';

export default function Home() {
  const featuredTranslators = deviceCatalog.find((d) => d.id === 'language-translators');
  const otherDevices = deviceCatalog.filter((d) => d.id !== 'language-translators' && d.status === 'done').slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Computer System Simulator</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', margin: 0 }}>
          Interactive educational simulations for computer hardware, peripheral devices, and system software.
        </p>
      </div>

      {/* Featured Simulations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Card 1: Operating System */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(59, 130, 246, 0.15) 100%)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: '#8b5cf6',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Interactive OS
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Class 5 Computer Science
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text)' }}>
            🖥️ You Are the Operating System!
          </h2>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            Manage a virtual computer yourself! Coordinate running processes, allocate RAM blocks, organize files, manage devices, and enforce password security.
          </p>
          <Link
            to="/software/operating-system"
            style={{
              marginTop: 'auto',
              padding: '12px 20px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: '#ffffff',
              fontWeight: '700',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)',
            }}
          >
            Launch OS Simulator ➔
          </Link>
        </div>

        {/* Card 2: Device Driver */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: '#3b82f6',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Interactive Story
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Class 5 Computer Science
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text)' }}>
            🧑‍🔧 Device Driver: Hardware Helper
          </h2>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            See why computers need device drivers! Toggle Driver ON/OFF to watch printers, speakers, keyboards, and mice communicate with the computer.
          </p>
          <Link
            to="/software/device-driver"
            style={{
              marginTop: 'auto',
              padding: '12px 20px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              fontWeight: '700',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)',
            }}
          >
            Launch Driver Sim ➔
          </Link>
        </div>

        {/* Card 3: Language Translators */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(61, 220, 151, 0.12) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: 'var(--color-accent)',
                color: '#0b0e14',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Interactive Lab
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Class 5 Computer Science
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-text)' }}>
            🔀 Language Translators
          </h2>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            Compare High-Level Code to Binary 0s & 1s vs our English ➔ Nepali analogy. Step through line-by-line interpretation & whole-program compilation!
          </p>
          <Link
            to="/software/language-translators"
            style={{
              marginTop: 'auto',
              padding: '12px 20px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: '700',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
            }}
          >
            Launch Translator Sim ➔
          </Link>
        </div>
      </div>

      {/* Other device simulations */}
      <div>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-text)' }}>Explore Device Simulators</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {otherDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    </div>
  );
}