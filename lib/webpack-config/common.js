/*
 * @file builder
 * @author nighca <nighca@live.cn>
 */

const path = require('path')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

const env = require('../env')
const conf = require('../conf')
const paths = require('../paths')

console.info(`env: ${env}`)

module.exports = conf.fetch().then(
  projectConfig => {
    const projectPaths = paths.getPaths(projectConfig)
    const entries = Object.keys(projectConfig.entries).reduce((entries, name) => {
      entries[name] = path.join(projectPaths.root, projectConfig.entries[name])
      return entries
    }, {})

    // original webpack config
    let webpackConfig = {

      entry: entries,

      resolve: {
        extensions: ['.js'],
        modules: [
          projectPaths.src,
          'node_modules'
        ]
      },

      externals: {},

      module: {
        // noParse: [],
        rules: []
      },
      plugins: [],

      output: {
        path: projectPaths.dist,
        filename: 'static/[name]-[hash].js',
        chunkFilename: 'static/[id]-[chunkhash].js',
        publicPath: projectConfig.publicUrl
      }
    }

    // add transforms
    Object.keys(projectConfig.transforms).forEach(extension => {
      webpackConfig = require('./addons/add-transform')(
        webpackConfig,
        extension,
        projectConfig.transforms[extension]
      )
    })

    // gen pages
    webpackConfig = require('./addons/gen-pages')(webpackConfig, projectConfig.pages)

    // configure postcss
    webpackConfig = require('./addons/configure-postcss')(webpackConfig)

    // define env
    webpackConfig = require('./addons/define-env')(webpackConfig, env)

    return webpackConfig
  }
)