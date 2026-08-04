/**
 * Primitive numeric scales — the single source of truth shared by both the
 * TypeScript theme (`src/theme/tokens.ts`, imported) and the Tailwind config
 * (`tailwind.config.js`, required). Authored in CommonJS so Tailwind's Node
 * config can `require` it without a TS loader. No scale value is duplicated.
 */

/** Spacing scale (in px). Matches the spec: xs, sm, md, lg, xl, 2xl (+ finer). */
const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

/** Border-radius scale. Matches the spec: small, medium, large, xl, pill. */
const radius = {
  none: 0,
  small: 6,
  medium: 10,
  large: 16,
  xl: 24,
  pill: 999,
  full: 9999,
};

/** Font-size scale as [size, lineHeight] tuples (Tailwind format). */
const fontSize = {
  caption: ['12px', '16px'],
  small: ['13px', '18px'],
  body: ['15px', '22px'],
  button: ['15px', '20px'],
  subtitle: ['17px', '24px'],
  title: ['20px', '28px'],
  heading: ['28px', '34px'],
  display: ['34px', '40px'],
};

module.exports = { spacing, radius, fontSize };
