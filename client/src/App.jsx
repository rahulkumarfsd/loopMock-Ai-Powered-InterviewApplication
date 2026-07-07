import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Layout from "./components/ui/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSkeleton, AnalyticsSkeleton, InterviewSkeleton, FeedbackSkeleton, GenericSkeleton } from "@/components/skeletons";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Interview = lazy(() => import("./pages/Interview"));
const CodingInterview = lazy(() => import("./pages/CodingInterview"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Analytics = lazy(() => import("./pages/Analytics"));
const CompanyPrep = lazy(() => import("./pages/CompanyPrep"));
const PeerMock = lazy(() => import("./pages/PeerMock"));

function AuthLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-border border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function PageFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin" />
    </div>
  );
}

const Protected = ({ children }) => {
  const { token, initialized } = useAuthStore();
  if (!initialized) return <AuthLoading />;
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
      <Route path="/" element={
        <Suspense fallback={<PageFallback />}>
          <Landing />
        </Suspense>
      } />

      <Route path="/login" element={
        <Guest>
          <Suspense fallback={<PageFallback />}>
            <Login />
          </Suspense>
        </Guest>
      } />

      <Route path="/register" element={
        <Guest>
          <Suspense fallback={<PageFallback />}>
            <Register />
          </Suspense>
        </Guest>
      } />

      <Route path="/auth/callback" element={
        <Suspense fallback={<PageFallback />}>
          <AuthCallback />
        </Suspense>
      } />

      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="dashboard" element={
          <Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense>
        } />
        <Route path="interview" element={
          <Suspense fallback={<InterviewSkeleton />}><Interview /></Suspense>
        } />
        <Route path="interview/:id" element={
          <Suspense fallback={<InterviewSkeleton />}><Interview /></Suspense>
        } />
        <Route path="coding" element={
          <Suspense fallback={<GenericSkeleton />}><CodingInterview /></Suspense>
        } />
        <Route path="coding/:id" element={
          <Suspense fallback={<GenericSkeleton />}><CodingInterview /></Suspense>
        } />
        <Route path="feedback/:id" element={
          <Suspense fallback={<FeedbackSkeleton />}><Feedback /></Suspense>
        } />
        <Route path="analytics" element={
          <Suspense fallback={<AnalyticsSkeleton />}><Analytics /></Suspense>
        } />
        <Route path="companies" element={
          <Suspense fallback={<GenericSkeleton />}><CompanyPrep /></Suspense>
        } />
        <Route path="peer" element={
          <Suspense fallback={<GenericSkeleton />}><PeerMock /></Suspense>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
