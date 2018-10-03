'use strict'

module.exports = exports = {
  id: 'about',
  title: 'About',
  route : '/about/index.html',
  menu: [
    {
      context: 'navbar',
      label: 'About',
      weight: 1
    }
  ],
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
