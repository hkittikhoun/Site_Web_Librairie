/* eslint-disable react-hooks/exhaustive-deps */
import MangaCard from "../mangaCard/MangaCard";
import Cart from "../cart/Cart";
import { useState, useEffect } from "react";
import "./MangaList.css";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const MangaList = ({ items }) => {
  const auth = useContext(AuthContext);
  const [cart, updateCart] = useState([]);

  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchCart();
    }
  }, [auth.isLoggedIn]);

  const fetchCart = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/users/${auth.userId}/panier`,
        {
          headers: {
            Authorization: `Bearer ${auth.userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du panier.");
      }

      const data = await response.json();
      console.log("Données du panier reçues :", data.panier); // Vérifiez les données ici
      updateCart(data.panier || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addToCart = async (mangaId) => {
    console.log("Ajout au panier :", { userId: auth.userId, mangaId });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/users/${auth.userId}/panier`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.userToken}`,
          },
          body: JSON.stringify({ mangaId, quantity: 1 }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur du serveur :", errorData);
        throw new Error(
          errorData.message || "Erreur lors de l'ajout au panier."
        );
      }

      const data = await response.json();
      console.log("Panier mis à jour :", data.panier);
      updateCart(data.panier || []); // Met à jour le panier avec les données complètes
    } catch (err) {
      console.error("Erreur lors de l'ajout au panier :", err.message);
    }
  };

  if (!items || items.length === 0) {
    return <h2 className="manga-list__vide">Aucun manga trouvé.</h2>;
  }

  return (
    <>
      {auth.isLoggedIn && (
        <Cart className="panier" cart={cart} updateCart={updateCart} />
      )}
      <ul className="manga-list">
        {items.map((manga) => (
          <MangaCard
            key={manga.id}
            id={manga.id}
            name={manga.title}
            image={manga.image}
            categorie={manga.categorie || "Inconnu"}
            auteur={manga.auteur || "Inconnu"}
            etoiles={manga.etoiles || 0}
            price={manga.price || 0}
          >
            <button
              className="bouton-ajouter"
              onClick={() => addToCart(manga.id)}
            >
              Ajouter
            </button>
          </MangaCard>
        ))}
      </ul>
    </>
  );
};

export default MangaList;
