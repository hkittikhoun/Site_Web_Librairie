import mongoose from "mongoose";

// Modèle des utilisateurs
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mangas: [
    {
      manga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manga",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  panier: [
    {
      manga: { type: mongoose.Schema.Types.ObjectId, ref: "Manga" },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
