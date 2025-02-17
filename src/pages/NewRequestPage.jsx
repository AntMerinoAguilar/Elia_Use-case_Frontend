import React from "react";
import Navigation from "../components/Navigation";
import NewRequestForm from "../components/NewRequestForm";

const NewRequestPage = () => {
  return (
    <div className="container">
      <Navigation />
      <h1>New Request Page</h1>
      <NewRequestForm />
    </div>
  );
};

export default NewRequestPage;
