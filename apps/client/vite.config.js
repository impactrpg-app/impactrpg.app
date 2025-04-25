import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@impact/shared": fileURLToPath(
        new URL("../../packages/shared/src", import.meta.url)
      ),
    },
  },
  optimizeDeps: {
    exclude: ["@nestjs/swagger"],
  },
  server: {
    hmr: {
      protocol: "ws",
      overlay: false,
      reload: true,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
