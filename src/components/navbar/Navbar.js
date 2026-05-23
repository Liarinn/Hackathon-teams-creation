import { NavLink, useNavigate } from 'react-router-dom';
import BtnDarkMode from '../btnDarkMode/BtnDarkMode';
import './style.css';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    
    setIsLoggedIn(!!token);
    setRole(savedRole);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
    navigate('/'); // Redirect to home after logout
  };

  const activeLink = 'nav-list__link nav-list__link--active';
  const normalLink = 'nav-list__link';

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-row">
          <NavLink to="/" className="logo">
            <strong>ABCName</strong> project
          </NavLink>

          <BtnDarkMode />

          <ul className="nav-list">
            {isLoggedIn ? (
              <>
                {/* Always show Dashboard when logged in */}
                <li className="nav-list__item">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    Dashboard
                  </NavLink>
                </li>

                {/* Role-specific link */}
                {role === 'organiser' ? (
                  <li className="nav-list__item">
                    <NavLink
                      to="/projects"
                      className={({ isActive }) => (isActive ? activeLink : normalLink)}
                    >
                      My Projects
                    </NavLink>
                  </li>
                ) : (
                  <li className="nav-list__item">
                    <NavLink
                      to="/my-applications"
                      className={({ isActive }) => (isActive ? activeLink : normalLink)}
                    >
                      My Applications
                    </NavLink>
                  </li>
                )}

                {/* Profile - only for participants */}
                {role === 'participant' && (
                  <li className="nav-list__item">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) => (isActive ? activeLink : normalLink)}
                    >
                      Profile
                    </NavLink>
                  </li>
                )}

                <li className="nav-list__item">
                  <button 
                    onClick={handleLogout} 
                    className="nav-list__link logout-btn"
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              /* Not logged in - only Login and Sign Up */
              <>
                <li className="nav-list__item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    Log In
                  </NavLink>
                </li>
                <li className="nav-list__item">
                  <NavLink
                    to="/signup"
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;