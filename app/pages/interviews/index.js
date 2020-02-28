const { 
  appDir, 
  appUrl,
  exists, 
  get, 
  Page, 
  read 
} = require('hephaestus');

const { 
  basename, 
  extname, 
  resolve 
} = require('path');

const _ = require('underscore');

class Interviews extends Page {
  init() {
    const datasource = resolve(appDir(), 'app/localsource/interviews.json');
    const search = 'http://sites.dlib.nyu.edu/rosie/';
    const replace = '';
    const id = 'interviews';
    const route = '/interviews/index.html';
    const commonLib = require(resolve(appDir(), 'app/javascript/commonLib.js'));
    let content = {};    
    this.addJS(commonLib);    
    content.grid = 12;
    content.title = 'Interviews';
    content.interviewee = [];
    if (exists(datasource)) {
      const source = read.json(datasource);
      _.each(source.response.docs, document => {
        let interviewee = {};
        let image = document.metadata.rosie_representative_image.value[0];
        let imageBasename = document.identifier + '-interview-thumbnail' + extname(basename(image));
        interviewee.url = `${appUrl()}/${document.entity_path.replace(search, replace)}`;
        interviewee.description = document.metadata.description.value.safe_summary;
        interviewee.image = `${appUrl()}/images/${imageBasename}`;
        interviewee.name = document.entity_title;
        content.interviewee.push(interviewee);
      });
      /**
       * Pages need 'id' and 'route' properties
       */
      this.render({ id: id, route: route, content: content });
    }
  }
}

module.exports = Interviews;
