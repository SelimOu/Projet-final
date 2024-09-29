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
        image: null,
        goals: [] // Ajouté pour stocker les objectifs sélectionnés
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
    const [goalsList, setGoalsList] = useState([]); // Initialisation de la liste des objectifs
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
                    image: null,
                    goals: user.goals.map(goal => goal.id) // Charger les objectifs de l'utilisateur
                });
                setPreviousImage(user.image);
                setIsCoach(user.role === 'coach');

                if (user.role === 'coach') {
                    await fetchSchedules(storedUserId, token);
                }

                // Charger la liste des objectifs
                setGoalsList(goalsData); // Utilisation de la méthode des objectifs définie

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

    const formatTime = (timeString) => {
        if (timeString && timeString.length === 8) {
            return timeString.substring(0, 5); // Reformate 'HH:mm:ss' en 'HH:mm'
        }
        return timeString;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true; // Ajout de la variable pour suivre la validité du formulaire

        if (!formData.numero || !validateNumero(formData.numero)) {
            setNumeroError("Le numéro de téléphone doit contenir exactement 10 chiffres et commencer par 0.");
            isValid = false; // Si le numéro n'est pas valide, on arrête la validation
        } else {
            setNumeroError('');
        }

        if (formData.password && formData.password.length < 8) {
            setErrorMessage('Le mot de passe doit contenir au moins 8 caractères.');
            isValid = false; // Si le mot de passe est trop court, on arrête la validation
        }

        if (!isValid) {
            return; // Si le formulaire est invalide, on arrête l'exécution ici
        }

        const dataToSend = new FormData(); // Utilisation de FormData pour l'envoi de fichiers
        dataToSend.append('role', isCoach ? 'coach' : 'client');
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('numero', formData.numero);
        dataToSend.append('price', formData.price);

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
            const response = await axios.post(`http://localhost:9200/api/users/${userId}?_method=PUT`, dataToSend, {
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

            <div className="flex items-center justify-center min-h-screen mt-20 mb-22">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md mt-20 mb-20 ">
                    {errorMessage && (
                        <div className="bg-red-200 text-red-600 p-4 mb-4">{errorMessage}</div>
                    )}
                    {numeroError && (
                        <div className="text-red-600 mb-4">{numeroError}</div>
                    )}
                    <h2 className="text-2xl mb-4">{isCoach ? 'Profil du Coach' : 'Profil du Client'}</h2>

                    <label className="block mb-2">
                        Nom:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                            required
                        />
                    </label>

                    <label className="block mb-2">
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                            required
                        />
                    </label>

                    <label className="block mb-2">
                        Mot de passe:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    </label>

                    <label className="block mb-2">
                        Numéro de téléphone:
                        <input
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 rounded w-full"
                            required
                        />
                    </label>



                    <label className="block mb-2">
                        Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    </label>

                    {isCoach && (
                        <>
                            <label className="block mb-2">
                                Tarif /h
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </label>
                            <h3 className="text-xl mt-4">Horaires</h3>

                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="day_start">Jour de début :</label>
                                <select
                                    name="day_start"
                                    value={schedules.day_start}
                                    onChange={handleScheduleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                >
                                    <option value="">Sélectionnez un jour</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day.value} value={day.value}>
                                            {day.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="day_end">Jour de fin :</label>
                                <select
                                    name="day_end"
                                    value={schedules.day_end}
                                    onChange={handleScheduleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                >
                                    <option value="">Sélectionnez un jour</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day.value} value={day.value}>
                                            {day.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <label className="block mb-2">
                                Heure de début:
                                <input
                                    type="time"
                                    name="hour_start"
                                    value={schedules.hour_start}
                                    onChange={handleScheduleChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </label>

                            <label className="block mb-2">
                                Heure de fin:
                                <input
                                    type="time"
                                    name="hour_end"
                                    value={schedules.hour_end}
                                    onChange={handleScheduleChange}
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </label>
                        </>
                    )}

                    <h3 className="text-xl mt-4">Objectifs</h3>
                    {goalsList.map((goal) => (
                        <label key={goal.id} className="block mb-2">
                            <input
                                type="checkbox"
                                checked={formData.goals.includes(goal.id)}
                                onChange={() => handleGoalChange(goal.id)}
                            />
                            {goal.name}
                        </label>
                    ))}
                    {goalsError && (
                        <div className="text-red-600 mb-4">{goalsError}</div>
                    )}

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Enregistrer
                    </button>
                </form>
            </div >

            <footer className="bg-gray-800 text-gray-400 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 CoachFinder 63. Tous droits réservés.</p>
                </div>
            </footer>
        </div>



    );
};

export default Profile;
