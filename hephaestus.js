'use strict'

const { agartha } = require('hephaestus')
const appUrl = agartha.get('ROSIE_APP_URL')
const appRoot = agartha.get('ROSIE_APP_ROOT')
const provider = agartha.get('ROSIE_PROVIDER')

module.exports = exports = {
  appName: 'The Real Rosie the Riveter Project',
  shortName: 'rosie',
  appUrl: (appUrl) ? appUrl : 'http://127.0.0.1:8080',
  appRoot:  (appRoot) ? appRoot : 'http://127.0.0.1:8080',
  relic: 'scaffold',
  version: '0.0.1',
  hephaestus: '2.0.0',
  provider: provider
}
