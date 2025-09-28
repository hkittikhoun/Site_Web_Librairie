import Icon from "../mangaIcon/Icon";
import Card from "../mangaIcon/Card";
import "./MangaCard.css";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
//import { Link } from "react-router-dom";

const MangaCard = (props) => {
  const auth = useContext(AuthContext);

  return (
    <li className="game-item">
      <Card className="game-item__content">
        <div className="game-item__image">
          <Icon image={props.image} alt={props.name} />
        </div>
        <div className="game-item__info">
          <h3>{props.name}</h3>
          <p>Catégorie : {props.categorie}</p>
          <p>Auteur : {props.auteur}</p>
          <p>Nombre d&apos;étoiles : {props.etoiles} ⭐</p>
        </div>
        {auth.isLoggedIn && <div>{props.children}</div>}
      </Card>
    </li>
  );
};

export default MangaCard;
