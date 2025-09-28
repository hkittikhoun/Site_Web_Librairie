import HttpError from "../util/http-error.js";
import { validationResult } from "express-validator";
import Manga from "../models/manga.js";

// Récupérer tous les mangas
const getMangas = async (req, res, next) => {
  let mangas;
  try {
    mangas = await Manga.find();
  } catch (err) {
    return next(
      new HttpError("Erreur lors de la récupération des mangas.", 500)
    );
  }

  res.json({
    mangas: mangas.map((manga) => manga.toObject({ getters: true })),
  });
};

// Récupérer un manga par ID
const getMangaById = async (req, res, next) => {
  const mangaId = req.params.mid;

  let manga;
  try {
    manga = await Manga.findById(mangaId);
  } catch (err) {
    return next(new HttpError("Erreur lors de la récupération du manga.", 500));
  }

  if (!manga) {
    return next(new HttpError("Manga non trouvé.", 404));
  }

  res.json({ manga: manga.toObject({ getters: true }) });
};

// Créer un manga
const createManga = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(new HttpError("Données invalides.", 422));
  }

  const { title, image, categorie, auteur, etoiles, price } = req.body;

  const createdManga = new Manga({
    title,
    image,
    categorie,
    auteur,
    etoiles,
    price,
  });

  try {
    await createdManga.save();
  } catch (err) {
    return next(new HttpError("Erreur lors de la création du manga.", 500));
  }

  res.status(201).json({ manga: createdManga });
};

// Mettre à jour un manga
const updateManga = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(new HttpError("Données invalides.", 422));
  }

  const mangaId = req.params.mid;
  const { title, image, categorie, auteur, etoiles, price } = req.body;

  let manga;
  try {
    manga = await Manga.findById(mangaId);
  } catch (err) {
    return next(new HttpError("Erreur lors de la mise à jour du manga.", 500));
  }

  if (!manga) {
    return next(new HttpError("Manga non trouvé.", 404));
  }

  manga.title = title || manga.title;
  manga.image = image || manga.image;
  manga.categorie = categorie || manga.categorie;
  manga.auteur = auteur || manga.auteur;
  manga.etoiles = etoiles || manga.etoiles;
  manga.price = price || manga.price;

  try {
    await manga.save();
  } catch (err) {
    return next(new HttpError("Erreur lors de la mise à jour du manga.", 500));
  }

  res.status(200).json({ manga: manga.toObject({ getters: true }) });
};

// Supprimer un manga
const deleteManga = async (req, res, next) => {
  const mangaId = req.params.mid;

  let manga;
  try {
    manga = await Manga.findById(mangaId);
  } catch (err) {
    return next(new HttpError("Erreur lors de la suppression du manga.", 500));
  }

  if (!manga) {
    return next(new HttpError("Manga non trouvé.", 404));
  }

  try {
    await manga.deleteOne();
  } catch (err) {
    return next(new HttpError("Erreur lors de la suppression du manga.", 500));
  }

  res.status(200).json({ message: "Manga supprimé avec succès." });
};

export default {
  getMangas,
  getMangaById,
  createManga,
  updateManga,
  deleteManga,
};
