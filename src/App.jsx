import React from "react";
import { AgentProvider } from "./context/AgentContext"; // Importer le Provider
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ExchangePage from "./pages/ExchangePage";
import NotificationPage from "./pages/NotificationPage";
import NewRequestPage from "./pages/NewRequestPage";

function App() {
  return (
    <AgentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calendar" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/newRequest" element={<NewRequestPage />} />
        </Routes>
      </Router>
    </AgentProvider>
  );
}


export default App;
