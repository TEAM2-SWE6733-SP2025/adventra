import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "eslint:recommended",
      "next",
      "plugin:prettier/recommended",
    ],
    plugins: ["prettier"],
    env: {
      browser: true,
      node: true,
      jest: true,
      cypress: true,
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
      "no-console": "warn",
      indent: ["error", 2],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
    },
    ignorePatterns: [
      ".next/",
      "node_modules/",
      "dist/",
      "coverage/",
      "public/",
      "cypress/",
      "*.config.js",
      "*.config.mjs",
      "*.d.ts",
      "prisma/migrations/",
      "out/",
      "logs/",
      "*.min.js",
      "*.snap",
      "___deliverables/",
    ],
  }),
];

export default eslintConfig

// Below is the commented code for reference
// import js from '@eslint/js'
// import { FlatCompat } from '@eslint/eslintrc'

// const compat = new FlatCompat({
//   // import.meta.dirname is available after Node.js v20.11.0
//   baseDirectory: import.meta.dirname,
//   recommendedConfig: js.configs.recommended,
// })

// const eslintConfig = [
//   ...compat.config({
//     extends: ['eslint:recommended', 'next'],
//   }),
// ]

// export default eslintConfig