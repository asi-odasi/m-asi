import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F5FAFD",
          100: "#E8F4FB",
          200: "#D3E9F6",
          300: "#B8DCF0",
          400: "#9CCEEA",
          500: "#7FBFE3",
          600: "#63A6CC",
          700: "#4C86A8",
          text: "#1F2937",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
