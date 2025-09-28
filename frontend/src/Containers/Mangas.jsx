import { useState, useEffect } from "react";
import MangaList from "../components/mangaList/MangaList";

const Mangas = () => {
  const [mangas, setMangas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}api/mangas`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des mangas.");
        }
        const data = await response.json();
        setMangas(data.mangas);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMangas();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return <MangaList items={mangas} />;
};

export default Mangas;
