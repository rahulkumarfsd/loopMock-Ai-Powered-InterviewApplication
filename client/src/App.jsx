import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Layout from "./components/ui/Layout";
import Spinner from "./components/ui/Spinner";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";

import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import CodingInterview from "./pages/CodingInterview";
import Feedback from "./pages/Feedback";
import Analytics from "./pages/Analytics";
import CompanyPrep from "./pages/CompanyPrep";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import PeerMock from "./pages/PeerMock";

const Protected = ({ children }) => {
  const { token, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0f",
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
};

const Guest = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <Guest>
            <Login />
          </Guest>
        }
      />

      <Route
        path="/register"
        element={
          <Guest>
            <Register />
          </Guest>
        }
      />

      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="interview" element={<Interview />} />
        <Route path="interview/:id" element={<Interview />} />
        <Route path="coding" element={<CodingInterview />} />
        <Route path="coding/:id" element={<CodingInterview />} />
        <Route path="feedback/:id" element={<Feedback />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="companies" element={<CompanyPrep />} />
        <Route path="peer" element={<PeerMock />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
