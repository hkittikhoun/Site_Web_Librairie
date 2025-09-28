import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Manga from "../models/manga.js";
import HttpError from "../util/http-error.js";

// Récupérer tous les utilisateurs (sans mot de passe)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
  } catch (err) {
    return next(
      new HttpError("Échec lors de la récupération des utilisateurs.", 500)
    );
  }
};

// Récupérer un utilisateur par ID (sans mot de passe)
const getUserById = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId, "-password");
    if (!user) return next(new HttpError("Aucun utilisateur trouvé.", 404));
    res.json({ user: user.toObject({ getters: true }) });
  } catch (err) {
    return next(
      new HttpError("Erreur lors de la récupération de l'utilisateur.", 500)
    );
  }
};

// Enregistrement d’un nouvel utilisateur
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new HttpError("Utilisateur déjà existant, connectez-vous.", 422)
      );
    }

    const createdUser = new User({
      name,
      email,
      password,
      mangas: [],
      panier: [],
    });

    await createdUser.save();
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  } catch (err) {
    return next(new HttpError("Erreur lors de l'inscription.", 500));
  }
};

// Connexion utilisateur
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return next(new HttpError("Email ou mot de passe invalide.", 401));
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "cleSuperSecrete!",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      userId: user.id,
      email: user.email,
      token,
    });
  } catch (err) {
    return next(new HttpError("Erreur lors de la connexion.", 500));
  }
};

// Récupérer le panier d’un utilisateur
const getPanier = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate("panier.manga");
    if (!user) return next(new HttpError("Utilisateur non trouvé.", 404));

    const panier = user.panier.map((item) => ({
      id: item.manga._id,
      name: item.manga.title,
      price: item.manga.price,
      quantity: item.quantity,
    }));

    res.json({ panier });
  } catch (err) {
    console.error("Erreur lors de la récupération du panier :", err);
    return next(
      new HttpError("Erreur lors de la récupération du panier.", 500)
    );
  }
};

// Ajouter un manga au panier
const addToPanier = async (req, res, next) => {
  const userId = req.params.id;
  const { mangaId, quantity } = req.body;

  console.log("Requête reçue pour ajouter au panier :", {
    userId,
    mangaId,
    quantity,
  });

  if (!mangaId) {
    return next(new HttpError("L'ID du manga est manquant.", 400));
  }

  try {
    const user = await User.findById(userId).populate("panier.manga");
    if (!user) {
      console.error("Utilisateur non trouvé :", userId);
      return next(new HttpError("Utilisateur non trouvé.", 404));
    }

    const manga = await Manga.findById(mangaId);
    if (!manga) {
      console.error("Manga non trouvé :", mangaId);
      return next(new HttpError("Manga non trouvé.", 404));
    }

    const item = user.panier.find((el) => el.manga._id.toString() === mangaId);
    if (item) {
      item.quantity += quantity || 1;
    } else {
      user.panier.push({ manga: mangaId, quantity: quantity || 1 });
    }

    await user.save();

    const updatedUser = await User.findById(userId).populate("panier.manga");
    const panier = updatedUser.panier.map((item) => ({
      id: item.manga._id,
      name: item.manga.title,
      price: item.manga.price,
      quantity: item.quantity,
    }));

    console.log("Panier mis à jour :", panier);
    res.status(200).json({ panier });
  } catch (err) {
    console.error("Erreur lors de l’ajout au panier :", err);
    return next(new HttpError("Erreur lors de l’ajout au panier.", 500));
  }
};

// Supprimer tout le panier
const supprimePanier = async (req, res, next) => {
  const userId = req.params.id;

  console.log("Requête reçue pour vider le panier :", { userId });

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error("Utilisateur non trouvé :", userId);
      return next(new HttpError("Utilisateur non trouvé.", 404));
    }

    user.panier = []; // Vide le panier

    await user.save();
    console.log("Panier vidé avec succès !");
    res
      .status(200)
      .json({ message: "Panier vidé avec succès.", panier: user.panier });
  } catch (err) {
    console.error("Erreur lors de la suppression du panier :", err);
    return next(new HttpError("Erreur lors de la suppression du panier.", 500));
  }
};

// Achat des mangas du panier
const acheterPanier = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate("mangas.manga");
    if (!user) return next(new HttpError("Utilisateur non trouvé.", 404));

    for (const item of user.panier) {
      const idManga = item.manga.toString();

      // Vérifiez si le manga existe déjà dans la collection
      const existingManga = user.mangas.find(
        (manga) => manga.manga.toString() === idManga
      );

      if (existingManga) {
        // Si le manga existe, mettez à jour la quantité
        existingManga.quantity += item.quantity;
      } else {
        // Sinon, ajoutez le manga avec la quantité
        user.mangas.push({ manga: idManga, quantity: item.quantity });
      }
    }

    // Videz le panier après l'achat
    user.panier = [];
    await user.save();

    res.status(200).json({ message: "Achat effectué.", mangas: user.mangas });
  } catch (err) {
    console.error("Erreur lors de l’achat :", err);
    return next(new HttpError("Erreur lors de l’achat.", 500));
  }
};

const getCollection = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).populate("mangas.manga");
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé.", 404));
    }

    const collection = user.mangas.map((item) => ({
      id: item.manga._id,
      title: item.manga.title,
      image: item.manga.image,
      categorie: item.manga.categorie,
      auteur: item.manga.auteur,
      etoiles: item.manga.etoiles,
      price: item.manga.price,
      quantity: item.quantity, // Inclure la quantité
    }));

    res.status(200).json({ collection });
  } catch (err) {
    console.error("Erreur lors de la récupération de la collection :", err);
    return next(
      new HttpError("Erreur lors de la récupération de la collection.", 500)
    );
  }
};
export default {
  getUsers,
  getUserById,
  registerUser,
  login,
  getPanier,
  addToPanier,
  supprimePanier,
  acheterPanier,
  getCollection,
};
