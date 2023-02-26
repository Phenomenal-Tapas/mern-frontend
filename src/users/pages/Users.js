import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { API_URL } from "../../actions/serverConnection";

const Users = () => {
  // const DUMMY_USERS = [
  //   {
  //     id: "u1",
  //     name: "User",
  //     image:
  //       "https://images.unsplash.com/photo-1673405009507-c961600a48a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDR8RnpvM3p1T0hONnd8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
  //     places: 3,
  //   },
  // ];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState([]);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_URL}users/`);

        const data = await response.json();

        if (!response.ok) {
          let error = data.message;
          throw error;
        }

        setLoadedUsers(data.users);
      } catch (error) {
        console.log("error: ", error);
        setError(error);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const handleError = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={handleError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
