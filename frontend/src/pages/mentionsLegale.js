import React from 'react';
import Header from '../componants/header';
const MentionsLegales = () => {
    return (
        <div>
            <div className="flex flex-col items-center justify-center bg-cover bg-center h-screen" style={{ backgroundImage: `url('/imageDashClient.jpg')` }}>
                <h2 className="text-8xl font-bold pb-5 mb-6 text-center text-white"> Mentions Légales</h2>
            </div>
            <Header />
            <div className="container mt-8 mx-auto px-6 py-10 bg-gray-50 rounded-lg shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}
            >
                <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-700">Informations Légales</h2>
                <p className="mb-4 text-gray-600">
                    Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en
                    l'économie numérique, il est précisé aux utilisateurs du site <strong>CoachFinder</strong> l'identité
                    des différents intervenants dans le cadre de sa réalisation et de son suivi.
                </p>
                <p className="mb-4 text-gray-600">
                    <strong>Éditeur du site :</strong><br />
                    Alain Dupont<br />
                    2 rue de l'échappée, 75010 PARIS, France<br />
                    Nationalité : Française<br />
                    Date de naissance : 23/02/2002<br />
                    Email : <a href="mailto:CoachFinder@contact.com" className="text-blue-600 hover:underline">CoachFinder@contact.com</a>
                </p>

                <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-700">Hébergement</h2>
                <p className="mb-4 text-gray-600">
                    Le site <strong>CoachFinder</strong> est hébergé par :
                    <br />
                    <strong>Render</strong><br />
                    2 rue de l'échappée, 75010 PARIS, France<br />
                    Contact : <a href="tel:+33612345684" className="text-blue-600 hover:underline">+33612345684</a><br />
                    Email : <a href="mailto:contact@render.com" className="text-blue-600 hover:underline">contact@render.com</a>
                </p>

                <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-700">Nous contacter</h2>
                <p className="mb-4 text-gray-600">
                    <strong>Par téléphone :</strong> <a href="tel:+33712345689" className="text-blue-600 hover:underline">+33712345689</a><br />
                    <strong>Par email :</strong> <a href="mailto:CoachFinder@contact.com" className="text-blue-600 hover:underline">CoachFinder@contact.com</a><br />
                    <strong>Par courrier :</strong> 2 rue de l'échappée, 75010 PARIS, France
                </p>

                <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-700">Données personnelles</h2>
                <p className="mb-4 text-gray-600">
                    Le traitement de vos données à caractère personnel est régi par notre{' '}
                    <strong>Charte de Protection des Données Personnelles</strong>, disponible dans la section correspondante
                    sur le site. Celle-ci est conforme au <strong>Règlement Général sur la Protection des Données</strong> (RGPD)
                    n° 2016/679 du 27 avril 2016.
                </p>

                <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-700">Propriété intellectuelle</h2>
                <p className="mb-4 text-gray-600">
                    Le contenu du site <strong>CoachFinder</strong>, incluant, de façon non limitative, les graphismes,
                    images, textes, vidéos, animations, sons, logos, gifs et icônes ainsi que leur mise en forme
                    sont la propriété exclusive d'Alain Dupont, à l'exception des marques, logos ou contenus appartenant
                    à d'autres sociétés partenaires ou auteurs.
                </p>
                <p className="mb-4 text-gray-600">
                    Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même
                    partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit
                    d'Alain Dupont.
                </p>

                <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-700">Limitations de responsabilité</h2>
                <p className="mb-4 text-gray-600">
                    L'éditeur du site <strong>CoachFinder</strong> ne pourra être tenu responsable des dommages directs
                    et indirects causés au matériel de l'utilisateur lors de l'accès au site, et résultant soit de
                    l'utilisation d'un matériel ne répondant pas aux spécifications techniques mentionnées, soit de
                    l'apparition d'un bug ou d'une incompatibilité.
                </p>
                <p className="mb-4 text-gray-600">
                    Le site <strong>CoachFinder</strong> ne pourra également être tenu responsable des dommages indirects
                    (tels par exemple qu'une perte de marché ou perte d'une chance) consécutifs à l'utilisation du site.
                </p>

                <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-700">Droit applicable</h2>
                <p className="mb-4 text-gray-600">
                    Tout litige en relation avec l’utilisation du site <strong>CoachFinder</strong> est soumis au droit
                    français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
                </p>

            </div>
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
        </div>
    );
};

export default MentionsLegales;
