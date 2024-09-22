import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import type { Options } from "vite-plugin-open-graph";
import ogPlugin from "vite-plugin-open-graph";
import { VitePluginRadar } from "vite-plugin-radar";

const ogOptions: Options = {
  basic: {
    url: "https://speakeasy-speakfreely.netlify.app/",
    title: "SpeakEasy • Speak Freely",
    type: "image.png",
    image: "https://speakeasy-speakfreely.netlify.app/ogp.jpg",
    determiner: "auto",
    description:
      "Immerse yourself in real-world language learning with dynamic, AI-driven conversations tailored to your skill level and interests. Practice speaking confidently in any scenario, anytime.",
    siteName: "SpeakEasy • Speak Freely",
  },
  twitter: {
    image: "https://speakeasy-speakfreely.netlify.app/ogp.jpg",
    imageAlt: "logo",
  },
};

export default defineConfig({
  plugins: [
    react(),
    ogPlugin(ogOptions),
    VitePluginRadar({
      analytics: {
        id: "G-2EFH93KCYW",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
