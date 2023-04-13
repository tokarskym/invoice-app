import Avatar from '../../Images/image-avatar.jpg';
import MoonIcon from '../../Images/icon-moon.svg';
import Logo from '../../Images/logo.svg';
import SunIcon from '../../Images/icon-sun.svg';
import { useContext } from 'react';
import { ThemeContext } from '../../Context/Theme';

export default function Navbar() {
  const [{ isDarkMode }, toggleTheme] = useContext(ThemeContext);
  return (
    <nav className="navigation-bar">
      <div className="navigation-bar__logo">
        <img className="navigation-bar__logo-img" src={Logo} alt="Invoice App Logo" />
        <div className="navigation-bar__logo-bottom"></div>
      </div>
      <div className="navigation-bar__button">
        <button className="navigation-bar__button-switch" onClick={toggleTheme}>
          <img src={isDarkMode ? SunIcon : MoonIcon} alt={isDarkMode ? 'Moon Icon' : 'Sun Icon'} />
        </button>
        <div className="navigation-bar__avatar">
          <img className="navigation-bar__avatar-img" src={Avatar} alt="" />
        </div>
      </div>
    </nav>
  );
}
