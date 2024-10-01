import React from "react";
import Header from "./header";

const About = () => {
    return (
        <>
            <Header />
            <section className="bg-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col xl:flex-row lg:items-center">
                        <div className="md:w-1/2">
                            <h2 className="pb-20 pt-10 text-4xl">Bienvenue chez CoachFinder</h2>
                            <p className="text-xl pb-8">
                                Chez CoachFinder, nous mettons en relation les habitants de toute la France avec les meilleurs coachs sportifs français. Que vous cherchiez à améliorer votre forme physique, à atteindre des objectifs spécifiques ou simplement à adopter un mode de vie plus sain, notre plateforme vous permet de trouver le coach qui correspond à vos besoins. Avec un large choix de professionnels qualifiés, vous êtes sûr de recevoir un accompagnement personnalisé et de qualité, tout en soutenant des experts français. Prenez en main votre bien-être avec CoachFinder.
                            </p>
                        </div>
                        <img className="w-80 lg:w-2/6" src="LogoCoachFinder63.png" alt="logo" />
                    </div>
                </div>
            </section>
            <footer className="bg-gray-800 text-gray-400 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 CoachFinder. Tous droits réservés.</p>
                </div>
            </footer>
        </>
    );
};

export default About;
