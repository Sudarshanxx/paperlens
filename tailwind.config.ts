// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: {
          base: "#080B14",
          surface: "#0E1220",
          elevated: "#141828",
          card: "#1A2035",
        },
        accent: {
          cyan: "#00E5FF",
          violet: "#7C3AED",
          green: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "pulse-dot": "pulseDot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
