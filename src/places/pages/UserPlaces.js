import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { API_URL } from "../../actions/serverConnection";

// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Arthur Ravenel Jr. Bridge, Charleston, United States",
//     imageUrl:
//       "https://images.unsplash.com/photo-1512187849-463fdb898f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YnJpZGdlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
//     description:
//       "This is one of my favorite architectural structures in Charleston, SC.",
//     address: "South Carolina, USA",
//     location: {
//       lat: 32.8039122,
//       lng: -79.9228585,
//     },
//     creator: "u1",
//   },
// ];

const UserPlaces = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  const userId = useParams().userId;

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_URL}places/user/${userId}`);

        const data = await response.json();

        if (!response.ok) {
          let error = data.message;
          throw error;
        }

        setLoadedPlaces(data.places);
      } catch (error) {
        console.log("error: ", error);
        setError(error);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, [userId]);

  const handleError = () => {
    setError(null);
  };

  const handleDeletePlace = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place._id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={handleError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={handleDeletePlace} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
