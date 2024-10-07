import React from "react";


const Footer = () => {
    return (

        <footer className="bg-gray-800 text-gray-400 py-8">
            <div className="container mx-auto px-4 text-center">
                <p>&copy; 2024 CoachFinder. Tous droits réservés.</p>
                <p>
                    <a
                        href="/legals"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        Mentions légales
                    </a>
                </p>
            </div>
        </footer>
    )
}

export default Footer