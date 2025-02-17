import React from "react";
import Navigation from "../components/Navigation";
import ProfileInfo from "../components/ProfileInfo";

const ProfilePage = () => {
  return (
    <div className="container">
      <Navigation />
      <h1>Profil Page</h1>
      <ProfileInfo />
    </div>
  );
};

export default ProfilePage;
