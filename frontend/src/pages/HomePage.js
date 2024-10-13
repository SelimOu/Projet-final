import React from "react";
import Header from "../componants/header";
import Footer from "../componants/footer";
import ContactForm from "../componants/contactform";

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
                        href="/register"
                        className="bg-white text-blue-900 font-semibold py-2 px-6 rounded-full hover:bg-gray-200"
                    >
                        Commencez Maintenant
                    </a>
                </div>
            </section>

            <section id="about" className="bg-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col xl:flex-row max-lg:items-center">
                        <div className="md:w-1/2">
                            <h2 className="pb-20 pt-10 text-4xl">Bienvenue chez CoachTracker</h2>
                            <p className="text-xl pb-8">
                                Chez CoachTracker, nous mettons en relation les habitants de toute la France avec les meilleurs coachs sportifs français. Que vous cherchiez à améliorer votre forme physique, à atteindre des objectifs spécifiques ou simplement à adopter un mode de vie plus sain, notre plateforme vous permet de trouver le coach qui correspond à vos besoins. Avec un large choix de professionnels qualifiés, vous êtes sûr de recevoir un accompagnement personnalisé et de qualité, tout en soutenant des experts français. Prenez en main votre bien-être avec CoachTracker.
                            </p>
                        </div>
                        <img className="w-80 lg:w-2/6 " src="CoachTracker.png" alt="logo" />
                    </div>
                </div>
            </section>

            <section className="bg-gray-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold mb-2">Vous êtes coach ?</h3>
                    <h4 className="text-1xl font-bold mb-6">Devenez coach partenaire de l'aventure CoachTracker</h4>
                    <a
                        href="/register"
                        className="bg-blue-900 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-900"
                    >
                        Rejoignez-nous maintenant
                    </a>
                </div>
            </section>

            <section className="bg-white">
                <ContactForm />
            </section>

            <Footer />

        </div>
    );
};

export default HomePage;
