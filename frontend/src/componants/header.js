import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Assurez-vous d'importer useNavigate

const Header = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // État pour vérifier la connexion

    const navigate = useNavigate();

    const handleScroll = () => {
        if (window.scrollY < lastScrollY && window.scrollY > 100) {
            setIsVisible(true);
        } else if (window.scrollY > lastScrollY) {
            setIsVisible(false);
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    // Vérifier si l'utilisateur est connecté au démarrage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        // Supprimer le token
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        alert('Déconnexion réussie');
        navigate('/'); // Redirige vers la page d'accueil
    };

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isVisible ? 'bg-white shadow-lg' : 'bg-transparent opacity-0 pointer-events-none'}`}>
            <header className={`py-6 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                <div className="container mx-auto px-4 flex justify-between items-center h-20">
                    <img className="w-48 pr-4" src="LogoCoachFinder63.png" alt="logo" />
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>

                    <nav className="hidden md:flex space-x-6">
                        <ul className="flex flex-row space-x-6">
                            <li>
                                <a href="/" className="text-gray-700 hover:text-blue-900">Home</a>
                            </li>
                            <li>
                                <a href="/about" className="text-gray-700 hover:text-blue-900">About</a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-700 hover:text-blue-900">Contact</a>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <a href="/dashboard" className="text-gray-700 hover:text-blue-900">Dashboard</a>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="text-gray-700 hover:text-blue-900 focus:outline-none">Se déconnecter</button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <a href="/login" className="text-gray-700 hover:text-blue-900">Login</a>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white shadow-md mt-2">
                        <ul className="flex flex-col space-y-2 px-4 py-2">
                            <li>
                                <a href="/" className="text-gray-700 hover:text-blue-500">Home</a>
                            </li>
                            <li>
                                <a href="/about" className="text-gray-700 hover:text-blue-500">About</a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-700 hover:text-blue-500">Contact</a>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <a href="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</a>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="text-gray-700 hover:text-blue-500 focus:outline-none">Se déconnecter</button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <a href="/login" className="text-gray-700 hover:text-blue-500">Login</a>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </header>
        </div>
    );
};

export default Header;
