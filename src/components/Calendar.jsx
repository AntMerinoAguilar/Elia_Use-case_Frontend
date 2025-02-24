import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar"; // On importe "Calendar" pour afficher le calendrier et "momentLocalizer" pour configurer le localisateur de dates
import moment from "moment"; // On utilise "moment" pour formater les dates pour le calendrier
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendarStyles.css";
import axios from "axios";
import { display } from "@mui/system";
import { API_URL } from "../config/api.config";

const localizer = momentLocalizer(moment); // permet d'utiliser "Moment.js" pour gérer et formater les dates et heures dans le calendrier
moment.updateLocale("fr", { week: { dow: 4 } }); // Définit jeudi comme premier jour de la semaine (dimanche - index : 0; jeudi - index : 4)

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/shifts`, {
        withCredentials: true,
      })
      .then((response) => {
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

        setEvents(formattedEvents);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des shifts :", error)
      );
  }, []);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || "#ccc";
    const style = {
      backgroundColor,
      color: "white",
      borderRadius: "5px",
      padding: "2px",
      border: "none",
      height: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
    };
    return { style };
  };

  return (
    <div style={{ padding: "10px" }} className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: "100%",
          gap: "5px",
        }}
        selectable={true}
        onSelectEvent={(event) => setSelectedEvent(event)}
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
            <div className="modalbtn">
              <button onClick={() => setSelectedEvent(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
