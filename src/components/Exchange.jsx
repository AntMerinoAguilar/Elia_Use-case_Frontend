import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/exchangeStyles.css";
import ModalRequest from "./ExchangeModal";
import { useAgent } from "../context/AgentContext";

const Exchange = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // État pour ouvrir/fermer le modal
  const [selectedRequest, setSelectedRequest] = useState(null); // État pour stocker la demande sélectionnée
  const { agent, loading: agentLoading } = useAgent(); // Récupérer l'agent connecté

  /////////////// 1ère version avec /requests, on reçois toutes les requests et on filtre celles qui nous intéresse
  // Récupérer les demandes depuis le backend
  useEffect(() => {
    if (!agent) return;

    axios
      .get("http://localhost:3000/api/requests", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data); ///// supp

        // Filtrer les requests visibles par l'agent connecté
        const filteredRequests = response.data.filter((request) => {
          if (!agent) return false; // Sécurité si l'agent n'est pas chargé

          // L'agent ne doit pas voir ses propres demandes
          /* if (request.requesterId._id === agent._id) return false; */

          // Afficher les replacements et urgent replacements pour tout le monde
          if (
            request.requestType === "Replacement" ||
            request.requestType === "Urgent Replacement"
          ) {
            return true;
          }

          // Afficher les swaps publics
          if (
            request.requestType === "Swap" &&
            request.targetAgentId === null
          ) {
            return true;
          }

          // Afficher les swaps privés uniquement si l'agent est le targetAgentId
          if (
            request.requestType === "Swap" &&
            (request.targetAgentId?._id === agent._id ||
              request.requesterId?._id === agent._id)
          ) {
            return true;
          }

          return false; // Sinon, ne pas inclure la request
        });

        setRequests(filteredRequests);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des demandes.");
        setLoading(false);
      });
  }, [agent]);

  /////////////// 2ème verion avec /request/me, on reçois que les requests émises par l'agent connecté.
  /* useEffect(() => {
    axios
      .get("http://localhost:3000/api/requests/me", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data); // Debug
        setRequests(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des demandes.");
        setLoading(false);
      });
  }, []); */

  // Ouvrir le modal avec la demande sélectionnée
  const handleOpenModal = (request) => {
    setSelectedRequest(request); // Stocke la demande sélectionnée
    setOpenModal(true); // Ouvre le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRequest(null); // Réinitialiser la demande sélectionnée
  };

  // Fonction pour accepter la demande
  const handleAcceptRequest = async (requestId, selectedSlot) => {
    try {
      const agentId = agent._id; // Récupérer l'ID de l'agent connecté

      // Préparer les données à envoyer
      const requestData = {
        agentId,
        selectedSlot: {
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
      };

      console.log("Données envoyées :", requestData); ////// à supprimer

      // Effectuer l'appel API pour accepter la demande
      const response = await axios.put(
        `http://localhost:3000/api/requests/${requestId}/accept`,
        requestData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== requestId)
        ); // Supprimer la demande acceptée de la liste
      } else {
        // Si le backend retourne une erreur, on l'affiche à l'utilisateur
        setError(response.data.error || "Erreur inconnue");
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande", error);

      // Afficher plus de détails sur l'erreur retournée
      if (error.response && error.response.data) {
        // Si l'erreur contient des informations supplémentaires du backend
        setError(
          error.response.data.error ||
            "Une erreur est survenue lors de l'acceptation de la demande."
        );
      } else {
        // Si l'erreur est générique ou vient d'un autre endroit
        setError(
          "Une erreur est survenue lors de l'acceptation de la demande."
        );
      }
    }
  };

  // Gestion du chargement des infos de l'agent
  if (agentLoading) return <p>Chargement des informations de l'agent...</p>;

  return (
    <div className="exchange-container">
      <h2>Demandes</h2>

      {/* Gestion des erreurs */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Affichage du chargement */}
      {loading ? (
        <p>Chargement des demandes...</p>
      ) : (
        <div className="cards-container">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className="request-card"
                onClick={() => handleOpenModal(request)} // Ouvrir le modal au clic
              >
                <h3>{request.type}</h3>
                <p className="requester-name">
                  {request.requesterId.name} {request.requesterId.surname}
                </p>
                <p>{request.requestType} :</p>
                <p className="time-slot">
                  {new Date(request.timeSlot.startTime).toLocaleString()} →{" "}
                  {new Date(request.timeSlot.endTime).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>Aucune demande trouvée.</p>
          )}
        </div>
      )}

      {/* Afficher le modal si openModal est vrai */}
      {selectedRequest && (
        <ModalRequest
          open={openModal}
          onClose={handleCloseModal}
          request={selectedRequest}
          onAccept={handleAcceptRequest}
        />
      )}
    </div>
  );
};

export default Exchange;
