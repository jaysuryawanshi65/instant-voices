import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import HomePage from './pages/HomePage';
import CreateVoicePage from './pages/CreateVoicePage';
import { useCustomVoices } from './hooks/useCustomVoices';

function AppContent() {
  const { createVoice } = useCustomVoices();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateVoicePage onCreate={createVoice} />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
