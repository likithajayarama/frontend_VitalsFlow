import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TriagePage from './pages/TriagePage';
import ScribePage from './pages/ScribePage';
import MonitorPage from './pages/MonitorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/triage" replace />} />
          <Route path="triage" element={<TriagePage />} />
          <Route path="scribe" element={<ScribePage />} />
          <Route path="monitor" element={<MonitorPage />} />
          <Route path="*" element={<Navigate to="/triage" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
