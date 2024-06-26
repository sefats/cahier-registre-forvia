import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';


const HomePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="home-container">
            <Navbar />
            <div className="nav-divider"></div>
            <main className="main-content">
                <div className="section visitor-section">
                    <h2>{t('visitor')} ?</h2>
                    <p>{t('sidentifier')} :</p>
                    <button className="visitor-button" onClick={() => navigate('/visitor')}>{t('visitor')}</button>
                </div>
                <div className="divider"></div>
                <div className="section member-section">
                    <h2>{t('member')} Forvia ?</h2>
                    <p>{t('sidentifier')} :</p>
                    <button className="member-button" onClick={() => navigate('/member')}>{t('member')}</button>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
