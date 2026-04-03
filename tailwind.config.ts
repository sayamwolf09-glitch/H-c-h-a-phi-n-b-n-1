import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        chem: {
          primary: "#2563EB",
          secondary: "#06B6D4",
          accent: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          background: "#F8FAFC",
          surface: "#FFFFFF",
          text: "#0F172A",
          muted: "#64748B",
          border: "#E2E8F0"
        }
      },
      borderRadius: {
        xl: "1rem"
      },
      boxShadow: {
        card: "0 10px 30px rgba(37, 99, 235, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
