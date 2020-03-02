'use strict';

const urlList = class {
  get command () {
    return 'url-list';
  }
  get alias () {
    return false;
  }
  get description () {
    return 'List URL';
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
    const { basename, resolve } = require('path');
    const _ = require('underscore');
    const { appDir, exists, read } = require('hephaestus');
    try {
      const replaceEntityPath = 'http://sites.dlib.nyu.edu/rosie/interviews/';
      const datasource = resolve(appDir(), 'app/localsource/interviews.json');
      const baseUrl = 'https://rosie.dlib.nyu.edu';
      if (exists(datasource)) {
        const source = read.json(datasource);
        _.each(source.response.docs, document => {
          const id = document.entity_path.replace(replaceEntityPath, '');
          const url = `${baseUrl}/interviews/${id}/index.html`;
          const transcript = document.metadata.transcript.value[0];
          const transcriptUrl = `${baseUrl}/transcripts/${basename(transcript)}`;
          console.log(document.entity_path);
          console.log(url);
          console.log();
          console.log(transcript);
          console.log(transcriptUrl);
          console.log();     
        });
      }
    } catch (error) {
      console.log(error);
    }
  } 
};

module.exports = exports = urlList;
