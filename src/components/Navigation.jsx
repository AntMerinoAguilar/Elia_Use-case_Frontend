import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo Elia.png';
import calendar from '../assets/calendrier2.png';
import notif from '../assets/notifications lu.png';
import unreadnotif from '../assets/notifications non lu.png';
import newrequest from '../assets/requests non lu.png';
import request from '../assets/requests lu.png';
import profile from '../assets/utilisateur.png'
import '../styles/Navigation.css'

const Navigation = () => {
  return (
    <nav className="navbar">
      
      <div className="home">
        <img src={logo} alt="" className="logo-nav" />
        <Link to="/calendar"><img src={calendar} alt="" className="home-icon"/></Link>
        </div>
      <ul className="navlinks">
        <li className="navlink requests">
          <Link to="/exchange"><img src={request} alt="" /></Link>
        </li>
        <li className="navlink notifications">
          <Link to="/notifications"><img src={notif} alt="" /></Link>
        </li>
        <li className="navlink profile">
          <Link to="/profile"><img src={profile} alt="" /></Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
