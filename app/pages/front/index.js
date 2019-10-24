'use strict'

const { resolve } = require('path');
const { appDir } = require('hephaestus');
const commonLib = require(resolve(appDir(), 'app/javascript/commonLib.js'));

module.exports = {
  id: 'home',
  title: 'Home',
  route: '/index.html',
  assets: {
    js: commonLib
  }
}
