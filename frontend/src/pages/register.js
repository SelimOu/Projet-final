import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import Header from '../componants/header';
import Footer from '../componants/footer';

const Register = () => {
    const navigate = useNavigate();
    const [isCoach, setIsCoach] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        numero: '',
        price: '',
        day_start: '',
        day_end: '',
        hour_start: '',
        hour_end: '',
        city: '',
        goals: [],
        image: null,
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [numeroError, setNumeroError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [goalsError, setGoalsError] = useState('');

    const goalsList = [
        { id: 1, name: 'Musculation' },
        { id: 2, name: 'Fitness' },
        { id: 3, name: 'Nutrition' },
        { id: 4, name: 'Running' },
    ];

    const daysOfWeek = [
        { value: 'Lundi', label: 'Lundi' },
        { value: 'Mardi', label: 'Mardi' },
        { value: 'Mercredi', label: 'Mercredi' },
        { value: 'Jeudi', label: 'Jeudi' },
        { value: 'Vendredi', label: 'Vendredi' },
        { value: 'Samedi', label: 'Samedi' },
        { value: 'Dimanche', label: 'Dimanche' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email') {
            setEmailError('');
        }
        if (name === 'numero') {
            setNumeroError('');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

        if (file && validTypes.includes(file.type)) {
            setFormData({ ...formData, image: file });
            setErrorMessage('');
        } else {
            alert('Veuillez sélectionner une image valide (jpeg, png, jpg, gif).');
            setFormData({ ...formData, image: null });
        }
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

    const validateForm = () => {
        let isValid = true;
        setErrorMessage('');
        setNumeroError('');
        setEmailError('');
        setGoalsError('');

        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(formData.numero)) {
            setNumeroError('Numéro de téléphone invalide. Doit commencer par 0 et contenir 10 chiffres.');
            isValid = false;
        }

        if (formData.goals.length === 0) {
            setGoalsError('Veuillez sélectionner au moins un objectif.');
            isValid = false;
        }

        if (formData.password.length < 8) {
            setErrorMessage('Le mot de passe doit contenir au moins 8 caractères.');
            isValid = false;
        }

        if (!formData.image) {
            setErrorMessage('Veuillez télécharger une image.');
            isValid = false;
        }

        if (isCoach) {
            if (!formData.price) {
                setErrorMessage('Veuillez indiquer votre tarif.');
                isValid = false;
            }
            if (!formData.day_start || !formData.day_end) {
                setErrorMessage('Veuillez sélectionner vos jours de disponibilité.');
                isValid = false;
            }
            if (!formData.hour_start || !formData.hour_end) {
                setErrorMessage('Veuillez indiquer vos heures de disponibilité.');
                isValid = false;
            }
            if (!formData.city) {
                setErrorMessage('Veuillez indiquer votre ville.');
                isValid = false;
            }
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = new FormData();
        const role = isCoach ? 'coach' : 'client';
        data.append('role', role);

        Object.keys(formData).forEach((key) => {
            if (key !== 'goals') {
                data.append(key, formData[key]);
            }
        });

        formData.goals.forEach(goal => {
            data.append('goals[]', goal);
        });

        try {
            await axios.post('https://8d7874e2-40e5-4b63-afd1-071e51070726-00-25ex1vqas2dte.worf.replit.dev/api/users', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            navigate('/login');
        } catch (error) {
            console.error('Inscription échouée', error);
            if (error.response && error.response.data && error.response.data.message) {
                if (error.response.data.message === "L'email est déjà utilisé") {
                    setEmailError("L'email est déjà utilisé.");
                } else {
                    setErrorMessage(error.response.data.message);
                }
            } else {
                setErrorMessage('Inscription échouée. Veuillez réessayer.');
            }
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full bg-gray-100"
                style={{ backgroundImage: `url('/imageregister.jpg')`, backgroundSize: 'cover' }}>
                <Header />
                <div>
                    <form
                        onSubmit={handleSubmit}
                        className=" max-w-md bg-white shadow-md rounded-lg p-8 m-14 mt-36"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>

                        {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
                        {numeroError && <div className="text-red-600 mb-4">{numeroError}</div>}
                        {emailError && <div className="text-red-600 mb-4">{emailError}</div>}
                        {goalsError && <div className="text-red-600 mb-4">{goalsError}</div>}

                        <div className="mb-4 flex justify-around">
                            <button
                                type="button"
                                onClick={() => setIsCoach(false)}
                                className={`py-2 px-4 rounded-lg ${!isCoach ? 'bg-blue-900 text-white' : 'bg-gray-300'}`}
                            >
                                Vous êtes client ?
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCoach(true)}
                                className={`py-2 px-4 rounded-lg ${isCoach ? 'bg-blue-900 text-white' : 'bg-gray-300'}`}
                            >
                                Vous êtes coach ?
                            </button>
                        </div>

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
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700" htmlFor="numero">Numéro de téléphone :</label>
                            <input
                                type="tel"
                                name="numero"
                                value={formData.numero}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700" htmlFor="image">Image de profil :</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                                className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>

                        {isCoach && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="price">Tarif :</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="day_start">Jour de début :</label>
                                    <select
                                        name="day_start"
                                        value={formData.day_start}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    >
                                        <option value="">Sélectionnez un jour</option>
                                        {daysOfWeek.map(day => (
                                            <option key={day.value} value={day.value}>{day.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="day_end">Jour de fin :</label>
                                    <select
                                        name="day_end"
                                        value={formData.day_end}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    >
                                        <option value="">Sélectionnez un jour</option>
                                        {daysOfWeek.map(day => (
                                            <option key={day.value} value={day.value}>{day.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="hour_start">Heure de début :</label>
                                    <input
                                        type="time"
                                        name="hour_start"
                                        value={formData.hour_start}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="hour_end">Heure de fin :</label>
                                    <input
                                        type="time"
                                        name="hour_end"
                                        value={formData.hour_end}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700" htmlFor="city">Ville :</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    />
                                </div>
                            </>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700">Objectifs :</label>
                            <div className="flex flex-wrap mt-2">
                                {goalsList.map(goal => (
                                    <div key={goal.id} className="mr-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.goals.includes(goal.id)}
                                                onChange={() => handleGoalChange(goal.id)}
                                                className="mr-2"
                                            />
                                            {goal.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
                        >
                            S'inscrire
                        </button>
                    </form>
                </div>
                <div className='bg-white shadow-md rounded-lg p-8 mb-4' >
                    <h3 className="mt-6 text-lg">Déjà un compte?</h3>
                    <NavLink to={'/login'}>
                        <button className="mt-4 px-4 bg-blue-900 text-white rounded-lg">Connectez-vous</button>
                    </NavLink>
                </div>


            </div>

            <Footer />
        </>
    );
};

export default Register;
