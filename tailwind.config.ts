import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
        fontFamily: {
            sans: ["var(--font-geist-sans)"],
            mono: ["var(--font-geist-mono)"],
          },
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
         typography: ({ theme }: { theme: any }) => ({ // Add typography plugin configuration
            DEFAULT: {
              css: {
                '--tw-prose-body': theme('colors.foreground'),
                '--tw-prose-headings': theme('colors.primary'),
                '--tw-prose-lead': theme('colors.muted.foreground'),
                '--tw-prose-links': theme('colors.primary'),
                '--tw-prose-bold': theme('colors.foreground'),
                '--tw-prose-counters': theme('colors.muted.foreground'),
                '--tw-prose-bullets': theme('colors.muted.foreground'),
                '--tw-prose-hr': theme('colors.border'),
                '--tw-prose-quotes': theme('colors.foreground'),
                '--tw-prose-quote-borders': theme('colors.border'),
                '--tw-prose-captions': theme('colors.muted.foreground'),
                '--tw-prose-code': theme('colors.foreground'),
                '--tw-prose-pre-code': theme('colors.foreground'),
                '--tw-prose-pre-bg': theme('colors.muted'),
                '--tw-prose-th-borders': theme('colors.border'),
                '--tw-prose-td-borders': theme('colors.border'),
                '--tw-prose-invert-body': theme('colors.background'),
                '--tw-prose-invert-headings': theme('colors.primary.foreground'),
                '--tw-prose-invert-lead': theme('colors.muted.foreground'),
                '--tw-prose-invert-links': theme('colors.primary.foreground'),
                '--tw-prose-invert-bold': theme('colors.background'),
                '--tw-prose-invert-counters': theme('colors.muted.foreground'),
                '--tw-prose-invert-bullets': theme('colors.muted.foreground'),
                '--tw-prose-invert-hr': theme('colors.border'),
                '--tw-prose-invert-quotes': theme('colors.background'),
                '--tw-prose-invert-quote-borders': theme('colors.border'),
                '--tw-prose-invert-captions': theme('colors.muted.foreground'),
                '--tw-prose-invert-code': theme('colors.background'),
                '--tw-prose-invert-pre-code': theme('colors.background'),
                '--tw-prose-invert-pre-bg': theme('colors.muted'),
                '--tw-prose-invert-th-borders': theme('colors.border'),
                '--tw-prose-invert-td-borders': theme('colors.border'),
                // Apply prose styles globally or scope as needed
                'p': {
                  marginTop: theme('spacing.4'),
                  marginBottom: theme('spacing.4'),
                  lineHeight: theme('lineHeight.relaxed'), // Add relaxed line height
                },
                'h1, h2, h3, h4, h5, h6': {
                  marginTop: theme('spacing.6'),
                  marginBottom: theme('spacing.3'),
                },
                // Add more element styling as needed
              },
            },
             sm: { // Add prose-sm configuration
                css: {
                    p: {
                      marginTop: theme('spacing.3'),
                      marginBottom: theme('spacing.3'),
                    },
                    'h1, h2, h3, h4, h5, h6': {
                      marginTop: theme('spacing.5'),
                      marginBottom: theme('spacing.2'),
                    },
                 },
            },
             dark: { // Dark mode prose styles
                 css: {
                     '--tw-prose-body': theme('colors.foreground'),
                     '--tw-prose-headings': theme('colors.primary'),
                     // Add other dark mode overrides as needed
                 },
             },
          }),
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'), // Add typography plugin
    ],
} satisfies Config;
