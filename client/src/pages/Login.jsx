import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Mail,
  Lock,
  ArrowRight,
  LogIn,
  Sparkles,
} from 'lucide-react';

import useAuthStore from '../store/authStore';

const T = {
  canvas: '#FCFCFC',
  surface: '#FFFFFF',
  muted: '#F4F4F5',
  ink: '#262626',
  inkMuted: '#737373',
  brand: '#1E2433',
  brandFg: '#FCFCFC',
  border: 'rgba(0,0,0,0.08)',
  danger: '#EF4444',
};

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    const ok = await login(form);

    setLoading(false);

    if (ok) {
      navigate('/dashboard');
    } else {
      setError(
        'Invalid email or password. Please try again.'
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 14px 13px 42px',
    borderRadius: 12,
    border: `1px solid ${T.border}`,
    background: T.surface,
    fontSize: 14,
    color: T.ink,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.canvas,
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          padding: '14px 18px',
          minHeight: 64,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          borderBottom: `1px solid ${T.border}`,
          background: T.surface,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 20,
            color: T.ink,
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Sparkles size={20} />
          LoopMock
        </Link>

        <span
          style={{
            fontSize: 14,
            color: T.inkMuted,
            textAlign: 'center',
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            style={{
              color: T.brand,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign up free
          </Link>
        </span>
      </nav>

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
          }}
        >
          {/* Heading */}
          <div style={{ marginBottom: 30 }}>
            <h1
              style={{
                fontSize:
                  'clamp(30px, 5vw, 38px)',
                fontWeight: 700,
                letterSpacing: '-1.5px',
                color: T.ink,
                margin: '0 0 10px',
                lineHeight: 1.1,
              }}
            >
              Welcome back
            </h1>

            <p
              style={{
                fontSize: 15,
                color: T.inkMuted,
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              Sign in to continue your
              interview practice
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              background: T.surface,
              border: `1px solid ${T.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontSize: 14,
              fontWeight: 600,
              color: T.ink,
              cursor: 'pointer',
              marginBottom: 22,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                T.muted;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                T.surface;
            }}
          >
            <LogIn size={18} />
            Continue with Google
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: T.border,
              }}
            />

            <span
              style={{
                fontSize: 12,
                color: T.inkMuted,
                whiteSpace: 'nowrap',
              }}
            >
              or continue with email
            </span>

            <div
              style={{
                flex: 1,
                height: 1,
                background: T.border,
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border:
                  '1px solid #FECACA',
                borderRadius: 12,
                padding: '12px 14px',
                marginBottom: 18,
                fontSize: 14,
                color: T.danger,
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 7,
                }}
              >
                Email
              </label>

              <div
                style={{
                  position: 'relative',
                }}
              >
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform:
                      'translateY(-50%)',
                    color: T.inkMuted,
                  }}
                />

                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      T.brand;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      T.border;
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 7,
                }}
              >
                Password
              </label>

              <div
                style={{
                  position: 'relative',
                }}
              >
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform:
                      'translateY(-50%)',
                    color: T.inkMuted,
                  }}
                />

                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      T.brand;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      T.border;
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                background: loading
                  ? '#9CA3AF'
                  : T.brand,
                color: T.brandFg,
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
                transition:
                  'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.opacity =
                    '0.9';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity =
                  '1';
              }}
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontSize: 14,
              color: T.inkMuted,
              lineHeight: 1.7,
            }}
          >
            New to LoopMock?{' '}
            <Link
              to="/register"
              style={{
                color: T.brand,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}