const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack(config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('assets', resolve('src/assets'))
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'http://129.204.43.32:7001',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' //代理的路径
        }
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}