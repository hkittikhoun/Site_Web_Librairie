import express from "express";
import mangasRoutes from "./routes/mangas-routes.js";
import usersRoutes from "./routes/users-routes.js";
// Importer le gestionnaire d'erreurs
import errorHandler from "./handler/error-handler.js";
import { connectDB } from "./util/bd.js";

// chercher les variables d'environnement
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/MangaVerse";

// Connexion à MongoDB
await connectDB(MONGODB_URI);

const app = express();

// section des middlewares
// Parse le code entrant pour ajouter une propriété body sur la request
app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173", // Origine locale pour le développement
    "https://foura5-projet-synthese-h25-tp-synthese-t0ao.onrender.com", // Origine déployée
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use("/api/mangas", mangasRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new Error("Route non trouvée");
  error.code = 404;
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("serveur écoute au", `http://localhost:${PORT}`);
});
