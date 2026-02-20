import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Améliorer la résolution des modules pour éviter les problèmes de chargement
    dedupe: ["react", "react-dom"],
  },
  // Optimisation des dépendances pour un meilleur chargement
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "@tanstack/react-table",
    ],
    // Ne forcer la pré-optimisation qu'en cas de problème
    // force: mode === "development", // Désactivé pour éviter les rebuilds inutiles
  },
  build: {
    // Optimisations pour le code splitting
    rollupOptions: {
      output: {
        // Stratégie de nommage des chunks pour meilleure mise en cache
        chunkFileNames: (chunkInfo) => {
          let facadeModuleId = "chunk";
          if (chunkInfo.facadeModuleId) {
            try {
              const parts = chunkInfo.facadeModuleId.split("/");
              const lastPart = parts[parts.length - 1];
              facadeModuleId = lastPart?.replace(/\.[^/.]+$/, "") || "chunk";
            } catch {
              facadeModuleId = "chunk";
            }
          }
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        // Optimiser le code splitting pour les routes admin
        manualChunks: (id) => {
          // Séparer les dépendances vendor
          if (id.includes("node_modules")) {
            // Chunk séparé pour React et React DOM
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            // Chunk séparé pour React Router
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            // Chunk séparé pour TanStack Query
            if (id.includes("@tanstack/react-query")) {
              return "vendor-query";
            }
            // Chunk séparé pour Supabase
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
            // Chunk séparé pour les UI components (Radix)
            if (id.includes("@radix-ui")) {
              return "vendor-ui";
            }
            // Autres dépendances vendor
            return "vendor";
          }
          // Chunk séparé pour les pages admin (lazy loaded)
          if (id.includes("/pages/admin/")) {
            return "admin-pages";
          }
          // Chunk séparé pour les composants admin
          if (id.includes("/components/admin/")) {
            return "admin-components";
          }
        },
      },
    },
    // Augmenter la taille limite des chunks pour éviter les warnings
    chunkSizeWarningLimit: 1000,
    // Source maps pour le debugging en développement
    sourcemap: mode === "development",
  },
}));
