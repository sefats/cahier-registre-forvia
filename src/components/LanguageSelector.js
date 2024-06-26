import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setMenuOpen(false);
  };

  return (
    <div className="language-section">
      <div className="location-text">Allenjoie</div>
      <div className="language-selector" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="selected-language">
          {i18n.language.toUpperCase()}
          <span className={`arrow ${menuOpen ? 'open' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 -3 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
        {menuOpen && (
          <ul className="dropdown-menu">
            <li onClick={() => changeLanguage('en')}>English</li>
            <li onClick={() => changeLanguage('fr')}>Français</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
