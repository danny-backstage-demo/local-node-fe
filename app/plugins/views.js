const path = require('path')
const nunjucks = require('nunjucks')
const pkg = require('../../package.json')

module.exports = {
  plugin: require('@hapi/vision'),
  options: {
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)

          return (context) => {
            return template.render(context)
          }
        },
        prepare: (options, next) => {
          options.compileOptions.environment = nunjucks.configure(
            [
              path.join(options.relativeTo || process.cwd(), options.path),
              'node_modules/govuk-frontend/dist/'
            ],
            {
              autoescape: true
            }
          )

          return next()
        }
      }
    },
    path: '../views',
    relativeTo: __dirname,
    context: {
      appVersion: pkg.version,
      assetPath: '/static',
      govukAssetPath: '/assets',
      serviceName: 'local-test-node-fe',
      pageTitle: 'local-test-node-fe - GOV.UK'
    }
  }
}
