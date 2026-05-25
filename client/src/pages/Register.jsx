import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const T = {
  canvas:   '#FCFCFC',
  surface:  '#FFFFFF',
  muted:    '#F4F4F5',
  ink:      '#262626',
  inkMuted: '#737373',
  brand:    '#1E2433',
  brandFg:  '#FCFCFC',
  border:   'rgba(0,0,0,0.08)',
  danger:   '#EF4444',
  success:  '#22C55E',
};

export default function Register() {
  const navigate    = useNavigate();
  const { register} = useAuthStore();

  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const ok = await register(form);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Could not create account. Email may already be registered.');
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    border: `1px solid ${T.border}`, background: T.surface,
    fontSize: 14, color: T.ink, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: T.canvas, fontFamily: "'Inter', Arial, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* Minimal nav */}
      <nav style={{ padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${T.border}` }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 700, fontSize: 18, color: T.ink, letterSpacing: '-0.4px' }}>
          LoopMock
        </Link>
        <span style={{ fontSize: 14, color: T.inkMuted }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: T.brand, fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
        </span>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-1px', color: T.ink, margin: '0 0 8px' }}>
              Start practicing for free
            </h1>
            <p style={{ fontSize: 15, color: T.inkMuted, margin: 0 }}>
              Create your account and start your first mock interview in minutes
            </p>
          </div>

          {/* Google signup */}
          <button onClick={handleGoogleLogin} style={{
            width: '100%', padding: '12px 16px', borderRadius: 8,
            background: T.surface, border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 14, fontWeight: 500, color: T.ink, cursor: 'pointer',
            marginBottom: 20, transition: 'background 0.2s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = T.muted}
            onMouseLeave={(e) => e.currentTarget.style.background = T.surface}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 12, color: T.inkMuted }}>or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 14, color: T.danger }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: T.ink, marginBottom: 6 }}>Full name</label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = T.brand}
                onBlur={(e) => e.target.style.borderColor = T.border}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: T.ink, marginBottom: 6 }}>Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = T.brand}
                onBlur={(e) => e.target.style.borderColor = T.border}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: T.ink, marginBottom: 6 }}>Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = T.brand}
                onBlur={(e) => e.target.style.borderColor = T.border}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 8,
              background: loading ? '#9ca3af' : T.brand, color: T.brandFg,
              border: 'none', fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
            }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: T.inkMuted, lineHeight: 1.6 }}>
            By signing up you agree to our Terms of Service. No credit card required.
          </p>

          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: T.inkMuted }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: T.brand, fontWeight: 500, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}