import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  // DEV server (use Vite's default port)
  server: {
    host: true,          // listen on localhost (and LAN); avoids IPv6-only "::"
    port: 5173,          // NOT 8080 (nginx often occupies that)
    strictPort: true,    // error if 5173 is taken instead of silently changing
    open: true,
  },
  // Preview the production build here (separate port)
  preview: {
    host: true,
    port: 4173,
  },
  base: "/",
}));
