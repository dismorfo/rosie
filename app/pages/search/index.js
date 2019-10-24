const { 
  get
} = require('hephaestus');

module.exports = {
  id: 'search',
  title: 'Search results',
  route: '/search/index.html',
  discovery: get('ROSIE_DISCOVERY'),
  rows: 100,
  start: 0,
  assets: {
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
      'ui.js'
    ]
  }
};
