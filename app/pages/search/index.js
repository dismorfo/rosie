'use strict';

const url = require('url');
const { get } = require('hephaestus');
const discoveryUrl = new URL(get('ROSIE_DISCOVERY'));

module.exports = {
  id : 'search',
  title : 'Search results',
  route : '/search/index.html',
  host : discoveryUrl.hostname,
  port : discoveryUrl.port,
  protocol : discoveryUrl.protocol,
  path : discoveryUrl.pathname,
  rows : 100,
  start : 0,
  assets : {
    js : [
      'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js',
      'axios-solr-client.js',
      'ui.js'
    ]
  }
};
