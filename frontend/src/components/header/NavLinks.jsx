import { NavLink, useNavigate } from "react-router-dom"; // Importez useNavigate
import "./NavLinks.css";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const NavLinks = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate(); // Initialisez useNavigate

  const handleLogout = () => {
    auth.logout(); // Déconnecte l'utilisateur
    navigate("/mangas"); // Redirige vers /mangas
  };

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/mangas">CATALOGUE</NavLink>
      </li>

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/login">CONNEXION</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <>
          <li>
            <NavLink to="/collection">COLLECTION</NavLink>
          </li>
          <li>
            <button onClick={handleLogout}>LOGOUT</button>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavLinks;
