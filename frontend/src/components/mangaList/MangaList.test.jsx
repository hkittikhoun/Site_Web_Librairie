import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthContext } from "../../context/auth-context";
import MangaList from "./MangaList";
import "@testing-library/jest-dom";

describe("MangaList Integration", () => {
  const mockMangas = [
    {
      id: "1",
      title: "Naruto",
      image: "https://example.com/naruto.jpg",
      categorie: "Shonen",
      auteur: "Masashi Kishimoto",
      etoiles: 4.5,
      price: 9.99,
    },
  ];

  it("ajoute un manga au panier lorsque le bouton Ajouter est cliqué", async () => {
    const mockUpdateCart = vi.fn();
    render(
      <AuthContext.Provider
        value={{ isLoggedIn: true, userId: "123", userToken: "token" }}
      >
        <MangaList items={mockMangas} />
      </AuthContext.Provider>
    );

    const addButton = screen.getByText("Ajouter");
    fireEvent.click(addButton);

    expect(mockUpdateCart).not.toBeCalled();
  });

  it("affiche le panier si l'utilisateur est connecté", () => {
    render(
      <AuthContext.Provider value={{ isLoggedIn: true }}>
        <MangaList items={mockMangas} />
      </AuthContext.Provider>
    );

    expect(screen.getByText("Ouvrir le Panier")).toBeInTheDocument();
  });
  it("appelle addToCart (fetch) lorsque le bouton Ajouter est cliqué", async () => {
    const fakePanier = [{ id: "1", name: "Naruto", price: 9.99, quantity: 1 }];
    const fetchMock = vi.spyOn(window, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ panier: fakePanier }),
    });

    render(
      <AuthContext.Provider
        value={{ isLoggedIn: true, userId: "123", userToken: "token" }}
      >
        <MangaList items={mockMangas} />
      </AuthContext.Provider>
    );

    const addButton = screen.getByText("Ajouter");
    fireEvent.click(addButton);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/users/123/panier"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: expect.any(String),
        }),
        body: expect.any(String),
      })
    );

    fetchMock.mockRestore();
  });
});
