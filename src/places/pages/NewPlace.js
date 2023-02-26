import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/helpers/validators";
import "../../styles/PlaceForm.css";
import { API_URL } from "../../actions/serverConnection";

const NewPlace = () => {
  const auth = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, handleInputChange] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
      address: { value: "", isValid: false },
      image: { value: null, isValid: false },
    },
    false
  );

  const navigate = useNavigate();

  const handlePlaceSubmit = async (event) => {
    try {
      event.preventDefault();

      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);

      const response = await fetch(`${API_URL}places/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        let error = data.message;
        throw error;
      }

      setIsLoading(false);
      navigate("/");
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
      <form className="place-form" onSubmit={handlePlaceSubmit}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          minLength={3}
          maxLength={200}
          validators={[VALIDATOR_REQUIRE()]}
          onInput={handleInputChange}
          errorText="Please enter a valid title."
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={handleInputChange}
          errorText="Please enter a valid description (atleast 5 character)."
        />
        <Input
          id="address"
          element="input"
          label="Address"
          minLength={3}
          maxLength={250}
          validators={[VALIDATOR_REQUIRE()]}
          onInput={handleInputChange}
          errorText="Please enter a valid address."
        />
        <ImageUpload id="image" onInput={handleInputChange} />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
