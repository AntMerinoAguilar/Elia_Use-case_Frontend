import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAgent } from "../context/AgentContext";
import logo from "../assets/logo Elia.png";
import calendar from "../assets/calendrier2.png";
import notif from "../assets/notifications lu.png";
import unreadnotif from "../assets/notifications non lu.png";
import request from "../assets/requests lu.png";
import profile from "../assets/utilisateur.png";
import { API_URL } from "../config/api.config";
import "../styles/Navigation.css";

const Navigation = () => {
  const { agent } = useAgent();
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(false);

  useEffect(() => {
    if (!agent || !agent._id) return;

    axios
      .get(`${API_URL}/notif/${agent._id}`, { withCredentials: true })
      .then((response) => {
        const hasUnread = response.data.some((notif) => !notif.isRead);
        setHasUnreadNotifs(hasUnread);
      })
      .catch((error) =>
        console.error("Erreur chargement notifications :", error)
      );
  }, []);

  return (
    <nav className="navbar">
      <div className="home">
        <img src={logo} alt="Logo Elia" className="logo-nav" />
        <Link to="/calendar">
          <img src={calendar} alt="Calendrier" className="home-icon" />
        </Link>
      </div>
      <ul className="navlinks">
        <li className="navlink requests">
          <Link to="/exchange">
            <img src={request} alt="Demandes" />
          </Link>
        </li>
        <li className="navlink notifications">
          <Link to="/notifications">
            <img
              src={hasUnreadNotifs ? unreadnotif : notif}
              alt="Notifications"
            />
          </Link>
        </li>
        <li className="navlink profile">
          <Link to="/profile">
            <img src={profile} alt="Profil" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
