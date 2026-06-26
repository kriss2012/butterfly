import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">DvBotanicals</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Garden Zones</a></li>
          <li><a href="#">Flowers</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
