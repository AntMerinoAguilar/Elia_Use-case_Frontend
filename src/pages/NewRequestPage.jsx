import React from "react";
import Navigation from "../components/Navigation";
import NewRequestForm from "../components/NewRequestForm";

const NewRequestPage = () => {
  return (
    <div className="container">
      <Navigation />
      <NewRequestForm />
    </div>
  );
};

export default NewRequestPage;
