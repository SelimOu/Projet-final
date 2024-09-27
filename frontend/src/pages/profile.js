import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../componants/header';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        numero: '',
        price: '',
        goal: '',
        image: null,
    });
    const [schedules, setSchedules] = useState({
        day_start: '',
        day_end: '',
        hour_start: '',
        hour_end: ''
    });
    const [isCoach, setIsCoach] = useState(false);
    const [userId, setUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [numeroError, setNumeroError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Vous devez vous connecter pour accéder à cette page.');
                navigate('/login');
                return;
            }

            try {
                const storedUserId = localStorage.getItem('userId');
                if (!storedUserId) {
                    alert("L'ID utilisateur est introuvable.");
                    return;
                }

                setUserId(storedUserId);

                const response = await axios.get(`http://localhost:9200/api/users/${storedUserId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const user = response.data;
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    password: '',
                    numero: user.numero || '',
                    price: user.price || '',
                    goal: user.goal || '',
                    image: null,
                });
                setIsCoach(user.role === 'coach');

                if (user.role === 'coach') {
                    await fetchSchedules(storedUserId, token);
                }

            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur:', error);
                if (error.response && error.response.status === 401) {
                    alert('Vous devez vous connecter pour accéder à cette page.');
                    navigate('/login');
                }
            }
        };

        const fetchSchedules = async (userId, token) => {
            try {
                const scheduleResponse = await axios.get(`http://localhost:9200/api/schedules/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const scheduleData = scheduleResponse.data;

                if (scheduleData && scheduleData.length > 0) {
                    const schedule = scheduleData[0];
                    setSchedules({
                        day_start: schedule.day_start || '',
                        day_end: schedule.day_end || '',
                        hour_start: schedule.hour_start || '',
                        hour_end: schedule.hour_end || '',
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des horaires:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const validateNumero = (numero) => {
        const numeroRegex = /^0[0-9]{9}$/;
        return numeroRegex.test(numero);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.numero || !validateNumero(formData.numero)) {
            setNumeroError("Le numéro de téléphone doit contenir exactement 10 chiffres et commencer par 0.");
            return;
        } else {
            setNumeroError('');
        }

        if (formData.password && formData.password.length < 8) {
            setErrorMessage('Le champ mot de passe doit contenir au moins 8 caractères.');
            return;
        } else {
            setErrorMessage('');
        }

        const dataToSend = {
            role: isCoach ? 'coach' : 'client',
            name: formData.name,
            email: formData.email,
            numero: formData.numero,
            goal: formData.goal,
            price: formData.price,
            image: formData.image
        };

        if (formData.password) {
            dataToSend.password = formData.password;
        }

        if (isCoach) {
            dataToSend.schedules = {
                day_start: schedules.day_start,
                day_end: schedules.day_end,
                hour_start: schedules.hour_start,
                hour_end: schedules.hour_end,
            };
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:9200/api/users/${userId}?_method=PUT`, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                },
            });

            alert('Profil mis à jour avec succès !');
            navigate('/dashboard');

            console.log('Réponse du serveur:', response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Mise à jour du profil échouée', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Une erreur est survenue lors de la mise à jour du profil.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleScheduleChange = (e) => {
        const { name, value } = e.target;
        setSchedules({ ...schedules, [name]: value });
    };

    return (
        <>
            <Header />

            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white shadow-md rounded-lg p-8 m-14"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Profil</h2>

                    {errorMessage && (
                        <div className="mb-4 text-red-500">
                            {errorMessage}
                        </div>
                    )}

                    {numeroError && (
                        <div className="mb-4 text-red-500">
                            {numeroError}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="name">Nom :</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="email">Email :</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="password">Mot de passe :</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Laissez vide si vous ne voulez pas changer le mot de passe"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="numero">Numéro de téléphone :</label>
                        <input
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                    </div>

                    {isCoach && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="goal">Spécialité :</label>
                                <select
                                    name="goal"
                                    value={formData.goal}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                >
                                    <option value="">Sélectionnez une spécialité</option>
                                    <option value="musculation">Musculation</option>
                                    <option value="fitness">Fitness</option>
                                    <option value="nutrition">Nutrition</option>
                                    <option value="running">Running</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="price">Prix par séance :</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="day_start">Jour de début :</label>
                                <input
                                    type="text"
                                    name="day_start"
                                    value={schedules.day_start}
                                    onChange={handleScheduleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="day_end">Jour de fin :</label>
                                <input
                                    type="text"
                                    name="day_end"
                                    value={schedules.day_end}
                                    onChange={handleScheduleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="hour_start">Heure de début :</label>
                                <input
                                    type="text"
                                    name="hour_start"
                                    value={schedules.hour_start}
                                    onChange={handleScheduleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="hour_end">Heure de fin :</label>
                                <input
                                    type="text"
                                    name="hour_end"
                                    value={schedules.hour_end}
                                    onChange={handleScheduleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>
                        </>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="image">Image de profil :</label>
                        <input
                            type="file"
                            name="image"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                    </div>


                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Profile;
