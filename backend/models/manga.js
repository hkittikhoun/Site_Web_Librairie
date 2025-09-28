import mongoose from "mongoose";

// Modèle de mangas
const mangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  categorie: { type: String, required: true },
  auteur: { type: String, required: true },
  etoiles: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Manga = mongoose.model("Manga", mangaSchema);
export default Manga;
