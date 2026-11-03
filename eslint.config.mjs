import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'vue/html-self-closing': ['warn',{ html:{ void: 'always'}}],
  },
})