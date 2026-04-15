import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeWorld } from './pages/HomeWorld';
import { Leaderboard } from './pages/Leaderboard';
import { SubjectMap } from './pages/SubjectMap';
import { LevelPlayer } from './pages/LevelPlayer';
import { ParentDashboard } from './pages/ParentDashboard';
import { AchievementsPage } from './pages/AchievementsPage';
import './styles.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeWorld />} />
      <Route path="/subjects/:subjectCode" element={<SubjectMap />} />
      <Route path="/levels/:levelCode" element={<LevelPlayer />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
