import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        goal: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

        if (file && validTypes.includes(file.type)) {
            setFormData({ ...formData, image: file });
        } else {
            alert('Veuillez sélectionner une image valide (jpeg, png, jpg, gif).');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        const role = isCoach ? 'coach' : 'client';
        data.append('role', role);

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            await axios.post('http://localhost:9200/api/users', data);
            navigate('/login');
        } catch (error) {
            console.error('Inscription échouée', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100"
            style={{ backgroundImage: `url('/imageregister.jpg')` }}>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow-md rounded-lg p-8 m-14"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
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
                            <label className="block text-gray-700" htmlFor="price">Tarif /h :</label>
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
                            <select
                                name="day_start"
                                value={formData.day_start}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            >
                                <option value="">Sélectionnez un jour</option>
                                <option value="Lundi">Lundi</option>
                                <option value="Mardi">Mardi</option>
                                <option value="Mercredi">Mercredi</option>
                                <option value="Jeudi">Jeudi</option>
                                <option value="Vendredi">Vendredi</option>
                                <option value="Samedi">Samedi</option>
                                <option value="Dimanche">Dimanche</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700" htmlFor="day_end">Jour de fin :</label>
                            <select
                                name="day_end"
                                value={formData.day_end}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            >
                                <option value="">Sélectionnez un jour</option>
                                <option value="Lundi">Lundi</option>
                                <option value="Mardi">Mardi</option>
                                <option value="Mercredi">Mercredi</option>
                                <option value="Jeudi">Jeudi</option>
                                <option value="Vendredi">Vendredi</option>
                                <option value="Samedi">Samedi</option>
                                <option value="Dimanche">Dimanche</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700" htmlFor="hour_start">Heure de début :</label>
                            <input
                                type="time"
                                name="hour_start"
                                value={formData.hour_start}
                                onChange={handleChange}
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
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700" htmlFor="image">Photo de profil :</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                    </>
                )}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-900 transition duration-300"
                >
                    S'inscrire
                </button>
            </form>
        </div>
    );
};

export default Register;
