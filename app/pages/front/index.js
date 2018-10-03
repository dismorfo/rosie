'use strict'

module.exports = exports = {
  id: 'home',
  title: 'Home',
  route: '/index.html',
  menu: [
    {
      context: 'navbar',
      label: 'Home',
      weight: 1
    }
  ],
  assets: {
    js: [
      'jquery.1.4.4.js', 
      'jquery.once.1.2.js',
      'drupal.js',
      'jquery.formalize.js',
      'omega-mediaqueries.js',
      'omega-equalheights.js',
      'settings.js'
    ]
  }
}
