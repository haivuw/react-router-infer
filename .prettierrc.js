/**  @type {import('prettier').Config} */
const config = {
  plugins: ['./node_modules/prettier-plugin-jsdoc/dist/index.js'],
  semi: false,
  jsxSingleQuote: true,
  singleQuote: true,
  experimentalTernaries: true,
}

export default config
