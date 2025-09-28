import mongoose from "mongoose";
import seedMangas from "./mangaSeeder.js";

let isConnected = false;

export const connectDB = async (db_uri) => {
  if (isConnected) return;
  try {
    await mongoose.connect(db_uri);
    isConnected = true;
    //seedMangas();
    console.log("Connexion MongoDB réussie");
  } catch (err) {
    console.error("Erreur de connexion MongoDB :", err.message);
    process.exit(1); // Arrête le serveur en cas d’échec
  }
};
