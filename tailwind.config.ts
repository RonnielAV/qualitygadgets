import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          ultraviolet: "#9D00FF",
          cyan: "#00D2FF",
          magenta: "#E024C3",
          indigo: "#241442",
        },
        dark: {
          obsidian: "#08070D",
          surface: "#121124",
          elevated: "#1A1833",
          border: "#2B264A",
          borderGlow: "rgba(157, 0, 255, 0.35)",
        },
        text: {
          pure: "#F8FAFC",
          muted: "#94A3B8",
          inverse: "#08070D",
        },
      },
      boxShadow: {
        "glow-purple": "0 0 25px rgba(157, 0, 255, 0.45)",
        "glow-cyan": "0 0 25px rgba(0, 210, 255, 0.45)",
        "glow-magenta": "0 0 25px rgba(224, 36, 195, 0.45)",
        "glow-subtle": "0 0 15px rgba(157, 0, 255, 0.25)",
      },
      backgroundImage: {
        "logo-gradient": "linear-gradient(135deg, #00D2FF 0%, #9D00FF 50%, #E024C3 100%)",
        "btn-gradient": "linear-gradient(90deg, #9D00FF 0%, #E024C3 100%)",
        "surface-gradient": "linear-gradient(180deg, rgba(18, 17, 36, 0.85) 0%, rgba(8, 7, 13, 0.95) 100%)",
        "cyan-purple-gradient": "linear-gradient(135deg, #00D2FF 0%, #9D00FF 100%)",
      },
      animation: {
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
