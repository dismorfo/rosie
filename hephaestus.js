'use strict';

const { get } = require('hephaestus');
const appUrl = get('ROSIE_APP_URL');
const appRoot = get('ROSIE_APP_ROOT');
const provider = get('ROSIE_PROVIDER');

module.exports = {
  appName: 'The Real Rosie the Riveter Project',
  shortName: 'rosie',
  appUrl: (appUrl) ? appUrl : 'http://127.0.0.1:8080',
  appRoot:  (appRoot) ? appRoot : 'http://127.0.0.1:8080',
  version: '0.0.1',
  hephaestus: '2.0.0',
  provider: (provider) ? provider : null,
};
