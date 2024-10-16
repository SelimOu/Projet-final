import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import MentionsLegales from './pages/mentionsLegale';
import axios from 'axios';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // Intercepteur pour gérer les erreurs 401 globalement
    const axiosInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Si erreur 401, c'est-à-dire que la session a expiré
          localStorage.removeItem('token'); // Supprimer le token
          setSessionExpired(true); // Activer l'état de session expirée
          navigate('/login'); // Rediriger vers la page de login
        }
        return Promise.reject(error);
      }
    );

    // Nettoyage de l'intercepteur lors du démontage du composant
    return () => {
      axios.interceptors.response.eject(axiosInterceptor);
    };
  }, [navigate]);

  useEffect(() => {
    // Gestion des ancres (scroll to section)
    if (location.state?.scrollToAbout) {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }

    if (location.state?.scrollToContact) {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      {sessionExpired && (
        <div style={{ color: 'red', textAlign: 'center' }}>
          Votre session a expiré. Veuillez vous reconnecter.
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/legals" element={<MentionsLegales />} />

        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
