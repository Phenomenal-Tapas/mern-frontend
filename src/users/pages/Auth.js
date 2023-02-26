import React, { useContext, useState } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Card from "../../shared/components/UI/Card";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/helpers/validators";
import "../../styles/Auth.css";
import { API_URL } from "../../actions/serverConnection";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, handleInputChange, setFormData] = useForm({
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  });

  const handleSwitchMode = () => {
    if (!isLoggedIn) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoggedIn((prevMode) => !prevMode);
  };

  const handleAuthSubmit = async (event) => {
    try {
      event.preventDefault();

      setIsLoading(true);
      if (isLoggedIn) {
        const response = await fetch(`${API_URL}users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          let error = data.message;
          throw error;
        }

        setIsLoading(false);
        auth.login(data.user._id, data.token);
      } else {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const response = await fetch(`${API_URL}users/signup`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          let error = data.message;
          throw error;
        }

        setIsLoading(false);
        auth.login(data.user._id, data.token);
      }
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
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login to add place</h2>
        <hr />
        <form onSubmit={handleAuthSubmit}>
          {!isLoggedIn && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              minLength={3}
              maxLength={35}
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
              errorText="Please enter a name."
              onInput={handleInputChange}
            />
          )}
          {!isLoggedIn && (
            <ImageUpload id="image" onInput={handleInputChange} />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            minLength={8}
            maxLength={35}
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={handleInputChange}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            minLength={8}
            maxLength={20}
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter a valid password (atleast 8 character)."
            onInput={handleInputChange}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoggedIn ? "Login" : "Signup"}
          </Button>
        </form>
        <Button inverse onClick={handleSwitchMode}>
          Switch to {isLoggedIn ? "signup" : "login"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
