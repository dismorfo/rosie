'use strict'

module.exports = exports = {
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
