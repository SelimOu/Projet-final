import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isLoggedIn = !!localStorage.getItem('token');

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
                                <Link to="/" className="text-gray-700 hover:text-blue-900">Home</Link>
                            </li>
                            <li>
                                {/* Naviguer vers "/" avec un état pour l'ancre */}
                                <Link to="/" state={{ scrollToAbout: true }} className="text-gray-700 hover:text-blue-900">About</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-700 hover:text-blue-900">Contact</Link>
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
                                <Link to="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <Link to="/profile" className="text-gray-700 hover:text-blue-500">Profil</Link>
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
