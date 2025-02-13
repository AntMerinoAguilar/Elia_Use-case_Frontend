import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"; //On importe "Calendar" pour afficher le calendrier et "momentLocalizer" pour configurer le localisateur de dates
import moment from "moment"; //on utilise "moment" pour formater les dates pour le calendrier
import "react-big-calendar/lib/css/react-big-calendar.css"; //importé pour appliquer les styles du calendrier
import axios from "axios"; //utilisé pour effectuer des requêtes HTTP pour récupérer les données du backend (les événements)

const localizer = momentLocalizer(moment); // permet d'utiliser "Moment.js" pour gérer et formater les dates et heures dans le calendrier

const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  // Récupérer les événements depuis le backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/shifts", {
        withCredentials: true, // Permet l'envoi des cookies
      }) //mettre le bon URL quand sera en production
      .then((response) => {
        console.log("ok connecté avec le back");
        console.log(response.data);
        const formattedEvents = response.data.map((shift) => ({
          id: shift._id,
          title: `Shift: ${shift.agentCode}`,
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
    <div style={{ height: 700 }}>
      <h2>Calendrier</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", margin: "20px" }}
        selectable={true} // Active la sélection
        onSelectEvent={(event) => alert(`Événement : ${event.title}`)}
        onSelectSlot={(slotInfo) =>
          console.log("Création d'événement :", slotInfo)
        }
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default MyCalendar;
