const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    T_unten: '16',
    T_oben: '19'
  }
})