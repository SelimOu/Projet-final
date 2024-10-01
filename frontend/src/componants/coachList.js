import React, { useEffect, useState } from "react";
import axios from "axios";


const CoachList = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get("https://projet-final-jvgt.onrender.com/api/users");

        const filteredCoaches = response.data.filter(user => user.role === "coach");
        const lastThreeCoaches = filteredCoaches.slice(-3);
        setCoaches(lastThreeCoaches);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Erreur: {error}</p>;
  }





  return (
    <div>
      <h2 className="text-2xl font-bold mt-6 mb-6 text-center">Nos 3 derniers Coachs partenaires:</h2>
      {coaches.length === 0 ? (
        <p className="text-center">Aucun coach trouvé.</p>
      ) : (
        <div className="flex flex-wrap pb-5 justify-center lg:flex-nowrap gap-6 pl-4 pr-4" >
          {coaches.map((coach) => (
            <div key={coach.id} className="coach-card  bg-white rounded-lg shadow-md p-4 flex flex-col items-center w-full lg:w-1/3 ">
              <img
                src={`https://projet-final-jvgt.onrender.com/storage/${coach.image}`}
                alt={`${coach.name}`}
                className="w-48 h-48 object-cover rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{coach.name}</h3>
              <p className="text-gray-600">Tarif /h : {coach.price} €</p>
              <p className="text-gray-900">
                Spécialités : {coach.goals.map(goal => goal.name).join(', ')}
              </p>
            </div>
          ))}
        </div>

      )}
      <div className=" font-bold mt-6 mb-6 text-center"><a
        href="/login"
        className="bg-blue-900 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-900"
      >
        Connectez vous pour ne voir plus
      </a>
      </div>
    </div>
  )
}

export default CoachList;
