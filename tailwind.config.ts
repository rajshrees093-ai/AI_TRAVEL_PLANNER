import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#087F8C",
          dark: "#075D66",
          light: "#E6F4F5",
        },
        background: "var(--background)",
        surface: "var(--surface)",
        accent: {
          DEFAULT: "#FF8066",
          hover: "#F26B4E",
          light: "#FFF1EE",
        },
        sand: {
          DEFAULT: "#F5E9D8",
          dark: "#E5D3B8",
        },
        heading: "var(--heading)",
        muted: "var(--muted)",
        border: "var(--border)",
        success: {
          DEFAULT: "#22946B",
          light: "#EAF6F1",
        },
        warning: {
          DEFAULT: "#E8A33D",
          light: "#FDF5E8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(31, 41, 51, 0.06), 0 2px 6px -1px rgba(31, 41, 51, 0.04)",
        elevated: "0 12px 32px -4px rgba(31, 41, 51, 0.10), 0 4px 12px -2px rgba(31, 41, 51, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
