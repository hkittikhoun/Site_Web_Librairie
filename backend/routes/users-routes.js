import express from "express";
import usersController from "../controllers/users-controller.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/user/:uid", usersController.getUserById);

// Routes pour le panier
router.get("/:id/collection", checkAuth, usersController.getCollection);
router.get("/:id/panier", checkAuth, usersController.getPanier);
router.post("/:id/panier", checkAuth, usersController.addToPanier);
router.delete("/:id/panier", checkAuth, usersController.supprimePanier);
router.post("/:id/panier/acheter", checkAuth, usersController.acheterPanier);

router.post("/register", usersController.registerUser);
router.post("/login", usersController.login);

export default router;
