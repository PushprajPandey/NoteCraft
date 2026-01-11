import { defineConfig } from "vite";
import build from "@hono/vite-build/cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";

export default defineConfig({
  plugins: [
    devServer({
      entry: "src/index.ts",
      adapter,
      exclude: [
        /^\/$/, // Exclude root path so index.html is served
        /^\/index\.html$/,
        /^\/.*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/,
      ],
    }),
    build({
      entry: "src/index.ts",
      output: "dist/_worker.js",
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
