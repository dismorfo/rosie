'use strict'

const SolrIndexdDocuments = class {
  get command () {
    return 'solr-index-documents'
  }
  get alias () {
    return false
  }
  get description () {
    return 'Index Rosie Solr documents'
  }
  get options () {
    return []
  }
  get onInit () {
    return false
  }
  get onDone () {
    return false
  }
  get list () {
    return true
  }
  action () {
    try {
      const { appDir, get, cwd, readdirSync, exists, read, exit} = require('hephaestus');
      const { join } = require('path');
      const url = require('url');
      const _ = require('underscore');
      const SolrNode = require('solr-node')
      const { createClient } = require(join(cwd(), '..', 'solr-client'));
      const solrVersion = '5.1';
      const discoveryUrl = new URL(get('ROSIE_DISCOVERY'));      
      const discoveryHost = discoveryUrl.hostname;
      const discoveryPort = discoveryUrl.port;
      const discoveryPath = discoveryUrl.pathname;
      const discoveryProtocol = discoveryUrl.protocol.replace(':', '');
      const discoveryCore = null;
      const discoveryRootPath = null;
      const documentsPathEnv = get('ROSIE_SOLR_DOCUMENTS_PATH');
      const documentsPath = (documentsPathEnv) ? documentsPathEnv : join(appDir(), 'app/localsource/solr-index-documents');
      if (exists(documentsPath)) {
        const documents = readdirSync(documentsPath);
        const client = new SolrNode({
          host: (discoveryHost) ? discoveryHost : 'solr.local',
          port: (discoveryPort) ? discoveryPort : 8983,
          core: (discoveryCore) ? discoveryCore : 'rosie',
          rootPath: (discoveryRootPath) ? discoveryRootPath : 'solr', 
          protocol: (discoveryProtocol) ? discoveryProtocol : 'http'          
        });
        _.each(documents, document => {
           const doc = read.json(join(documentsPath, document));
           if (doc) {
             client.update({
               id : doc.id,
               url: doc.url,
               ts_image: doc.image,
               label : doc.label,
               hash: doc.hash,
               content : doc.content,
               ts_bio: doc.description,
               sort_name: doc.label
             }, (error, result) => {
                if (error) {
                  console.log(error);
                }
                else {
                  console.log('Response:', result.responseHeader);
                }                
             });
           }
        });
      }
    } catch (e) {
      console.log(e);
      exit(e);
    }
  }
}

module.exports = exports = SolrIndexdDocuments;
