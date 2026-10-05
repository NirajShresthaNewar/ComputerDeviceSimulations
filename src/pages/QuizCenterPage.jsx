import { Link } from 'react-router-dom';

export default function QuizCenterPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1>Quiz & Practice Center</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
          Interactive quizzes, classroom spinning wheels, and revision tools for school computer classes.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(139, 92, 246, 0.15))',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>🎡</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text)' }}>
                Classroom Quiz Wheel
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#EC4899', fontWeight: '600' }}>
                Featured • Smartboard Interactive
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>
            Spin the 🎯 Question Wheel and 👨‍🎓 Roll Number Wheel for real-time classroom participation with non-repeating students and turn history.
          </p>
          <Link
            to="/quiz-wheel"
            style={{
              marginTop: 'auto',
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              color: '#ffffff',
              fontWeight: '700',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '0.95rem',
            }}
          >
            Launch Quiz Wheel ➔
          </Link>
        </div>
      </div>
    </div>
  );
}