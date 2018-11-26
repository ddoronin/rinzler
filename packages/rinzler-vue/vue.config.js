const webpack = require('webpack');

module.exports = {
  lintOnSave: false,

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}
