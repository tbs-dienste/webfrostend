import React from 'react';
import './Sidebar.scss';
import { FaPrint, FaChartBar, FaUsers, FaFileAlt, FaTachometerAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/drucker', icon: <FaPrint />, label: 'Drucker' },
    { path: '/transaktionen', icon: <FaFileAlt />, label: 'Transaktionen' },
    { path: '/berichte', icon: <FaChartBar />, label: 'Berichte' },
    { path: '/benutzereinstellungen', icon: <FaUsers />, label: 'Benutzereinstellungen' },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar always-open">
        <nav className="sidebar-content">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className={location.pathname === item.path ? 'active' : ''}>
                <Link to={item.path}>
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
