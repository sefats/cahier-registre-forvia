import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./CreateUser.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://fraljapp0002:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Affiche le message de succès
        navigate("/admin"); // Redirige vers la page admin après l'inscription réussie
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="create-user-container">
      <Navbar />
      <div className="nav-divider"></div>
      <main className="form-content">
        <form className="create-user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("username")}</label>
            <input
              type="text"
              name="username"
              placeholder={t("username")}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>{t("password")}</label>
            <input
              type="password"
              name="password"
              placeholder={t("password")}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-button">
            {t("create_user")}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateUser;
