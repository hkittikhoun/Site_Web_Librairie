import { useState, useContext } from "react";
import "./LoginForm.css";
import ModalMessageErreur from "../UIElements/ModalMessageErreur";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

export default function LoginForm() {
  const auth = useContext(AuthContext);
  const [entredValues, setEntredValues] = useState({
    user: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (identifier, value) => {
    setEntredValues((prevValue) => ({
      ...prevValue,
      [identifier]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!entredValues.user.trim() || !entredValues.password.trim()) {
      setErrorMessage(
        "Veuillez remplir tous les champs avant de vous connecter."
      );
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: entredValues.user,
            password: entredValues.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la connexion.");
      }

      const responseData = await response.json();
      console.log("Connexion réussie :", responseData);

      auth.login(responseData.userId, responseData.token);
      navigate("/mangas");
    } catch (err) {
      setErrorMessage(err.message);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setErrorMessage(null);
  };

  return (
    <>
      {showModal && (
        <ModalMessageErreur message={errorMessage} onClose={closeModal} />
      )}
      <form onSubmit={handleSubmit}>
        <h2>Connexion🚀</h2>

        <div className="control-row">
          <div className="control">
            <label htmlFor="email">Courriel</label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={(event) =>
                handleInputChange("user", event.target.value)
              }
              placeholder="Entrez votre courriel"
            />
          </div>
        </div>

        <hr />

        <div className="control-row">
          <div className="control">
            <label htmlFor="password">Mot De Passe</label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={(event) =>
                handleInputChange("password", event.target.value)
              }
              placeholder="Entrez votre mot de passe"
            />
          </div>
        </div>

        <p className="form-actions">
          <button className="button">Se connecter</button>
          <Link to="/subscribe" className="button">
            S&apos;inscrire
          </Link>
        </p>
      </form>
    </>
  );
}
