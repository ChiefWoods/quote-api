import globals from "globals";
import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{js,ts}"],
    ignores: ["**/*.json", "**/*.d.ts", "bruno"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      indent: [
        "warn",
        2,
        {
          SwitchCase: 1,
          FunctionDeclaration: {
            body: 1,
            parameters: 1,
          },
          FunctionExpression: {
            body: 1,
            parameters: 1,
          },
          CallExpression: {
            arguments: 1,
          },
        },
      ],
      quotes: [
        "warn",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      semi: ["warn", "always"],
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "_",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "_",
        },
      ],
      "comma-dangle": ["warn", "always-multiline"],
    },
  },
);
