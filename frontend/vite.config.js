import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: "jsdom", // Pour simuler un environnement DOM
    globals: true, // Pour permettre l'utilisation de `describe`, `it`, `expect` sans les importer
  },
  plugins: [react()],
});
