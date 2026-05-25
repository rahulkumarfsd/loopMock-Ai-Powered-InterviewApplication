import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Layout from './components/ui/Layout';
import Spinner from './components/ui/Spinner';

// Public pages
import Landing        from './pages/Landing';
import Login          from './pages/Login';
import Register       from './pages/Register';
import AuthCallback   from './pages/AuthCallback';

// Protected pages
import Dashboard      from './pages/Dashboard';
import Interview      from './pages/Interview';
import CodingInterview from './pages/CodingInterview';
import Feedback       from './pages/Feedback';
import Analytics      from './pages/Analytics';
import CompanyPrep    from './pages/CompanyPrep';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import PeerMock       from './pages/PeerMock';

// ── Route Guards ─────────────────────────────────────

// If not logged in → redirect to /login
const Protected = ({ children }) => {
  const { token, initialized } = useAuthStore();

  // Still loading session from localStorage
  if (!initialized) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0d0d0f' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
};

// If already logged in → redirect to /dashboard (don't show login/register again)
const Guest = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  const init = useAuthStore((s) => s.init);

  // On first load: check localStorage for token and restore session
  useEffect(() => {
    init();
  }, []);

  return (
    <Routes>

      {/* ── PUBLIC ROUTES ─────────────────────────────────── */}

      {/* Landing page — first thing everyone sees */}
      <Route path="/" element={<Landing />} />

      {/* Login — redirects to dashboard if already logged in */}
      <Route path="/login" element={
        <Guest><Login /></Guest>
      } />

      {/* Register — redirects to dashboard if already logged in */}
      <Route path="/register" element={
        <Guest><Register /></Guest>
      } />

      {/* Google OAuth callback — handles token from URL */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* ── PROTECTED ROUTES (need login) ─────────────────── */}
      {/* All inside Layout which has the sidebar */}
      <Route path="/" element={
        <Protected>
          <Layout />
        </Protected>
      }>
        <Route path="dashboard"     element={<Dashboard />} />
        <Route path="interview"     element={<Interview />} />
        <Route path="interview/:id" element={<Interview />} />
        <Route path="coding"        element={<CodingInterview />} />
        <Route path="coding/:id"    element={<CodingInterview />} />
        <Route path="feedback/:id"  element={<Feedback />} />
        <Route path="analytics"     element={<Analytics />} />
        <Route path="companies"     element={<CompanyPrep />} />
        <Route path="resume"        element={<ResumeAnalyzer />} />
        <Route path="peer"          element={<PeerMock />} />
      </Route>

      {/* ── FALLBACK ──────────────────────────────────────── */}
      {/* Any unknown URL → back to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}