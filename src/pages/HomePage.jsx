import React from "react";
import Navigation from "../components/Navigation";
import Calendar from "../components/Calendar";
import UnavailabilitiesNav from "../components/UnavailabilitiesNav";

const HomePage = () => {
  return (
    <>
      <Navigation />
      <h1>Home Page</h1>
      <Calendar />
      <UnavailabilitiesNav />
    </>
  );
};

export default HomePage;
