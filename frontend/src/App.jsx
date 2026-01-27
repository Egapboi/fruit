import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PlantSelector from './pages/PlantSelector';
import CareGuide from './pages/CareGuide';
import CameraUpload from './pages/CameraUpload';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Chatbot from './pages/Chatbot';
import Navbar from './components/Navbar';
import './index.css';

const ProtectedLayout = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  // For development/demo purposes, you might want to comment out the check or use a mock token
  // if (!isAuthenticated) return <Navigate to="/login" />;

  // Real implementation:
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <>
      <div style={{ paddingBottom: '100px' }}>
        {children}
      </div>
      <Navbar />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={<ProtectedLayout><PlantSelector /></ProtectedLayout>} />
          <Route path="/care" element={<ProtectedLayout><CareGuide /></ProtectedLayout>} />
          <Route path="/camera" element={<ProtectedLayout><CameraUpload /></ProtectedLayout>} />
          <Route path="/quiz" element={<ProtectedLayout><Quiz /></ProtectedLayout>} />
          <Route path="/leaderboard" element={<ProtectedLayout><Leaderboard /></ProtectedLayout>} />
          <Route path="/chat" element={<ProtectedLayout><Chatbot /></ProtectedLayout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
