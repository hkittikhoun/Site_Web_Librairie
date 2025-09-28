import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MangaCard from "./MangaCard";
import { AuthContext } from "../../context/auth-context";
import "@testing-library/jest-dom";

describe("Composant MangaCard", () => {
  it("affiche le titre, l'auteur et la catégorie fournis", () => {
    render(
      <MangaCard
        name="Naruto"
        auteur="Masashi Kishimoto"
        categorie="Shonen"
        etoiles={4.5}
        price={9.99}
        image="https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg"
      />
    );

    expect(screen.getByText("Naruto")).toBeInTheDocument();
    expect(screen.getByText("Auteur : Masashi Kishimoto")).toBeInTheDocument();
    expect(screen.getByText("Catégorie : Shonen")).toBeInTheDocument();
    expect(screen.getByText("Nombre d'étoiles : 4.5 ⭐")).toBeInTheDocument();
  });

  it("affiche le bouton Ajouter si l'utilisateur est connecté", () => {
    render(
      <AuthContext.Provider value={{ isLoggedIn: true }}>
        <MangaCard
          name="Naruto"
          auteur="Masashi Kishimoto"
          categorie="Shonen"
          etoiles={4.5}
          price={9.99}
          image="https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg"
        >
          <button>Ajouter</button>
        </MangaCard>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Ajouter")).toBeInTheDocument();
  });

  it("n'affiche pas le bouton Ajouter si l'utilisateur n'est pas connecté", () => {
    render(
      <AuthContext.Provider value={{ isLoggedIn: false }}>
        <MangaCard
          name="Naruto"
          auteur="Masashi Kishimoto"
          categorie="Shonen"
          etoiles={4.5}
          price={9.99}
          image="https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg"
        />
      </AuthContext.Provider>
    );

    expect(screen.queryByText("Ajouter")).not.toBeInTheDocument();
  });
});
