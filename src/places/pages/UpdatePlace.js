import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UI/Card";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/helpers/validators";
import "../../styles/PlaceForm.css";
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

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedPlace, setLoadedPlace] = useState([]);

  const placeId = useParams().placeId;
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [formState, handleInputChange, setFormData] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    false
  );

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_URL}places/${placeId}`);

        const data = await response.json();

        if (!response.ok) {
          let error = data.message;
          throw error;
        }

        setLoadedPlace(data.place);
        setFormData(
          {
            title: { value: data.place.title, isValid: true },
            description: { value: data.place.description, isValid: true },
          },
          true
        );
      } catch (error) {
        console.log("error: ", error);
        setError(error);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, [placeId, setFormData]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!!</h2>
        </Card>
      </div>
    );
  }

  const handleUpdatePlaceSubmit = async (event) => {
    try {
      event.preventDefault();

      setIsLoading(true);
      const response = await fetch(`${API_URL}places/${placeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let error = data.message;
        throw error;
      }

      setIsLoading(false);
      navigate(`/${auth.userId}/places`);
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
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={handleUpdatePlaceSubmit}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            minLength={3}
            maxLength={200}
            validators={[VALIDATOR_REQUIRE()]}
            onInput={handleInputChange}
            initialValue={formState.inputs.title.value}
            initialIsValid={formState.inputs.title.isValid}
            errorText="Please enter a valid title."
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={handleInputChange}
            initialValue={formState.inputs.description.value}
            initialIsValid={formState.inputs.description.isValid}
            errorText="Please enter a valid description (atLeast 5 character)."
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
