'use strict';

const SolrBuildDocuments = class {
  get command () {
    return 'solr-build-documents';
  }
  get alias () {
    return false;
  }
  get description () {
    return 'Build Rosie Solr documents';
  }
  get options () {
    return [];
  }
  get onInit () {
    return false;
  }
  get onDone () {
    return false;
  }
  get list () {
    return true;
  }
  action () {
    const { extname, join, resolve } = require('path');
    const _ = require('underscore');
    const { appDir, appUrl, get, exists, exit, log, mkdir, read, write } = require('hephaestus');
    try {
      const datasource = resolve(appDir(), 'app/localsource/interviews.json');
      if (exists(datasource)) {
        const source = read.json(datasource);
        const transcriptsDir = resolve(appDir(), 'app/pages/interview/transcripts');
        const documentsPath = resolve(appDir(), 'app/localsource/solr-index-documents');
        
        if (exists(documentsPath)) {
          mkdir(documentsPath);
        }

        const remove = 'http://sites.dlib.nyu.edu/rosie/sites/default/files/transcripts/';
        const replaceStringImage = 'http://sites.dlib.nyu.edu/rosie/sites/default/files/ROSIE_INTERVIEW_012/';
        const replaceStringImageUrl = 'http://sites.dlib.nyu.edu/rosie/sites/default/files/representative_images/';
        const replaceEntityPath = 'http://sites.dlib.nyu.edu/rosie/interviews/';

        _.each(source.response.docs, document => {
          const transcript = join(transcriptsDir, document.metadata.transcript.value[0].replace(remove, ''));
          const id = document.entity_path.replace(replaceEntityPath, '');
          const image = document.metadata.rosie_representative_image.value[0].replace(replaceStringImageUrl, '').replace(replaceStringImage, '');
          let name = document.identifier + '-interview-thumbnail' + extname(image);
          const imageUrl = appUrl() + '/images/' + name;
          const description = document.metadata.description.value.summary;
          const pdf = read.pdf(transcript);
          
          let doc = {
            id: id,
            identifier: document.metadata.identifier.value[0],
            hash: get('shortName'),
            url: get('appUrl') + '/interviews/' + id,
            label: document.entity_title,
            description: description,
            image: imageUrl,
            type: document.type,
            content: description
          };
          
          pdf.on('pdfParser_dataReady', () => {
            doc.content = doc.description + ' ' + pdf.getRawTextContent();
            write(resolve(documentsPath, id + '.json'), JSON.stringify(doc));
          });

        });
      }
    } catch (error) {
      log(error, error);
      exit(error);
    }
  }
};

module.exports = exports = SolrBuildDocuments;
