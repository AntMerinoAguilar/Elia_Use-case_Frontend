import React from "react";
import Navigation from "../components/Navigation";
import MyCalendar from "../components/Calendar";
import AddButton from "../components/AddButton";

const HomePage = () => {
  return (
    <>
      <Navigation />
      <h1>Home Page</h1>
      <MyCalendar />
      <AddButton />
    </>
  );
};

export default HomePage;
