import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VisitorForm from './pages/VisitorForm';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import MemberLogin from './pages/MemberLogin';
import CreateUser from './pages/CreateUser';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './i18n'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/visitor" element={<VisitorForm />} />
        <Route path="/member" element={<MemberLogin />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
