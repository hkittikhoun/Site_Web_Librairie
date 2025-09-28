import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import MangaCard from "../mangaCard/MangaCard";
import "./Collection.css";

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}api/users/${auth.userId}/collection`,
          {
            headers: {
              Authorization: `Bearer ${auth.userToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la collection.");
        }

        const data = await response.json();
        setCollection(data.collection || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCollection();
  }, [auth.userId, auth.userToken]);

  if (error) {
    return <p>{error}</p>;
  }

  // Calculer la quantité totale et le prix total
  const totalQuantity = collection.reduce(
    (acc, manga) => acc + (manga.quantity || 1),
    0
  );
  const totalPrice = collection
    .reduce((acc, manga) => acc + manga.price * (manga.quantity || 1), 0)
    .toFixed(2);

  return (
    <div>
      <h2>Votre Collection</h2>
      <p>Quantité totale : {totalQuantity}</p>
      <p>Prix total : {totalPrice} $</p>
      <div className="manga-collection">
        {collection.map((manga) => (
          <MangaCard
            key={manga.id}
            name={manga.title}
            image={manga.image}
            categorie={manga.categorie || "Inconnu"}
            auteur={manga.auteur || "Inconnu"}
            etoiles={manga.etoiles || 0}
            price={manga.price || 0}
          >
            <p>Quantité : {manga.quantity || 1}</p>
            <p>Total : {(manga.price * (manga.quantity || 1)).toFixed(2)} $</p>
          </MangaCard>
        ))}
      </div>
    </div>
  );
};

export default Collection;
