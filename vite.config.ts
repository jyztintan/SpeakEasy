import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import type { Options } from "vite-plugin-open-graph";
import ogPlugin from "vite-plugin-open-graph";

const ogOptions: Options = {
  basic: {
    url: "https://example.com/", // TODO: replace when app is deployed
    title: "SpeakEasy • Speak Freely",
    type: "image.png",
    image: "https://placehold.co/1200x630", // TODO: replace with ogp.jpg
    determiner: "auto",
    description:
      "Immerse yourself in real-world language learning with dynamic, AI-driven conversations tailored to your skill level and interests. Practice speaking confidently in any scenario, anytime.",
    siteName: "SpeakEasy • Speak Freely",
  },
  twitter: {
    image: "https://placehold.co/1200x630",
    imageAlt: "logo",
  },
};

export default defineConfig({
  plugins: [react(), ogPlugin(ogOptions)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
