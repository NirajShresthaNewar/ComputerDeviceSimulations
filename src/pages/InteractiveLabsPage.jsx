import { Link } from 'react-router-dom';

export default function InteractiveLabsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1>Interactive Labs</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
          Hands-on interactive lab exercises and virtual experiments for computer science concepts.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Operating System Lab */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🖥️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)' }}>
                You Are the Operating System!
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: '600' }}>
                Class 5 CS • Interactive Simulation
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: 1.45 }}>
            Manage memory, files, running programs, hardware devices, and user security. Complete the 6-step guided OS mission!
          </p>
          <Link
            to="/software/operating-system"
            style={{
              marginTop: 'auto',
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#8b5cf6',
              color: '#ffffff',
              fontWeight: '700',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '0.9rem',
            }}
          >
            Open OS Lab ➔
          </Link>
        </div>

        {/* Device Driver Lab */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🧑‍🔧</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)' }}>
                Device Driver Lab
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600' }}>
                Class 5 CS • Interactive Story
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: 1.45 }}>
            See why the computer needs a driver helper to talk to printers, keyboards, mice, and speakers. Toggle driver ON/OFF and watch the conversation!
          </p>
          <Link
            to="/software/device-driver"
            style={{
              marginTop: 'auto',
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#3b82f6',
              color: '#ffffff',
              fontWeight: '700',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '0.9rem',
            }}
          >
            Open Driver Lab ➔
          </Link>
        </div>

        {/* Language Translators Lab */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🔀</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)' }}>
                Language Translators Lab
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: '600' }}>
                Class 5 CS • Interactive
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: 1.45 }}>
            Experiment with Compilers, Interpreters, and Assemblers. Step through line-by-line execution and whole-batch compilation in real computer mode or English-to-Nepali analogy mode.
          </p>
          <Link
            to="/software/language-translators"
            style={{
              marginTop: 'auto',
              padding: '10px 18px',
              borderRadius: '8px',
              background: 'var(--color-accent)',
              color: '#0b0e14',
              fontWeight: '700',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '0.9rem',
            }}
          >
            Open Translator Lab ➔
          </Link>
        </div>
      </div>
    </div>
  );
}