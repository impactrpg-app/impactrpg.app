import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: [
      "@nestjs/mongoose",
      "@nestjs/swagger",
      "class-validator",
      "mongoose",
    ],
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      external: [
        "@nestjs/mongoose",
        "@nestjs/swagger",
        "class-validator",
        "mongoose",
      ],
    },
  },
});
