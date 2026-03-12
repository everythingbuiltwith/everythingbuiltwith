import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
  server: {
    port: 3001,
  },
  resolve: {
    tsconfigPaths: true,
    alias: [
      { find: "use-sync-external-store/shim/index.js", replacement: "react" },
    ],
  },
});
