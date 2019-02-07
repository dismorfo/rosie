'use strict'

const path = require('path');
const agartha = require('hephaestus');
const appBuildDir = agartha.appBuildDir();
const appDir = agartha.appDir();

module.exports = [
  {
    file: path.join(appDir, 'app/sass/style.scss'),
    outFile: path.join(appBuildDir, 'css/style.css'),
    map: path.join(appBuildDir, 'css/style.css.map')
  },
  {
    file: path.join(appDir, 'app/sass/ie8.scss'),
    outFile: path.join(appBuildDir, 'css/ie8.css'),
    map: path.join(appBuildDir, 'css/ie8.css.map'),
    omit: true
  },
  {
    file: path.join(appDir, 'app/sass/ie7.scss'),
    outFile: path.join(appBuildDir, 'css/ie7.css'),
    map: path.join(appBuildDir, 'css/ie7.css.map'),
    omit: true
  },
  {
    file: path.join(appDir, 'app/sass/rosie-html5-alpha-default-normal.scss'),
    outFile: path.join(appBuildDir, 'css/rosie-html5-alpha-default-normal.css'),
    map: path.join(appBuildDir, 'css/rosie-html5-alpha-default-normal.css.map'),
    omit: true
  },
  {
    file: path.join(appDir, 'app/sass/alpha-default-normal-12.scss'),
    outFile: path.join(appBuildDir, 'css/alpha-default-normal-12.css'),
    map: path.join(appBuildDir, 'css/alpha-default-normal-12.css.map'),
    omit: true
  },
  {
    file: path.join(appDir, 'app/sass/rosie-html5-alpha-default-narrow.scss'),
    outFile: path.join(appBuildDir, 'css/rosie-html5-alpha-default-narrow.css'),
    map: path.join(appBuildDir, 'css/rosie-html5-alpha-default-narrow.css.map'),
    omit: true
  },
  {
    file: path.join(appDir, 'app/sass/alpha-default-narrow-12.scss'),
    outFile: path.join(appBuildDir, 'css/alpha-default-narrow-12.css'),
    map: path.join(appBuildDir, 'css/alpha-default-narrow-12.css.map'),
    omit: true
  },
  {
    file: path.join(appDir, 'app/sass/rosie-html5-alpha-default-wide.scss'),
    outFile: path.join(appBuildDir, 'css/rosie-html5-alpha-default-wide.css'),
    map: path.join(appBuildDir, 'css/rosie-html5-alpha-default-wide.css.map'),
    omit: true
  },
  {
    file: path.join(appDir, 'app/sass/alpha-default-wide-12.scss'),
    outFile: path.join(appBuildDir, 'css/alpha-default-wide-12.css'),
    map: path.join(appBuildDir, 'css/alpha-default-wide-12.css.map'),
    omit: true
  }
];
