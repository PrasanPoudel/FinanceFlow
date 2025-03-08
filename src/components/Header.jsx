import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaTags, FaCog, FaBars } from 'react-icons/fa';
import { TbReportMoney } from "react-icons/tb";
import './Styles/Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
      <h1><TbReportMoney/> FinanceFlow</h1>
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        <FaBars />
      </button>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <FaHome /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/add-expense" onClick={() => setMenuOpen(false)}>
              <FaPlus /> Add Expense
            </Link>
          </li>
          <li>
            <Link to="/categories" onClick={() => setMenuOpen(false)}>
              <FaTags /> Categories
            </Link>
          </li>
          <li>
            <Link to="/settings" onClick={() => setMenuOpen(false)}>
              <FaCog /> Settings
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;