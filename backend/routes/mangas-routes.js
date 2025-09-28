import express from "express";
import { check } from "express-validator";
import mangaController from "../controllers/mangas-controller.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

// Middleware pour obtenir tous les jeux
router.get("/", mangaController.getMangas);

// Middleware pour obtenir un jeu par ID
router.get("/:mid", mangaController.getMangaById);

// Middleware pour créer un manga
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("image").not().isEmpty(),
    check("category").not().isEmpty(),
    check("author").not().isEmpty(),
    check("stars").isNumeric(),
    check("price").isNumeric(),
    checkAuth,
  ],
  mangaController.createManga
);

// Middleware pour mettre à jour un manga par ID
router.patch("/:mid", checkAuth, mangaController.updateManga);

// Middleware pour supprimer un manga par ID
router.delete("/:mid", checkAuth, mangaController.deleteManga);

export default router;
