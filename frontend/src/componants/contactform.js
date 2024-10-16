import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        consent: false  // Nouvelle propriété pour la checkbox
    });
    const [isSent, setIsSent] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value  // Gérer checkbox séparément
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Vérifier si la case est cochée avant d'envoyer l'e-mail
        if (formData.consent) {
            emailjs.send(
                'service_f4x7se4',    // Ton service ID
                'template_dshuoae',   // Ton template ID
                formData,
                'eyPGK1wSWJ_spYcEA'   // Ton User ID
            )
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                    setIsSent(true);
                    setFormData({
                        name: '',
                        email: '',
                        message: '',
                        consent: false  // Reset de la checkbox
                    });
                })
                .catch((err) => {
                    console.log('FAILED...', err);
                });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg mb-5">
            <h2 className="text-2xl font-bold mb-6">Formulaire de contact</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Message:</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="consent"
                            checked={formData.consent}
                            onChange={handleChange}
                            required
                            className="form-checkbox h-4 w-4 text-blue-900"
                        />
                        <span className="ml-2 text-gray-700">J'accepte que mes données soient collectées et utilisées.</span>
                    </label>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={!formData.consent}
                        className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    ${formData.consent ? 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-900' : 'bg-gray-400 text-white cursor-not-allowed'}`}>
                        Envoyer
                    </button>
                </div>
            </form>
            {isSent && <p className="text-green-500 mt-4">Votre message a été envoyé</p>}
        </div>
    );
};

export default ContactForm;
