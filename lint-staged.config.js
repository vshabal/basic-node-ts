const path = require('path');

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;
const buildTypescriptCommand = () => 'tsc --noEmit';
const prettierCommand = 'prettier --write --ignore-unknown';
module.exports = {
  '**/*.ts': [prettierCommand, buildEslintCommand, buildTypescriptCommand],
};
