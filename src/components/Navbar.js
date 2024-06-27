import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import logo from '../images/forvia-logo.png';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const { t } = useTranslation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <header className="header">
            <div className="navbar-left">
                {isLoggedIn ? (
                    <>
                        <button className="logout-button" onClick={handleLogout}>{t('logout')}</button>
                        {userRole === 'admin' && (
                            <button className="admin-button" onClick={() => navigate('/admin')}>Admin</button>
                        )}
                        {userRole === 'admin' && (
                            <Link to="/create-user">
                                <button className="login-button">{t('add_user')}</button>
                            </Link>
                        )}
                    </>
                ) : (
                    <Link to="/login">
                        <button className="login-button">{t('login')}</button>
                    </Link>
                )}
            </div>
            <img src={logo} alt="Forvia Logo" className="logo" onClick={() => navigate('/')} />
            <LanguageSelector />
        </header>
    );
};

export default Navbar;
