import mongoose from "mongoose";
import Manga from "../models/manga.js";
import { MANGAS } from "../../frontend/src/data/mangaList.js";

const seedMangas = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/MangaVerse");
    console.log("Connexion MongoDB réussie !");

    await Manga.insertMany(
      MANGAS.map((manga) => ({
        title: manga.title,
        image: manga.image,
        categorie: manga.categorie,
        auteur: manga.auteur,
        etoiles: manga.etoiles,
        price: manga.price,
      }))
    );

    console.log("Mangas insérés avec succès !");
    mongoose.connection.close();
  } catch (err) {
    console.error("Erreur lors de l'insertion des mangas :", err);
  }  
};

export default seedMangas;