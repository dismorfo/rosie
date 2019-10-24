const { 
  resolve 
} = require('path');

const { 
  appDir 
} = require('hephaestus');

const commonLib = require(resolve(appDir(), 'app/javascript/commonLib.js'));

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
    js : commonLib
  }
};
