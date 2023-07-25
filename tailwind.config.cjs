// @ts-nocheck
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"src/pages/**/*.{ts,tsx}",
		"src/components/**/*.{ts,tsx}",
		"pages/**/*.{ts,tsx}",
		"components/**/*.{ts,tsx}",
		"node_modules/daisyui/dist/**/*.js",
	],
	theme: {
		extend: {
			colors: {
				"rounded-btn": "var(--rounded-btn)",
				"rounded-box": "var(--rounded-box)",
			},
			lineHeight: {
        'none': '0',
      },
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
		},
	},
	// safelist: [...[...Array(50).keys()].flatMap((i) => [`max-w-[${i * 10}px]`])],
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	daisyui: {
		themes: [
			"light",
			"dark",
			"cupcake",
			"bumblebee",
			"emerald",
			"corporate",
			"synthwave",
			"retro",
			"cyberpunk",
			"valentine",
			"halloween",
			"garden",
			"forest",
			"aqua",
			"lofi",
			"pastel",
			"fantasy",
			"wireframe",
			"black",
			"luxury",
			"dracula",
			"cmyk",
			"autumn",
			"business",
			"acid",
			"lemonade",
			"night",
			"coffee",
			"winter",
		],
	},
};
