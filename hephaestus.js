const { 
  get, appUrl
} = require('hephaestus');

const provider = get('PROVIDER');
const gtag = get('GTAG');

module.exports = {
  appName: 'The Real Rosie the Riveter Project',
  shortName: 'rosie',
  appUrl: appUrl(),
  version: '0.0.1',
  hephaestus: '2.0.0',
  provider: provider,
  gtag: true,
};
