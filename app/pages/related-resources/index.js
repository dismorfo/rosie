'use strict'

const { resolve } = require('path');
const { appDir } = require('hephaestus');
const commonLib = require(resolve(appDir(), 'app/javascript/commonLib.js'));

module.exports = {
  id: 'related-resources',
  title: 'Related Resources',
  route: '/related-resources/index.html',
  content: {
    main: {
      title: 'Related Resources',
      localsource: 'content.main.html'      
    }
  },
  assets: {
    js: commonLib
  }
}
