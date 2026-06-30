import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        ghost: {
          background: "#05070D",

          surface: "#09121F",

          glass: "rgba(15,25,40,0.55)",

          border: "rgba(0,217,255,0.18)",

          cyan: "#00D9FF",

          cyanGlow: "#3FE8FF",

          core: "#00FFFF",

          ghostRed: "#FF4D6D",

          ghostDark: "#7A001B",

          white: "#F8FAFC"
        }
      },

      backdropBlur: {
        xs: "2px",
        ghost: "20px",
        cinematic: "40px"
      },

      borderRadius: {
        ghost: "24px",
        cinematic: "32px"
      },

      boxShadow: {
        glass:
          "0px 8px 32px rgba(0,0,0,0.35)",

        cyan:
          "0px 0px 30px rgba(0,217,255,0.35)",

        ghost:
          "0px 0px 40px rgba(255,77,109,0.35)",

        core:
          "0px 0px 80px rgba(0,255,255,0.45)"
      },

      animation: {
        float: "float 6s ease-in-out infinite",

        pulseGlow: "pulseGlow 3s ease infinite",

        drift: "drift 20s linear infinite"
      },

      keyframes: {
        float: {
          "0%": {
            transform: "translateY(0px)"
          },
          "50%": {
            transform: "translateY(-10px)"
          },
          "100%": {
            transform: "translateY(0px)"
          }
        },

        pulseGlow: {
          "0%": {
            opacity: "0.4"
          },
          "50%": {
            opacity: "1"
          },
          "100%": {
            opacity: "0.4"
          }
        },

        drift: {
          "0%": {
            transform: "translateX(0px)"
          },
          "100%": {
            transform: "translateX(-100px)"
          }
        }
      }
    }
  },

  plugins: []
};

export default config;