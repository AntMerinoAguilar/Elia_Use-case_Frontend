import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ExchangePage from "./pages/ExchangePage";
import NotificationPage from "./pages/NotificationPage";
import UnavailabilitiesPage from "./pages/UnavailabilitiesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calendar" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/exchange" element={<ExchangePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/unavailabilities" element={<UnavailabilitiesPage />} />
      </Routes>
    </Router>
  );
}


export default App;
