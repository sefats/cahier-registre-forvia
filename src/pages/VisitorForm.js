import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./VisitorForm.css";
import { useTranslation } from "react-i18next";

const VisitorForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    firstname: "",
    email: "",
    phone: "",
    entreprise: "",
    contactPerson: "",
    startTime: "",
    endTime: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // État pour gérer le bouton de soumission
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Désactiver le bouton lors de l'envoi
    try {
      const response = await fetch("http://localhost:5000/api/visitors/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/");
        }, 2000);
      } else {
        console.error("Failed to add visitor");
        setIsSubmitting(false); // Réactiver le bouton si l'ajout échoue
      }
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false); // Réactiver le bouton en cas d'erreur
    }
  };

  return (
    <div className="visitor-form-container">
      <Navbar />
      <div className="nav-divider"></div>
      <form className="visitor-form" onSubmit={handleSubmit}>
        <h2>{t("visitor_registration")}</h2>
        <div className="form-group">
          <label>{t("name")}</label>
          <input
            type="text"
            name="name"
            placeholder={t("name")}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("firstname")}</label>
          <input
            type="text"
            name="firstname"
            placeholder={t("firstname")}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("email")}</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("phone")}</label>
          <input
            type="text"
            name="phone"
            placeholder={t("phone")}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("company")}</label>
          <input
            type="text"
            name="entreprise"
            placeholder={t("company")}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("contact_person")}</label>
          <input
            type="text"
            name="contactPerson"
            placeholder={t("contact_person")}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("start_time")}</label>
          <input
            type="datetime-local"
            name="startTime"
            placeholder={t("start_time")}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("end_time")}</label>
          <input
            type="datetime-local"
            name="endTime"
            placeholder={t("end_time")}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {t("save_visit")}
        </button>
      </form>
      {showPopup && (
        <div className="popup">
          <p>{t("success_message")}</p>
        </div>
      )}
    </div>
  );
};

export default VisitorForm;
