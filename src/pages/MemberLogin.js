import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./MemberLogin.css";
import { useTranslation } from "react-i18next";

const MemberLogin = () => {
  const [email, setEmail] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/ldap/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserDetails(data.entries[0]);
      } else {
        console.error("Search failed", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const memberData = {
      sn: formData.get("sn"),
      givenName: formData.get("givenName"),
      phone: formData.get("phone"),
      mail: formData.get("mail"),
      title: formData.get("title"),
      office: formData.get("office"),
      contactPerson: formData.get("contactPerson"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    };

    try {
      const response = await fetch("http://localhost:5000/api/members/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });
      if (response.ok) {
        console.log("Member visit added successfully");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/");
        }, 2000);
      } else {
        console.error("Failed to add member visit");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="member-login-container">
      <Navbar />
      <div className="nav-divider"></div>
      <main className="member-form-content">
        <form className="member-search-form" onSubmit={handleSearch}>
          <h2> {t("search_member")}</h2>
          <div className="member-form-group">
            <label>{t("adresse-email")}</label>
            <input
              type="email"
              name="email"
              placeholder={t("adresse-email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="member-search-button">
          {t("search")}
          </button>
        </form>
        {userDetails && (
          <form className="member-details-form" onSubmit={handleSubmit}>
            <div className="member-form-group">
              <label>{t("name")} </label>
              <input type="text" name="sn" value={userDetails.sn} readOnly />
            </div>
            <div className="member-form-group">
              <label>{t("firstname")}</label>
              <input
                type="text"
                name="givenName"
                value={userDetails.givenName}
                readOnly
              />
            </div>
            <div className="member-form-group">
              <label>{t("phone")}</label>
              <input
                type="text"
                name="phone"
                value={userDetails.mobile}
                readOnly
              />
            </div>
            <div className="member-form-group">
              <label>Email</label>
              <input
                type="email"
                name="mail"
                value={userDetails.mail}
                readOnly
              />
            </div>
            <div className="member-form-group">
              <label>{t("poste")}</label>
              <input
                type="text"
                name="title"
                value={userDetails.description}
                readOnly
              />
            </div>
            <div className="member-form-group">
              <label>{t("office")}</label>
              <input
                type="text"
                name="office"
                value={userDetails.physicalDeliveryOfficeName}
                readOnly
              />
            </div>
            <div className="member-form-group">
              <label>{t("contact_person")}</label>
              <input type="text" name="contactPerson" required />
            </div>
            <div className="member-form-group">
              <label>{t("start_time")}</label>
              <input type="datetime-local" name="startTime" required />
            </div>
            <div className="member-form-group">
              <label>{t("end_time")}</label>
              <input type="datetime-local" name="endTime" required />
            </div>
            <button type="submit" className="member-submit-button">
            {t("save_visit")}
            </button>
          </form>
        )}
      </main>
      {showPopup && (
        <div className="member-popup">
          <p>{t("success_membre")}</p>
        </div>
      )}
    </div>
  );
};

export default MemberLogin;
