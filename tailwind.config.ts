import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-inter)", "Inter", "sans-serif"],
    },
    extend: {
      fontSize: {
        simple: ["14px", { fontWeight: "900" }],
        bold: ["16px", { fontWeight: "700" }],
        description: ["14px", { fontWeight: "900" }],
        accent: ["12px", { fontWeight: "600", color: "#374151" }],
        stat: [
          "30px",
          {
            fontWeight: "700",
            lineHeight: "1",
          }
        ],
        statDescription: [
          "14px",
          {
            fontWeight: "900",
            lineHeight: "1.25",
          }
        ],
        statSubtext: [
          "12px",
          {
            fontWeight: "600",
            lineHeight: "1",
            color: "#374151"
          }
        ]
      },
      backgroundImage: {
        "allura-pattern": "url('/allura-logo.svg')",
      },
      backgroundSize: {
        "allura-tile": "20px 20px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "theme-light": {
          bg: "#ffffff",
          "bg-secondary": "#f8fafc",
          "bg-tertiary": "#f1f5f9",
          text: "#0f172a",
          "text-secondary": "#475569",
          "text-muted": "#64748b",
          border: "#e2e8f0",
          "border-light": "#f1f5f9",
          accent: "#8b5cf6",
          "accent-hover": "#7c3aed",
        },
        button: {
          DEFAULT: "#ffffff",
          hover: "#f5f3ff",
          active: "#8b5cf6",
          text: "#0f172a",
          "text-active": "#ffffff",
          border: "#e5e7eb",
          "border-active": "#8b5cf6",
          borderRadius: "calc(var(--radius) - 4px)",
          dark: {
            DEFAULT: "#374151",
            hover: "#7c3aed",
            active: "#8b5cf6",
            text: "#ffffff",
            "text-active": "#ffffff",
            border: "#4b5563",
            "border-active": "#8b5cf6",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        DEFAULT: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
