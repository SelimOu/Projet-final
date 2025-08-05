import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    navigate('/login');
                    alert("Session expirée, veuillez vous reconnecter.");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    const handleScroll = () => {
        if (window.scrollY === 0) {
            setIsVisible(true);  // Toujours visible tout en haut
        } else if (window.scrollY < lastScrollY && window.scrollY > 100) {
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:9200/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            localStorage.removeItem('token');
            localStorage.removeItem('userId');

            alert('Déconnecté avec succès');
            navigate('/');
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            alert('Déconnecté avec succès');
            navigate('/');
        }
    };

    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isVisible ? 'bg-white shadow-lg' : 'bg-transparent opacity-0 pointer-events-none'}`}>
            <header className={`py-6 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                <div className="container mx-auto px-4 flex justify-between items-center h-20">
                    <a href="/"><img className="w-48 pr-4" src="CoachTracker.png" alt="logo" /></a>
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="focus:outline-none" aria-label="Open menu">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>

                    <nav className="hidden md:flex space-x-6">
                        <ul className="flex flex-row space-x-6">
                            <li>
                                <Link to="/" className="text-gray-700 hover:text-blue-900">Home</Link>
                            </li>
                            <li>
                                <Link to="/" state={{ scrollToAbout: true }} className="text-gray-700 hover:text-blue-900">About</Link>
                            </li>
                            <li>
                                <Link to="/" state={{ scrollToContact: true }} className="text-gray-700 hover:text-blue-900">Contact</Link>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <Link to="/dashboard" className="text-gray-700 hover:text-blue-900">Dashboard</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile" className="text-gray-700 hover:text-blue-900">Modifier mon Profil</Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="text-gray-700 hover:text-blue-900">Se déconnecter</button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <Link to="/login" className="text-gray-700 hover:text-blue-900">Login</Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white shadow-md mt-2">
                        <ul className="flex flex-col space-y-2 px-4 py-2">
                            <li>
                                <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
                            </li>
                            <li>
                                <Link to="/" state={{ scrollToAbout: true }} className="text-gray-700 hover:text-blue-500">About</Link>
                            </li>
                            <li>
                                <Link to="/" state={{ scrollToAbout: true }} className="text-gray-700 hover:text-blue-500">Contact</Link>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <Link to="/profile" className="text-gray-700 hover:text-blue-500">Modifier mon Profil</Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="text-gray-700 hover:text-blue-500">Se déconnecter</button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
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
