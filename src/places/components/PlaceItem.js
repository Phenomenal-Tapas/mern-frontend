import React, { useContext, useState } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UI/Card";
import Modal from "../../shared/components/UI/Modal";
import Map from "../../shared/components/UI/Maps";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import "../../styles/PlaceItem.css";
import { API_URL } from "../../actions/serverConnection";
import { ASSET_URL } from "../../actions/serverConnection";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleOpenMap = () => {
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  const handleShowDeleteWarning = () => {
    setShowConfirmModal(true);
  };

  const handleCancelDeleteModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmDeleteModal = async () => {
    try {
      setShowConfirmModal(false);

      setIsLoading(true);
      await fetch(`${API_URL}places/${props.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setIsLoading(false);
      props.onDelete(props.id);
    } catch (error) {
      console.log("error: ", error);
      setIsLoading(false);
      setError(error);
    }
  };

  const handleError = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={handleError} />
      <Modal
        show={showMap}
        onCancel={handleCloseMap}
        header={props.address}
        footer={<Button onClick={handleCloseMap}>Close</Button>}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={handleCancelDeleteModal}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={handleCancelDeleteModal}>
              CANCEL
            </Button>
            <Button danger onClick={handleConfirmDeleteModal}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this place?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${ASSET_URL}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button onClick={handleOpenMap} inverse>
              View On Map
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={handleShowDeleteWarning}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
