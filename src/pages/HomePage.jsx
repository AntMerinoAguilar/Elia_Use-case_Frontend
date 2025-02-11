import React from "react";
import Navigation from "../components/Navigation";
import Calendar from "../components/Calendar";
import AddButton from "../components/AddButton";

const HomePage = () => {
  return (
    <>
      <Navigation />
      <h1>Home Page</h1>
      <Calendar />
      <AddButton />
    </>
  );
};

export default HomePage;
