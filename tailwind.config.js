/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    "./src/pages/**/*.{ts,tsx}",
		"./src/components/**/*.{ts,tsx}",
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
			typography: (theme) => ({
				DEFAULT: {
					css: {
						lineHeight: 0,	
						h1: {
							fontSize: theme("fontSize.2xl"),
							fontWeight: theme("fontWeight.bold"),
							marginBottom: theme("spacing.4"),
						},
						h2: {
							fontSize: theme("fontSize.2xl"),
							fontWeight: theme("fontWeight.bold"),
							marginBottom: theme("spacing.4"),
						},
						input: {
							lineHeight: 1,
							marginTop: 0,
							marginBottom: 0,
						},
						p: {
							lineHeight: 1.25,
							marginTop: 0,
							marginBottom: 0,
						},
						li: {
							lineHeight: 1,
							marginTop: 0,
							marginBottom: 0,
						},
						ol: {
							marginTop: 0,
							marginBottom: 0,
							gap: 0,
						},
						ul: {
							lineHeight: 1,
							marginTop: 0,
							marginBottom: 0,
							gap: 0,
						},
						table: {
							marginTop: 0,
							marginBottom: 0,
						},
					},
				},
			}),
      lineHeight: {
        none: '0',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}