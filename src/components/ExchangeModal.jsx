import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "./ui/Button";
import Select from "./ui/Select";
import MenuItem from "./ui/MenuItem";
import axios from "axios";
import { useAgent } from "../context/AgentContext";
import {API_URL} from '../config/api.config'

const ExchangeModal = ({ open, onClose, request, setRequests, onAccept }) => {
  const [selectedShift, setSelectedShift] = useState(null);
  const [startTime, setStartTime] = useState(""); // Heure de début du sous-shift
  const [endTime, setEndTime] = useState(""); // Heure de fin du sous-shift
  const [agentShifts, setAgentShifts] = useState([]); // Stocke les shifts de l'agent
  const [error, setError] = useState(""); // Gérer l'erreur dans la modal
  const { agent } = useAgent(); // Récupérer l'agent connecté

  // Met à jour les valeurs au changement de request
  useEffect(() => {
    setSelectedShift(null);
    setStartTime("");
    setEndTime("");
    setError("");
  }, [request]);

  // Charger les shifts de l'agent connecté
  useEffect(() => {
    if (!request || request.requestType !== "Swap") return; ///// potentiellement supp

    axios
      .get(`${API_URL}/shifts/me`, {
        withCredentials: true,
      })
      .then((response) => {
        // Filtrer les shifts de l'agent pour ne garder que ceux compris dans availableSlots
        const filteredShifts = response.data.filter((slot) =>
          request.availableSlots.some(
            (avail) =>
              new Date(slot.startDate).getTime() >=
                new Date(avail.startTime).getTime() &&
              new Date(slot.endDate).getTime() <=
                new Date(avail.endTime).getTime()
          )
        );

        setAgentShifts(filteredShifts);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des shifts :", error);
      });
  }, [agent, request]); // Recharger la liste si l'agent ou la demande change

  const handleAccept = () => {
    if (request.requestType === "Swap") {
      if (!selectedShift || !startTime || !endTime) {
        setError("Veuillez sélectionner un shift et un créneau horaire.");
        return;
      }

      const selectedStart = new Date(startTime).getTime();
      const selectedEnd = new Date(endTime).getTime();
      const shiftStart = new Date(selectedShift.startDate).getTime();
      const shiftEnd = new Date(selectedShift.endDate).getTime();
      const timeSlotDuration =
        new Date(request.timeSlot.endTime).getTime() -
        new Date(request.timeSlot.startTime).getTime();
      const selectedDuration = selectedEnd - selectedStart;

      if (selectedStart < shiftStart || selectedEnd > shiftEnd) {
        setError("Le créneau choisi doit être compris dans votre shift.");
        return;
      }

      if (selectedDuration !== timeSlotDuration) {
        setError(
          "La durée du créneau choisi ne correspond pas à la durée demandée."
        );
        return;
      }
    }

    if (request.requestType === "Urgent Replacement") {
      if (!startTime || !endTime) {
        setError("Veuillez sélectionner un créneau horaire.");
        return;
      }

      /* const selectedStart = new Date(startTime).getTime();
      const selectedEnd = new Date(endTime).getTime();
      const shiftStart = new Date(request.timeSlot.startDate).getTime();
      const shiftEnd = new Date(request.timeSlot.endDate).getTime();

      if (selectedStart < shiftStart || selectedEnd > shiftEnd) {
        setError("Le créneau choisi doit être compris dans le shift proposé.");
        return;
      } */
    }

    console.log("Valeur sélectionnée au moment du clic :", selectedShift); ////// supp
    // Si la logique côté backend échoue, on affiche l'erreur dans la modal
    onAccept(request._id, { startTime, endTime }).catch((err) =>
      setError(err.message)
    ); // Capturer les erreurs retournées
    onClose();

    if (response.status === 200) {
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== request._id)
      ); // Supprimer la demande de la liste
    } else {
      setError("Erreur lors de la suppression.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre demande ?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${API_URL}/requests/${request._id}/cancel`,
        {
          withCredentials: true,
        }
      );

      onClose(); // Fermer la modal après suppression

      if (response.status === 200) {
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== request._id)
        ); // Supprimer la demande de la liste
      } else {
        setError("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la request :", error);
      setError("Impossible de supprimer la demande.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} 
    style={{
      width: "350px",
      maxWidth: "90%", 
      margin: "auto",
      transform: "translate(-2%, 9.4%)"
      
      
    }}
    BackdropProps={{
      style: {
        backgroundColor: "transparent", // Supprime l'overlay en le rendant transparent
      },
    }}>
      <DialogTitle>
        Demande de {request.requestType}
        <IconButton
          aria-label="Fermer"
          onClick={onClose}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#888",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <p>
          <strong>Agent :</strong> {request.requesterId.name}{" "}
          {request.requesterId.surname}
        </p>

        <hr />
        <p>
          <strong>Shift à prendre :</strong>
        </p>
        <p>
          <strong>Début :</strong>{" "}
          {new Date(request.timeSlot.startTime).toLocaleString()}
        </p>
        <p>
          <strong>Fin :</strong>{" "}
          {new Date(request.timeSlot.endTime).toLocaleString()}
        </p>

        {request.requestType === "Swap" && (
          <div>
            <hr />
            <p>
              <strong>Créneau disponible à échanger :</strong>
            </p>
            <p>
              <strong>Début :</strong>{" "}
              {new Date(request.availableSlots[0].startTime).toLocaleString()}
            </p>
            <p>
              <strong>Fin :</strong>{" "}
              {new Date(request.availableSlots[0].endTime).toLocaleString()}
            </p>

            <hr />
            <p>
              <strong>Choisissez l'un de vos shifts pour l'échange :</strong>
            </p>
            <Select
              value={selectedShift ? selectedShift._id : ""}
              onChange={(e) => {
                const chosenShift = agentShifts.find(
                  (slot) => slot._id === e.target.value
                );
                setSelectedShift(chosenShift);
                setStartTime(""); // Reset startTime et endTime
                setEndTime("");
              }}
            >
              <MenuItem value="" disabled>
                Choisissez un shift
              </MenuItem>
              {[...agentShifts]
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) // Trie du plus proche au plus lointain
                .map((slot) => (
                  <MenuItem key={slot._id} value={slot._id}>
                    {new Date(slot.startDate).toLocaleString()} →{" "}
                    {new Date(slot.endDate).toLocaleString()}
                  </MenuItem>
                ))}
            </Select>

            {selectedShift && (
              <>
                <hr />
                <p>
                  <strong>Sélectionnez la partie du shift à échanger :</strong>
                </p>
                <label>Début :</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  min={new Date(selectedShift.startDate)
                    .toISOString()
                    .slice(0, -8)}
                  max={new Date(selectedShift.endDate)
                    .toISOString()
                    .slice(0, -8)}
                />
                <label>Fin :</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  min={
                    startTime ||
                    new Date(selectedShift.startDate).toISOString().slice(0, -8)
                  }
                  max={new Date(selectedShift.endDate)
                    .toISOString()
                    .slice(0, -8)}
                />
              </>
            )}
          </div>
        )}

        {request.requestType === "Urgent Replacement" && (
          <div>
            <hr />
            <p>
              <strong>Shift proposé :</strong>
            </p>
            <p>
              Sélectionnez la période que vous souhaitez accepter <br />
              (tout ou une partie du shift) :
            </p>
            <label>Début :</label>
            <input
              type="datetime-local"
              value={startTime}
              min={new Date(request?.timeSlot?.startTime)
                .toISOString()
                .slice(0, 16)}
              max={new Date(request?.timeSlot?.endTime)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <label>Fin :</label>
            <input
              type="datetime-local"
              value={endTime}
              min={startTime}
              max={new Date(request?.timeSlot?.endTime)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        )}

        {/* Afficher l'erreur si elle existe */}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        {request.requesterId._id === agent._id ? (
          <Button onClick={handleDelete} variant="contained" color="error">
            Supprimer
          </Button>
        ) : (
          <Button
            onClick={handleAccept}
            variant="contained"
            color="primary"
            disabled={
              request.requestType === "Swap" &&
              (!selectedShift || !startTime || !endTime)
            }
          >
            Accepter
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ExchangeModal;
