module.exports = {
  "extends": "ash-nazg/sauron-node",
  "env": {
    "browser": true,
    "es6": true
  },
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  overrides: [
    {
      files: ["*.html"],
      rules: {
        'import/unambiguous': 0
      }
    }
  ],
  "rules": {
    // Disable for now
    'max-len': 0,
    quotes: 0,
    'quote-props': 0,
    'require-unicode-regexp': 0,
    'class-methods-use-this': 0,
    'jsdoc/require-jsdoc': 0
  }
};
