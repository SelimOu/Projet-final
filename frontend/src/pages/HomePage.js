import React from "react";
import Header from "../componants/header";
import CoachList from "../componants/coachList";

const HomePage = () => {
    return (
        <div className="bg-gray-100">
            <Header />
            <img className="w-full h-90" src="choisir-coach-sportif.jpg" alt="image qui représentent un coach" />

            <section className="bg-gray-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-4">Connectez-vous avec les meilleurs coachs</h2>
                    <p className="text-lg mb-8">Trouver le coach parfait pour vous aider à atteindre vos objectifs</p>
                    <a
                        href="/signup"
                        className="bg-white text-blue-900 font-semibold py-2 px-6 rounded-full hover:bg-gray-200"
                    >
                        Commencez Maintenant
                    </a>
                </div>
            </section>

            <section className="bg-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2">
                            <h2 className="pb-20 pt-10 text-4xl">Bienvenue chez CoachFinder 63</h2>
                            <p className="text-xl">
                                Chez CoachFinder 63, nous mettons en relation les habitants de Clermont-Ferrand et des environs avec les meilleurs coachs sportifs locaux. Que vous cherchiez à améliorer votre forme physique, à atteindre des objectifs spécifiques ou simplement à adopter un mode de vie plus sain, notre plateforme vous permet de trouver le coach qui correspond à vos besoins. Avec un large choix de professionnels qualifiés, vous êtes sûr de recevoir un accompagnement personnalisé et de qualité, tout en soutenant des experts de votre région. Prenez en main votre bien-être avec CoachFinder 63.
                            </p>
                        </div>
                        <img className="w-42 md:w-1/2" src="LogoCoachFinder63.png" alt="logo" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold mb-2">Vous êtes coach ?</h3>
                    <h4 className="text-1xl font-bold mb-6">Devenez coach partenaire de l'aventure CoachFinder 63</h4>
                    <a
                        href="/signup"
                        className="bg-blue-900 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700"
                    >
                        Rejoignez-nous maintenant
                    </a>
                </div>
            </section>
            <section>
                <CoachList />
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-400 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 CoachFinder 63. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
