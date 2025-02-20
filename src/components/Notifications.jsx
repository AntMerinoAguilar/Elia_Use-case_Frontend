import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAgent } from "../context/AgentContext";
import { Link } from "react-router-dom";
import {API_URL} from '../config/api.config' 
import "../styles/Notifications.css"; 


const Notifications = () => {
  const { agent } = useAgent();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!agent || !agent._id) return;

    axios
      .get(`http://localhost:3000/api/notif/${agent._id}`, { withCredentials: true })
      .then((response) => {
        const sortedNotifications = response.data.sort((a, b) => {
          // Trier d'abord par isRead (false en premier), puis par date descendante
          if (a.isRead === b.isRead) {
            return new Date(b.createdAt) - new Date(a.createdAt); // Trier par date décroissante
          }
          return a.isRead ? 1 : -1; // Placer les non lues en premier
        });

        setNotifications(sortedNotifications);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur chargement notifications :", error);
        setLoading(false);
      });
  }, [agent]);

  const markAsRead = (id) => {
    axios
      .put(`http://localhost:3000/api/notif/${id}/read`, {}, { withCredentials: true })
      .then(() => {
        setNotifications((prev) =>
          prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif))
        );
      })
      .catch((error) => console.error("Erreur lors de la mise à jour :", error));
  };

  console.log("Agent connecté :", agent);

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Notifications</h2>
      {loading ? (
        <p className="loading">Chargement...</p>
      ) : notifications.length === 0 ? (
        <p className="no-notifications">Aucune notification</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notif) => (
            <li key={notif._id} className={`notification-item ${notif.isRead ? "read" : "unread"}`}>
              <Link
                to="/exchange"
                onClick={() => !notif.isRead && markAsRead(notif._id)} // Marque la notif comme lue si elle ne l'est pas encore
                className="notification-link"
              >
                <strong>{notif.type}</strong> - {notif.message}
                <br />
                <small>{new Date(notif.createdAt).toLocaleString()}</small>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;




