const buildEslintCommand = (filenames) => `eslint --fix ${filenames.join(" ")}`;

const buildPrettierCommand = (filenames) =>
  `prettier ${filenames.join(" ")} -w`;

export default {
  "**/*.{js,ts}": [buildEslintCommand],
  "**/*.{js,ts,md,html,css}": [buildPrettierCommand],
};
