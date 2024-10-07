import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../componants/header';
import Footer from '../componants/footer';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        numero: '',
        price: '',
        image: null,
        goals: []
    });
    const [schedules, setSchedules] = useState({
        day_start: '',
        day_end: '',
        hour_start: '',
        hour_end: ''
    });
    const [previousImage, setPreviousImage] = useState(null);
    const [isCoach, setIsCoach] = useState(false);
    const [userId, setUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [numeroError, setNumeroError] = useState('');
    const [goalsList, setGoalsList] = useState([]);
    const [goalsError, setGoalsError] = useState('');
    const navigate = useNavigate();

    const goalsData = [
        { id: 1, name: 'Musculation' },
        { id: 2, name: 'Fitness' },
        { id: 3, name: 'Nutrition' },
        { id: 4, name: 'Running' },
    ];

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

                const response = await axios.get(`hhttps://projet-final-jvgt.onrender.com/users/${storedUserId}`, {
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
                    image: null,
                    goals: user.goals.map(goal => goal.id)
                });
                setPreviousImage(user.image);
                setIsCoach(user.role === 'coach');

                if (user.role === 'coach') {
                    await fetchSchedules(storedUserId, token);
                }

                setGoalsList(goalsData);

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
                const scheduleResponse = await axios.get(`https://projet-final-jvgt.onrender.com/api/schedules/${userId}`, {
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

    const formatTime = (timeString) => {
        if (timeString && timeString.length === 8) {
            return timeString.substring(0, 5);
        }
        return timeString;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true;

        if (!formData.numero || !validateNumero(formData.numero)) {
            setNumeroError("Le numéro de téléphone doit contenir exactement 10 chiffres et commencer par 0.");
            isValid = false;
        } else {
            setNumeroError('');
        }

        if (isCoach && !formData.city) {
            setGoalsError("La ville est requise.");
            isValid = false;
        } else {
            setGoalsError('');
        }

        if (formData.password && formData.password.length < 8) {
            setErrorMessage('Le mot de passe doit contenir au moins 8 caractères.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append('role', isCoach ? 'coach' : 'client');
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('numero', formData.numero);

        if (isCoach) {
            dataToSend.append('city', formData.city);
        }

        if (formData.password) {
            dataToSend.append('password', formData.password);
        }

        if (isCoach) {
            dataToSend.append('day_start', schedules.day_start);
            dataToSend.append('day_end', schedules.day_end);
            dataToSend.append('hour_start', formatTime(schedules.hour_start));
            dataToSend.append('hour_end', formatTime(schedules.hour_end));
        }

        formData.goals.forEach(goal => {
            dataToSend.append('goals[]', goal);
        });

        if (formData.image) {
            dataToSend.append('image', formData.image);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`https://projet-final-jvgt.onrender.com/api/users/${userId}?_method=PUT`, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
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

    const handleGoalChange = (goalId) => {
        setFormData((prevState) => {
            const { goals } = prevState;
            if (goals.includes(goalId)) {
                return { ...prevState, goals: goals.filter((id) => id !== goalId) };
            } else {
                return { ...prevState, goals: [...goals, goalId] };
            }
        });

        setGoalsError('');
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://projet-final-jvgt.onrender.com/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            alert('Votre compte a été supprimé avec succès.');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la suppression du compte :', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Une erreur est survenue lors de la suppression du compte.');
            }
        }
    };

    const daysOfWeek = [
        { value: 'Lundi', label: 'Lundi' },
        { value: 'Mardi', label: 'Mardi' },
        { value: 'Mercredi', label: 'Mercredi' },
        { value: 'Jeudi', label: 'Jeudi' },
        { value: 'Vendredi', label: 'Vendredi' },
        { value: 'Samedi', label: 'Samedi' },
        { value: 'Dimanche', label: 'Dimanche' },
    ];

    return (
        <div style={{ backgroundImage: `url('/imageprofile.jpg')` }}>
            <Header />

            <div className="flex items-center justify-center min-h-screen mt-20 mb-22 mx-10">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md mt-20 mb-20">
                    {errorMessage && (
                        <div className="bg-red-200 text-red-600 p-4 mb-4">{errorMessage}</div>
                    )}
                    <h1 className="text-2xl font-bold mb-4">Profil</h1>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nom</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            minLength="8"
                        />
                        <p className="text-gray-600 text-xs">Laissez vide pour conserver l'ancien mot de passe.</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero">Numéro de téléphone</label>
                        <input
                            type="text"
                            id="numero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            className={`border border-gray-300 rounded p-2 w-full ${numeroError ? 'border-red-500' : ''}`}
                            required
                        />
                        {numeroError && (
                            <p className="text-red-500 text-xs italic">{numeroError}</p>
                        )}
                    </div>

                    {isCoach && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">Ville</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleChange}
                                className={`border border-gray-300 rounded p-2 w-full ${goalsError ? 'border-red-500' : ''}`}
                                required
                            />
                            {goalsError && (
                                <p className="text-red-500 text-xs italic">{goalsError}</p>
                            )}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Objectifs</label>
                        <div className="flex flex-wrap">
                            {goalsList.map(goal => (
                                <div key={goal.id} className="mr-4 mb-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.goals.includes(goal.id)}
                                            onChange={() => handleGoalChange(goal.id)}
                                            className="form-checkbox"
                                        />
                                        <span className="ml-2">{goal.name}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        {goalsError && (
                            <p className="text-red-500 text-xs italic">{goalsError}</p>
                        )}
                    </div>

                    {isCoach && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="day_start">Jour de début</label>
                                <select
                                    id="day_start"
                                    name="day_start"
                                    value={schedules.day_start}
                                    onChange={handleScheduleChange}
                                    className="border border-gray-300 rounded p-2 w-full"
                                >
                                    <option value="">Sélectionnez un jour</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day.value} value={day.value}>{day.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hour_start">Heure de début</label>
                                <input
                                    type="time"
                                    id="hour_start"
                                    name="hour_start"
                                    value={schedules.hour_start}
                                    onChange={handleScheduleChange}
                                    className="border border-gray-300 rounded p-2 w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="day_end">Jour de fin</label>
                                <select
                                    id="day_end"
                                    name="day_end"
                                    value={schedules.day_end}
                                    onChange={handleScheduleChange}
                                    className="border border-gray-300 rounded p-2 w-full"
                                >
                                    <option value="">Sélectionnez un jour</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day.value} value={day.value}>{day.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hour_end">Heure de fin</label>
                                <input
                                    type="time"
                                    id="hour_end"
                                    name="hour_end"
                                    value={schedules.hour_end}
                                    onChange={handleScheduleChange}
                                    className="border border-gray-300 rounded p-2 w-full"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Mettre à jour le profil
                        </button>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Supprimer mon compte
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
