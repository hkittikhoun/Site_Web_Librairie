import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { AuthContext } from "../../context/auth-context";

export default function Cart({ cart, updateCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Panier mis à jour :", cart);
  }, [cart]);

  const total = cart
    .reduce((acc, item) => acc + item.quantity * item.price, 0)
    .toFixed(2);

  const clearCart = async () => {
    try {
      console.log("Envoi de la requête pour vider le panier...");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/users/${auth.userId}/panier`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.userToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur du serveur :", errorData);
        throw new Error(
          errorData.message || "Erreur lors de la suppression du panier."
        );
      }

      console.log("Panier vidé avec succès !");
      updateCart([]);
    } catch (err) {
      console.error("Erreur lors de la suppression du panier :", err.message);
    }
  };

  const confirmPurchase = async () => {
    try {
      console.log("Envoi de la requête pour confirmer l'achat...");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/users/${
          auth.userId
        }/panier/acheter`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.userToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur du serveur :", errorData);
        throw new Error(
          errorData.message || "Erreur lors de la confirmation de l'achat."
        );
      }

      console.log("Achat confirmé avec succès !");
      updateCart([]);
      navigate("/collection");
    } catch (err) {
      console.error("Erreur lors de la confirmation de l'achat :", err.message);
    }
  };

  return isOpen ? (
    <div className="lmj-cart">
      <button
        className="lmj-cart-toggle-button"
        onClick={() => setIsOpen(false)}
      >
        Fermer
      </button>
      {cart.length > 0 ? (
        <div>
          <h2>Panier</h2>
          <ul>
            {cart.map(({ id, name, price, quantity }) => (
              <div key={id}>
                <p>{name}</p>
                <p>
                  {price}$ x {quantity}
                </p>
              </div>
            ))}
          </ul>
          <h3>Total : {total}$</h3>
          <button onClick={clearCart}>Vider le panier</button>
          <button onClick={confirmPurchase}>Confirmer votre achat</button>
        </div>
      ) : (
        <div>Votre panier est vide</div>
      )}
    </div>
  ) : (
    <div className="lmj-cart-closed">
      <button
        className="lmj-cart-toggle-button"
        onClick={() => setIsOpen(true)}
      >
        Ouvrir le Panier
      </button>
    </div>
  );
}
