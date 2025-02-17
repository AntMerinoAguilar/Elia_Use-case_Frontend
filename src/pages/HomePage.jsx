import React from "react";
import Navigation from "../components/Navigation";
import MyCalendar from "../components/Calendar";
import AddButton from "../components/AddButton";

const HomePage = () => {
  return (
    <div className="container">
      <Navigation />
      <MyCalendar />
      <AddButton />
    </div>
  );
};

export default HomePage;
