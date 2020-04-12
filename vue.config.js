const path = require('path')
const SOURCE_MAP_FLAG = process.env.NODE_ENV === 'production' ? false : true
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack(config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('assets', resolve('src/assets'))
  },
  productionSourceMap:SOURCE_MAP_FLAG,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://129.204.43.32:7002/api',
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