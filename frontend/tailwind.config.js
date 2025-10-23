/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      // Typography - Custom Font Families
      fontFamily: {
        'sans': ['Satoshi', 'Inter', 'system-ui', 'sans-serif'], // Primary font stack
        'primary': ['Satoshi', 'system-ui', 'sans-serif'],       // Primary font (Satoshi)
        'secondary': ['Inter', 'system-ui', 'sans-serif'],       // Secondary font (Inter)
        'logo': ['Satoshi', 'Space Grotesk', 'system-ui', 'sans-serif'], // Logo typeface
      },
      // Brand color palette
      colors: {
        'brand': {
          'primary': '#00FFC6',        // Teal-aqua liquidity glow
          'secondary': '#151A21',      // Dark navy for background
          'accent': '#6F00FF',         // Cross-chain energy gradient
          'neutral-light': '#F8FAFC',  // Fog White
          'neutral-dark': '#1E293B',   // Graphite
        }
      },
      // Gradient for cross-chain energy
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #00FFC6 0%, #6F00FF 100%)',
        'brand-secondary': 'linear-gradient(90deg, #00E0FF 0%, #00FFA3 100%)',
      },
      // Backdrop blur for surface cards
      backdropBlur: {
        'surface': '20px',
      },
      // Keep only essential extensions that don't conflict with DaisyUI
      spacing: {
        7.5: "1.875rem",
        3.5: "0.875rem",
        2.5: "0.625rem",
      },
      fontSize: {
        "2sm": ["0.8125rem", "1.125rem"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#2563eb",
          secondary: "#7c3aed",
          accent: "#06b6d4",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          info: "#3abff8",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: false, // Reduced console noise
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
  plugins: [require("daisyui")],
};
