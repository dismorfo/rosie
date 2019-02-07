'use strict'

module.exports = {
  id: 'about',
  title: 'About',
  route : '/about/index.html',
  content : {
    main: {
      title : 'About The Project',
      localsource: 'content.main.html'
    }
  },
  assets : {
    js : [
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
