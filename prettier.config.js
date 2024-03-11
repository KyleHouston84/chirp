/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  arrowParens: 'avoid',
  bracketSpacing: true,
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  jsxBracketSameLine: false,
  jsxSingleQuote: true,
  printWidth: 80,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
}

export default config
