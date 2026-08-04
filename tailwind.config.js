/**
 * Tailwind config for NativeWind v4.
 *
 * Colors are the CSS-side mirror of the single design-token source in
 * `src/theme/tokens.ts`. They are defined as CSS variables in `src/global.css`
 * (light + dark) and referenced here as `rgb(var(--x) / <alpha-value>)` so that
 * opacity utilities (e.g. `bg-primary/50`) keep working. Keep the two in sync —
 * both are "the theme"; there are no hard-coded colors in component code.
 *
 * @type {import('tailwindcss').Config}
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spacing, radius, fontSize } = require('./src/theme/scale');

const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withVar('--color-primary'),
          hover: withVar('--color-primary-hover'),
          pressed: withVar('--color-primary-pressed'),
          foreground: withVar('--color-primary-foreground'),
          subtle: withVar('--color-primary-subtle'),
        },
        accent: {
          DEFAULT: withVar('--color-accent'),
          subtle: withVar('--color-accent-subtle'),
        },
        background: withVar('--color-background'),
        surface: withVar('--color-surface'),
        card: withVar('--color-card'),
        border: withVar('--color-border'),
        'border-strong': withVar('--color-border-strong'),
        foreground: withVar('--color-foreground'),
        muted: withVar('--color-muted'),
        subtle: withVar('--color-subtle'),
        inverse: withVar('--color-inverse'),
        success: {
          DEFAULT: withVar('--color-success'),
          subtle: withVar('--color-success-subtle'),
        },
        warning: {
          DEFAULT: withVar('--color-warning'),
          subtle: withVar('--color-warning-subtle'),
        },
        danger: {
          DEFAULT: withVar('--color-danger'),
          subtle: withVar('--color-danger-subtle'),
        },
        info: {
          DEFAULT: withVar('--color-info'),
          subtle: withVar('--color-info-subtle'),
        },
      },
      spacing,
      borderRadius: radius,
      fontSize,
    },
  },
  plugins: [],
};
