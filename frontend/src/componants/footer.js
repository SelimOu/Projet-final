import React from "react";


const Footer = () => {
    return (

        <footer className="bg-gray-800 text-gray-400 py-8">
            <div className="container mx-auto px-4 text-center flex justify-center max-lg:flex-col ">
                <div>
                    <p>&copy; 2024 CoachTracker. Tous droits réservés.</p>
                    <p>
                        <a
                            href="/legals"
                            className="text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            Mentions légales
                        </a>
                    </p>
                </div>
                <div>
                    <p className="mb-4 text-gray-400">
                        <strong>Téléphone :</strong>
                        <a href="tel:+33712345689" className="text-blue-900 hover:underline underline font-semibold">+33712345689</a><br />
                        <strong>Email :</strong>
                        <a href="mailto:CoachTracker@contact.com" className="text-blue-900 hover:underline underline font-semibold">CoachTracker@contact.com</a><br />
                        <strong>Courrier :</strong> 2 rue de l'échappée, 75010 PARIS, France
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer