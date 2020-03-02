const { 
  appBuildDir, 
  appDir, 
  appUrl,
  copy, 
  exists, 
  get, 
  Page, 
  read 
} = require('hephaestus');

const { 
  resolve, 
  extname, 
  basename 
} = require('path');

const { 
  statSync 
} = require('fs');

const _ = require('underscore');

const commonLib = require(resolve(appDir(), 'app/javascript/commonLib.js'));

class Interview extends Page {
  init () {
    const datasource = resolve(appDir(), 'app/localsource/interviews.json');
    const videosMap = resolve(appDir(), 'app/localsource/video_links.json');
    // copy transcripts files into public directory
    copy(resolve(appDir(), 'app/pages/interview/transcripts'),  resolve(appBuildDir(), 'transcripts'), err => {
      if (err) {
        return console.error(err);
      }
    });

    this.addJS(commonLib);

    if (exists(datasource) && exists(videosMap)) {
      const source = read.json(datasource);
      const map = read.json(videosMap);
      const search = 'http://sites.dlib.nyu.edu/rosie';
      const replace = '';
      _.each(source.response.docs, document => {
        let content = {};
        const video = get('provider') + map[document.identifier] + '/mode/embed';
        const transcript = document.metadata.transcript.value[0];
        const transcriptBasename = basename(transcript);
        const stats = statSync(resolve(appDir(), 'app/pages/interview/transcripts', transcriptBasename));
        const handle = document.metadata.handle.value[0];
        const description = document.metadata.description.value.safe_value;
        const id = document.entity_path.replace(search, replace).replace('/interviews/', '');
        let image = document.metadata.rosie_representative_image.value[0]
        let imageBasename = document.identifier + '-interview-thumbnail' + extname(basename(image))
        let ackknowledgements = ''
        if (!_.isUndefined(document.metadata.rosie_ackknowledgements.value)) {
          if (_.isString(document.metadata.rosie_ackknowledgements.value[0])) {
            ackknowledgements = document.metadata.rosie_ackknowledgements.value[0]
          }
        }      
        content.grid = 12;
        content.appUrl = appUrl();
        content.title = document.entity_title;
        content.pdf_path = `${content.appUrl}/transcripts/${transcriptBasename}`
        content.pdf_length = stats.size;
        content.path_filename = transcriptBasename;
        content.handle = handle;
        content.acknowledgements = ackknowledgements;
        content.description = description;
        content.image = `${content.appUrl}/images/${imageBasename}`;
        content.video = video;
        /**
         * Pages need 'id' and 'route' properties
         */
        this.render({
          id: id,
          route: document.entity_path.replace(search, replace)  + '/index.html' ,
          content: content
        });
      });
    }
  }
}

module.exports = Interview;
