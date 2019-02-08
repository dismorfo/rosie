'use strict'

const { join } = require('path');
const { appBuildDir, appDir } = require('hephaestus');
const appBuildDirectory = appBuildDir();
const appDirectory = appDir();

module.exports = [
  {
    file: join(appDirectory, 'app/sass/style.scss'),
    outFile: join(appBuildDirectory, 'css/style.css'),
    map: join(appBuildDirectory, 'css/style.css.map')
  },
  {
    file: join(appDirectory, 'app/sass/ie8.scss'),
    outFile: join(appBuildDirectory, 'css/ie8.css'),
    map: join(appBuildDirectory, 'css/ie8.css.map'),
    omit: true
  },
  {
    file: join(appDirectory, 'app/sass/ie7.scss'),
    outFile: join(appBuildDirectory, 'css/ie7.css'),
    map: join(appBuildDirectory, 'css/ie7.css.map'),
    omit: true
  },
  {
    file: join(appDirectory, 'app/sass/rosie-html5-alpha-default-normal.scss'),
    outFile: join(appBuildDirectory, 'css/rosie-html5-alpha-default-normal.css'),
    map: join(appBuildDirectory, 'css/rosie-html5-alpha-default-normal.css.map'),
    omit: true
  },
  {
    file: join(appDirectory, 'app/sass/alpha-default-normal-12.scss'),
    outFile: join(appBuildDirectory, 'css/alpha-default-normal-12.css'),
    map: join(appBuildDirectory, 'css/alpha-default-normal-12.css.map'),
    omit: true
  },
  {
    file: join(appDirectory, 'app/sass/rosie-html5-alpha-default-narrow.scss'),
    outFile: join(appBuildDirectory, 'css/rosie-html5-alpha-default-narrow.css'),
    map: join(appBuildDirectory, 'css/rosie-html5-alpha-default-narrow.css.map'),
    omit: true
  },
  {
    file: join(appDirectory, 'app/sass/alpha-default-narrow-12.scss'),
    outFile: join(appBuildDirectory, 'css/alpha-default-narrow-12.css'),
    map: join(appBuildDirectory, 'css/alpha-default-narrow-12.css.map'),
    omit: true
  },
  {
    file: join(appDirectory, 'app/sass/rosie-html5-alpha-default-wide.scss'),
    outFile: join(appBuildDirectory, 'css/rosie-html5-alpha-default-wide.css'),
    map: join(appBuildDirectory, 'css/rosie-html5-alpha-default-wide.css.map'),
    omit: true
  },
  {
    file: join(appDirectory, 'app/sass/alpha-default-wide-12.scss'),
    outFile: join(appBuildDirectory, 'css/alpha-default-wide-12.css'),
    map: join(appBuildDirectory, 'css/alpha-default-wide-12.css.map'),
    omit: true
  }
];
