import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@impact/shared": fileURLToPath(new URL("../../packages/shared/src", import.meta.url))
    },
  },
  optimizeDeps: {
    exclude: ["@nestjs/swagger", "class-validator"],
  }
});
