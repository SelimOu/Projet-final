import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../componants/header";
import Footer from "../componants/footer";
import { useNavigate } from "react-router-dom";


const DashboardClient = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [specialtyFilter, setSpecialtyFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 4;
    const [userRole, setUserRole] = useState("");
    const [userGoals, setUserGoals] = useState([]);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');

                const userResponse = await axios.get(`https://projet-final-jvgt.onrender.com/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const userData = userResponse.data;
                setUserRole(userData.role);

                const goalIds = userData.goals.map(goal => goal.id);
                setUserGoals(goalIds);

                const allUsersResponse = await axios.get("https://projet-final-jvgt.onrender.com/api/users", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const allUsers = allUsersResponse.data;

                let relevantUsers;
                if (userData.role === "coach") {
                    relevantUsers = allUsers.filter(user =>
                        user.role === "client" && user.goals.some(goal => goalIds.includes(goal.id))
                    );
                } else {
                    relevantUsers = allUsers.filter(user => user.role === "coach");
                }

                setUsers(relevantUsers);
                setFilteredUsers(relevantUsers);

                const uniqueSpecialties = [...new Set(relevantUsers.flatMap(user => user.goals.map(goal => goal.name)))];
                setSpecialties(uniqueSpecialties);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSpecialtyChange = (event) => {
        setSpecialtyFilter(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPriceFilter(event.target.value);
    };

    const handleCityChange = (event) => {
        setCityFilter(event.target.value);
    };

    useEffect(() => {
        let filtered = users;

        if (userRole !== "coach") {
            if (specialtyFilter) {
                filtered = filtered.filter(user =>
                    user.goals && user.goals.some(goal =>
                        goal.name.toLowerCase().includes(specialtyFilter.toLowerCase())
                    )
                );
            }

            if (priceFilter) {
                const priceValue = parseFloat(priceFilter);
                filtered = filtered.filter(user => {
                    const userPrice = parseFloat(user.price || 0);
                    return userPrice <= priceValue;
                });
            }

            if (cityFilter) {
                filtered = filtered.filter(user =>
                    user.city && user.city.toLowerCase().includes(cityFilter.toLowerCase())
                );
            }
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);

    }, [specialtyFilter, priceFilter, cityFilter, users, userRole]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
        return (
            <div className="h-screen flex justify-center items-center" style={{ backgroundImage: `url('/imageflou.png')` }}>
                <div>
                    <img
                        className=" animate-spin m-auto w-3/5 "
                        src="CoachTracker.png"
                        alt="logo"
                    />
                    <p className="text-center text-white text-4xl">Chargement ...</p>
                </div>
            </div>
        );
    }

    if (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
        alert("Session expirée, veuillez vous reconnecter.");

    }

    return (
        <div>
            <Header />
            <div className="flex flex-col items-center justify-center bg-cover bg-center h-screen" style={{ backgroundImage: `url('/imageDashClient.jpg')` }}>
                <h2 className="text-5xl font-bold pb-5 mb-6 text-center text-white lg:text-7xl">
                    {userRole === 'coach' ? 'Tous les Clients qui cherchent votre spécialité' : 'Tous les Coachs'}
                </h2>
            </div>

            {userRole !== 'coach' && (
                <div className="filters mb-6 mt-9 flex justify-center gap-4 m-11">
                    <div>
                        <label htmlFor="select" className="block mb-2">Filtrer par spécialité:</label>
                        <select id="select"
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
                    <div>
                        <label className="block mb-2">Filtrer par ville:</label>
                        <input
                            type="text"
                            value={cityFilter}
                            onChange={handleCityChange}
                            placeholder="Ville"
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                </div>
            )}

            {currentUsers.length === 0 ? (
                <p className="text-center">{userRole === 'coach' ? 'Aucun client trouvé.' : 'Aucun coach trouvé.'}</p>
            ) : (
                <div className="flex flex-wrap justify-center mt-10 gap-6">
                    {currentUsers.map((user) => (
                        <div key={user.id} className="coach-card bg-white rounded-lg shadow-md p-4 flex flex-col items-center w-full lg:w-1/3">
                            <img
                                src={`${user.image}`}
                                alt={user.name}
                                className="w-48 h-48 object-cover rounded-full mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                            <p className="text-gray-900">Prix : {user.price} €</p>
                            {user.role === 'coach' ? 'Spécialités' : 'Objectifs'} : {user.goals.map(goal => goal.name).join(', ')}
                            <p className="text-gray-900">Numéro : {user.numero}</p>
                            <p className="text-gray-900">Mail : {user.email}</p>

                            {user.role === 'coach' && (
                                <>
                                    <p className="text-gray-900">Ville : {user.city}</p>
                                    {user.schedule && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold">Horaires :</h4>
                                            <p>{`Du ${user.schedule.day_start} au ${user.schedule.day_end} de ${user.schedule.hour_start} à ${user.schedule.hour_end}`}</p>
                                        </div>
                                    )}
                                </>
                            )}
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
            <Footer />

        </div>
    );
};

export default DashboardClient;
