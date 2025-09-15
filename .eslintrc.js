module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/html-indent': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attributes-order': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/html-quotes': 'off',
  },
};
