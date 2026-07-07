import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
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
    <div className="flex h-screen items-center justify-center bg-background flex-col gap-4">
      <Loader2 size={32} className="animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}