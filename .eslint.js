module.exports = {
   root: true,
   env: {
     node: true,
   },
   globals: {
     Promise: "readonly"
   },
   parser: "@typescript-eslint/parser",
   parserOptions: {
     sourceType: "module",
     tsconfigRootDir: __dirname,
     project: ["./tsconfig.eslint.json"],
   },
   plugins: ["@typescript-eslint"],
   extends: [
     "eslint:recommended",
     "prettier/@typescript-eslint",
     "plugin:@typescript-eslint/recommended",
     "plugin:@typescript-eslint/recommended-requiring-type-checking",
   ],
 }