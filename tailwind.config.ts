import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        breathing: {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 18px rgba(220, 38, 38, 1))' },
        },
      },
      animation: {
        breathing: 'breathing 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
