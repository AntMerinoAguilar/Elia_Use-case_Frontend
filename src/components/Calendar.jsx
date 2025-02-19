import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"; //On importe "Calendar" pour afficher le calendrier et "momentLocalizer" pour configurer le localisateur de dates
import moment from "moment"; //on utilise "moment" pour formater les dates pour le calendrier
import "react-big-calendar/lib/css/react-big-calendar.css"; //importé pour appliquer les styles du calendrier
import "../styles/calendarStyles.css";
import axios from "axios"; //utilisé pour effectuer des requêtes HTTP pour récupérer les données du backend (les événements)

const localizer = momentLocalizer(moment); // permet d'utiliser "Moment.js" pour gérer et formater les dates et heures dans le calendrier
moment.updateLocale("fr", { week: { dow: 4 } }); // Définit jeudi (4) comme premier jour de la semaine

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Stocke l'événement sélectionné

  // Récupérer les événements depuis le backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/shifts", {
        withCredentials: true, // Permet l'envoi des cookies
      }) //mettre le bon URL quand sera en production
      .then((response) => {
        console.log("ok connecté avec le back"); // à supprimer
        console.log(response.data); // à supprimer
        const formattedEvents = response.data.map((shift) => ({
          id: shift._id,
          title: `${shift.agentCode} | ${moment(shift.startDate).format(
            "DD/MM HH:mm"
          )} - ${moment(shift.endDate).format("DD/MM HH:mm")}`,
          start: new Date(shift.startDate),
          end: new Date(shift.endDate),
          allDay: false,
          resource: shift.status,
          agentCode: shift.agentCode,
          color: shift.agentId ? shift.agentId.color : "#f41313",
        }));

        // Si tu veux afficher les remplacements dans le calendrier (optionnel)
        // Ajoute les remplacements comme événements supplémentaires
        /* response.data.forEach(shift => {
          if (shift.replacements && shift.replacements.length > 0) {
            shift.replacements.forEach(replacement => {
              formattedEvents.push({
                id: `${shift._id}-replacement-${replacement.replacementId}`,
                title: `Replacement: ${replacement.replacementId}`,
                start: new Date(replacement.startTime),
                end: new Date(replacement.endTime),
                allDay: false,
                resource: replacement.status, // Statut du remplacement
              });
            });
          }
        }); */

        setEvents(formattedEvents);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des shifts :", error)
      );
  }, []);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || "#ccc"; // Si pas de couleur, gris par défaut
    const style = {
      backgroundColor,
      color: "white",
      borderRadius: "5px",
      padding: "5px",
      border: "none",
    };
    return { style };
  };

  return (
    <div 
    style={{ padding: "10px", }}
    className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", margin: "10px", padding: "10px", gap: "10px" }}
        selectable={true} // Active la sélection
        onSelectEvent={(event) => setSelectedEvent(event)} // Met à jour l'événement sélectionné
        onSelectSlot={(slotInfo) =>
          console.log("Création d'événement :", slotInfo)
        }
        eventPropGetter={eventStyleGetter}
        defaultDate={new Date(2026, 0, 1)} // 1er janvier 2026 (0 = janvier en JS)
        showMultiDayTimes={true} // Gérer l'affichage des shifts qui durent plusieurs jours
      />

      {/* Modale pour afficher les détails du shift */}
      {selectedEvent && (
        <div className="modal">
          <div
            className="modal-content"
            style={{ backgroundColor: selectedEvent.color || "#fff" }}
          >
            <h3>Détails du Shift</h3>
            <p>
              <strong>Agent :</strong> {selectedEvent.agentCode}
            </p>
            <p>
              <strong>Début :</strong>{" "}
              {moment(selectedEvent.start).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Fin :</strong>{" "}
              {moment(selectedEvent.end).format("DD/MM/YYYY HH:mm")}
            </p>
            <div className="modalbtn"><button onClick={() => setSelectedEvent(null)}>Fermer</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
