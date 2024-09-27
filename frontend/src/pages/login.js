// src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:9200/api/login', {
                email,
                password,
            });

            const { token, user } = response.data; // Assurez-vous que 'user' est renvoyé par votre API
            console.log('Réponse de l\'API:', response.data);

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', user.id); // Stockez l'ID de l'utilisateur
                setSuccessMessage('Connexion réussie!');

                navigate('/dashboard'); // Utilisez navigate pour rediriger vers le tableau de bord
            }

        } catch (error) {
            console.error('Erreur de connexion', error);
            setError('Erreur de connexion. Vérifiez vos informations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-cover bg-center h-screen" style={{ backgroundImage: `url('/imagedefond.jpg')` }}>
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                <div>
                    <label className="block text-gray-700">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 bg-blue-900 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    {loading ? 'Connexion en cours...' : 'Login'}
                </button>
            </form>
            <h3 className="mt-6 text-lg text-white">Pas de compte?</h3>
            <NavLink to={'/register'}>
                <button className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg">Inscription</button>
            </NavLink>
        </div>
    );
}

export default Login;
