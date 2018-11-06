'use strict';

module.exports = exports = class Interviews extends process.agartha.Page {
  init() {
    const agartha = process.agartha;
    const datasource = agartha.path.join(agartha.appDir(), 'app/localsource/interviews.json');
    const search = 'http://sites.dlib.nyu.edu/rosie';
    const replace = '';
    const id = 'interviews';
    const title = 'Interviews';
    const route = '/interviews/index.html';
    const menu = [ {
        "context": "navbar",
        "label": "Interviews",
        "weight": 3
      }
    ];
    let content = {};
    this.addJS([
      'jquery.1.4.4.js', 
      'jquery.once.1.2.js', 
      'drupal.js', 
      'jquery.formalize.js', 
      'omega-mediaqueries.js', 
      'omega-equalheights.js', 
      'settings.js'
    ]);    
    content.grid = 12;
    content.title = 'Interviews';
    content.interviewee = [];
    if (agartha.exists(datasource)) {
      const source = agartha.read.json(datasource);
      const docs = source.response.docs;
      agartha._.each(docs, (document) => {
        let interviewee = {};
        let image = document.metadata.rosie_representative_image.value[0];
        let imageBasename = document.identifier + '-interview-thumbnail' + agartha.path.extname(agartha.path.basename(image));
        interviewee.url = agartha.get('appUrl') + document.entity_path.replace(search, replace);
        interviewee.description = document.metadata.description.value.safe_summary;
        interviewee.image = agartha.get('appUrl') + '/images/' + imageBasename;
        interviewee.name = document.entity_title;
        content.interviewee.push(interviewee);
      });
      /**
       * Pages need 'id' and 'route' properties
       */
      this.render({
        id: id,
        route: route,
        content: content
      });
    }
  }
}
