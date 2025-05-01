module.exports = {
  globals: {
    __DEV__: true,
    NodeJS: true,
    JEST_WORKER_ID: true,
  },
  env: {
    es2021: true,
    jest: true,
  },
  extends: ["./shared/core.js", "./shared/typescript.js", "./shared/prettier.js"],
  rules: {
    "import/default": 1,
    "import/order": ["error", { "newlines-between": "always" }],
    "no-duplicate-imports": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_$", argsIgnorePattern: "^_$" }],
    "linebreak-style": ["error", "windows"],
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
      },
    ],
    "max-len": ["error", 120],
  },
};
