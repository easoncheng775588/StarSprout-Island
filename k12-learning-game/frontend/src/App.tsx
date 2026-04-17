import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeWorld } from './pages/HomeWorld';
import { Leaderboard } from './pages/Leaderboard';
import { SubjectMap } from './pages/SubjectMap';
import { LevelPlayer } from './pages/LevelPlayer';
import { ParentDashboard } from './pages/ParentDashboard';
import { AchievementsPage } from './pages/AchievementsPage';
import { LoginPage } from './pages/LoginPage';
import { SessionProvider, useSession } from './session';
import './styles.css';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useSession();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><HomeWorld /></ProtectedRoute>} />
      <Route path="/subjects/:subjectCode" element={<ProtectedRoute><SubjectMap /></ProtectedRoute>} />
      <Route path="/levels/:levelCode" element={<ProtectedRoute><LevelPlayer /></ProtectedRoute>} />
      <Route path="/parent" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  );
}
