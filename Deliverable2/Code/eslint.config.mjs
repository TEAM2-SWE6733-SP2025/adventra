import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import cypress from "eslint-plugin-cypress";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "prettier"],
    plugins: ["prettier"],
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": ["warn"],
      indent: ["error", 2],
      semi: ["error"],
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
      "*.config.js",
      "*.config.mjs",
      "*.d.ts",
      "prisma/migrations/",
      "out/",
      "logs/",
      "*.min.js",
      "*.snap",
    ],
  }),
];

export default eslintConfig;
