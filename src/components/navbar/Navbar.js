import { NavLink } from 'react-router-dom';
import BtnDarkMode from '../btnDarkMode/BtnDarkMode';
import './style.css';

const Navbar = () => {
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
            <li className="nav-list__item">
              <NavLink
                to="/projects"
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
              >
                Projects
              </NavLink>
            </li>

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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;