import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B0B0B",
        accent: "#FFD700",
        card: "#141414",
        border: "#222222",
        muted: "#A0A0A0"
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
