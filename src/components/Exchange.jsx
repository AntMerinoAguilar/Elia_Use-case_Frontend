import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/exchangeStyles.css";
import ModalRequest from "./ExchangeModal";
import { useAgent } from "../context/AgentContext";
import { X } from "lucide-react";
import { API_URL } from "../config/api.config";
import ConfirmModal from "./ui/ConfirmModal";

const Exchange = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { agent, loading: agentLoading } = useAgent();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Récupérer toutes les demandes depuis le backend et filtrer pour montrer à l'agent connecté
  useEffect(() => {
    if (!agent) return;

    axios
      .get(`${API_URL}/requests`, {
        withCredentials: true,
      })
      .then((response) => {
        const filteredRequests = response.data.filter((request) => {
          const isRequester = request.requesterId?._id === agent._id;
          const isTarget = request.targetAgentId?._id === agent._id;

          // Filtrer les requests visibles par l'agent connecté
          return (
            request.requestType === "Replacement" || // Remplacement (tous les agents)
            request.requestType === "Urgent Replacement" || // Remplacement urgent (tous)
            (request.requestType === "Swap" && !request.targetAgentId) || // Swap public
            (request.requestType === "Swap" && (isTarget || isRequester)) // Swap privé (destinataire ou créateur)
          );
        });

        setRequests(filteredRequests);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des demandes :", err);
        setError("Erreur lors du chargement des demandes.");
        setLoading(false);
      });
  }, [agent]);

  // Fonction pour ouvrir le modal de la request
  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setOpenModal(true);
  };

  // Fonction pour fermer le modal de la request
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRequest(null);
  };

  // Fonction pour ouvrir le modal de confirmation
  const handleOpenConfirmModal = (requestId) => {
    setRequestToDelete(requestId);
    setConfirmDelete(true);
  };

  // Fonction pour fermer le modal de confirmation
  const handleCloseConfirmModal = () => {
    setRequestToDelete(null);
    setConfirmDelete(false);
  };

  // Fonction pour accepter la demande
  const handleAcceptRequest = async (requestId, selectedSlot) => {
    try {
      const agentId = agent._id; // Récupérer l'ID de l'agent connecté grâce à l'AgentProvider dans l'AgentContext

      // Préparer les données à envoyer
      const requestData = {
        agentId,
        selectedSlot: {
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
      };

      // Effectuer l'appel API pour accepter la demande
      const response = await axios.put(
        `${API_URL}/requests/${requestId}/accept`,
        requestData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setRequests(
          (prevRequests) => prevRequests.filter((req) => req._id !== requestId) // Supprimer la demande acceptée de la liste
        );
      } else {
        setError(response.data.error || "Erreur inconnue");
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande", error);

      // Affiche plus de détails sur l'erreur retournée
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

  const handleDeleteRequest = (requestId) => {
    setRequestToDelete(requestId);
    setConfirmDelete(true);
  };

  const confirmDeleteRequest = async () => {
    if (!requestToDelete) return;

    try {
      await axios.delete(`${API_URL}/requests/${requestToDelete}/cancel`, {
        withCredentials: true,
      });

      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestToDelete)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de la demande", error);
      setError("Impossible de supprimer la demande.");
    }

    handleCloseConfirmModal(); // Fermer le modal après suppression
  };

  if (agentLoading) return <p>Chargement des informations de l'agent...</p>;

  return (
    <div className="exchange-container">
      <h2 className="exchange-title">Demandes</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Chargement des demandes...</p>
      ) : (
        <div className="cards-container">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className="request-card"
                onClick={() => handleOpenModal(request)}
              >
                <p className="requester-name">
                  {request.requesterId.name} {request.requesterId.surname}
                </p>
                <p className="request-type">{request.requestType} :</p>
                <p className="time-slot">
                  {new Date(request.timeSlot.startTime).toLocaleString()} →{" "}
                  {new Date(request.timeSlot.endTime).toLocaleString()}
                </p>

                {/* Bouton de suppression uniquement pour l'agent qui a créé la request */}
                {request.requesterId._id === agent._id && (
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRequest(request._id);
                    }}
                  >
                    <X size={30} />
                  </button>
                )}
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
          setRequests={setRequests}
          onAccept={handleAcceptRequest}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          isOpen={confirmDelete}
          onClose={handleCloseConfirmModal}
          onConfirm={confirmDeleteRequest}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer cette demande ?"
        />
      )}
    </div>
  );
};

export default Exchange;
