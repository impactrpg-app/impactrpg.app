import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@impact/shared": fileURLToPath(new URL("../shared", import.meta.url)),
    },
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
  },
});
