import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';


export default function AuthCallback() {
  const navigate    = useNavigate();
  const [params]    = useSearchParams();
  const { setToken, init } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    setToken(token);
    init().then(() => {
      navigate('/dashboard', { replace: true });
    });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FCFCFC',
      fontFamily: "'Inter', Arial, sans-serif",
      gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #F4F4F5',
        borderTopColor: '#1E2433',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: 15, color: '#737373', margin: 0 }}>
        Signing you in…
      </p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}