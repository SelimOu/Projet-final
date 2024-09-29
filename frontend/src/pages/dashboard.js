import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../componants/header";

const DashboardClient = () => {
    const [coaches, setCoaches] = useState([]);
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [specialtyFilter, setSpecialtyFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const coachesPerPage = 4;

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const response = await axios.get("http://localhost:9200/api/users");
                const coachList = response.data.filter(user => user.role === "coach");
                setCoaches(coachList);
                setFilteredCoaches(coachList);

                const uniqueSpecialties = [...new Set(coachList.map(coach => coach.goal))];
                setSpecialties(uniqueSpecialties);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCoaches();
    }, []);

    const handleSpecialtyChange = (event) => {
        setSpecialtyFilter(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPriceFilter(event.target.value);
    };

    useEffect(() => {
        let filtered = coaches;

        if (specialtyFilter) {
            filtered = filtered.filter(coach =>
                coach.goal.toLowerCase().includes(specialtyFilter.toLowerCase())
            );
        }

        if (priceFilter) {
            const priceValue = parseFloat(priceFilter);
            filtered = filtered.filter(coach => {
                const coachPrice = parseFloat(coach.price);
                return coachPrice <= priceValue;
            });
        }

        setFilteredCoaches(filtered);
        setCurrentPage(1);

    }, [specialtyFilter, priceFilter, coaches]);

    const indexOfLastCoach = currentPage * coachesPerPage;
    const indexOfFirstCoach = indexOfLastCoach - coachesPerPage;
    const currentCoaches = filteredCoaches.slice(indexOfFirstCoach, indexOfLastCoach);

    const totalPages = Math.ceil(filteredCoaches.length / coachesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>Erreur: {error}</p>;
    }

    return (
        <div>
            <Header />
            <div className="flex flex-col items-center justify-center bg-cover bg-center h-screen" style={{ backgroundImage: `url('/imageDashClient.jpg')` }}>
                <h2 className="text-8xl font-bold pb-5 mb-6 text-center text-white">Tous les Coachs</h2>
            </div>

            <div className="filters mb-6 mt-9 flex justify-center gap-4">
                <div>
                    <label className="block mb-2">Filtrer par spécialité:</label>
                    <select
                        value={specialtyFilter}
                        onChange={handleSpecialtyChange}
                        className="border p-2 rounded-md w-full"
                    >
                        <option value="">Toutes les spécialités</option>
                        {specialties.map((specialty, index) => (
                            <option key={index} value={specialty}>
                                {specialty}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-2">Filtrer par prix (maximum):</label>
                    <input
                        type="number"
                        value={priceFilter}
                        onChange={handlePriceChange}
                        placeholder="Prix maximum"
                        className="border p-2 rounded-md w-full"
                    />
                </div>
            </div>

            {currentCoaches.length === 0 ? (
                <p className="text-center">Aucun coach trouvé.</p>
            ) : (
                <div className="flex flex-wrap justify-center gap-6">
                    {currentCoaches.map((coach) => (
                        <div key={coach.id} className="coach-card bg-white rounded-lg shadow-md p-4 flex flex-col items-center w-full lg:w-1/3">
                            <img
                                src={`http://127.0.0.1:9200/storage/${coach.image}`}
                                alt={coach.name}
                                className="w-48 h-48 object-cover rounded-full mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-2">{coach.name}</h3>
                            <p className="text-gray-600">Prix : {coach.price} €</p>
                            <p className="text-gray-600">Spécialité : {coach.goal}</p>
                            <p className="text-gray-600">Numéro : {coach.numero}</p>
                            <p className="text-gray-600">Mail : {coach.email}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="pagination flex justify-center mt-6">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Précédent
                </button>
                <p className="text-center py-2">
                    Page {currentPage} sur {totalPages}
                </p>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Suivant
                </button>
            </div>

            <footer className="bg-gray-800 text-gray-400 py-8 mt-6">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 CoachFinder 63. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default DashboardClient;
