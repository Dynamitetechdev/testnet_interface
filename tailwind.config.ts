import type { Config } from "tailwindcss";
import color from 'tailwindcss/colors'
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      ...color,
     priText: "#E5E5F9",
     secText: "rgba(203, 203, 232, 0.75)",
     border_pri: "rgba(180, 161, 255, 0.08)",
     darkPrimText: "#9895B2",
     paraDarkText: "rgba(206, 206, 251, 0.25)",
     blueish: "#CECEFB",
     priBlue: "#A586FE",
     dappHeaderBorder: "rgba(240, 242, 245, 0.11)",
     dappHeaderBg: "rgba(206, 206, 251, 0.04)",
     selectTabBg: "rgba(206, 206, 251, 0.02)",
     gold: "#70FF87",
     blueBg: "rgba(165, 134, 254, 0.11)"
    }
  },
  plugins: [],
};
export default config;
