import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Avenir Next"', '"Segoe UI"', '"Helvetica Neue"', "sans-serif"],
        body: ['"IBM Plex Sans"', '"Segoe UI"', '"Helvetica Neue"', "sans-serif"],
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 24px 70px rgba(6, 16, 30, 0.45)",
        card: "0 16px 45px rgba(3, 8, 18, 0.28)",
      },
      backgroundImage: {
        "dashboard-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 400ms ease-out both",
      },
    },
  },
  darkMode: ["class"],
  plugins: [],
};

export default config;
