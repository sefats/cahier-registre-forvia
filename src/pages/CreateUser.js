import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./CreateUser.css";
import { useTranslation } from "react-i18next";

const CreateUser = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchUsers();
        setFormData({
          username: "",
          password: "",
        });
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    setSelectedUser(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/user/${selectedUser}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchUsers();
        setShowDeletePopup(false);
        setSelectedUser(null);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdatePassword = async (id) => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/user/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
          }
        );
        if (response.ok) {
          fetchUsers();
        } else {
          console.error("Failed to update password");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="create-user-container">
      <Navbar />
      <div className="nav-divider"></div>
      <main className="form-content">
        <form className="create-user-form" onSubmit={handleSubmit}>
          <h2>{t("create_user")}</h2>
          <div className="form-group">
            <label>{t("username")}</label>
            <input
              type="text"
              name="username"
              placeholder={t("username")}
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("password")}</label>
            <input
              type="password"
              name="password"
              placeholder={t("password")}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {t("create_user")}
          </button>
        </form>
      </main>
      <div className="users-list">
        <h2>{t("users_list")}</h2>
        <table>
          <thead>
            <tr>
              <th>{t("username")}</th>
              <th>{t("role")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleUpdatePassword(user.id)}>
                    {t("update_password")}
                  </button>
                  <button onClick={() => handleDelete(user.id)}>
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDeletePopup && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>{t("confirm_delete")}</p>
            <button onClick={confirmDelete}>{t("yes")}</button>
            <button onClick={() => setShowDeletePopup(false)}>{t("no")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
