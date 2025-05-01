/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: [".eslintrc.cjs"],
  extends: ["@spark/eslint-config/default.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: false,
  },
};
