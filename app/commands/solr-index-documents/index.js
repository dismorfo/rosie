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
  action () {
    const agartha = process.agartha    
    const path = agartha.path
    const fs = agartha.path
    try {
      const solrVersion = '5.1'
      const corePath = agartha.get('ROSIE_SOLR_CORE_PATH')
      const host = agartha.get('ROSIE_SOLR_HOST')
      const port = agartha.get('ROSIE_SOLR_PORT')
      const documentsPathEnv = agartha.get('ROSIE_SOLR_DOCUMENTS_PATH')
      const documentsPath = (documentsPathEnv) ? documentsPathEnv : path.join(agartha.appDir(), 'app/localsource/solr-index-documents')
      if (agartha.exists(documentsPath)) {
        const documents = agartha.readdirSync(documentsPath)
        // https://www.npmjs.com/package/solr-client
        const discovery = require(path.join(agartha.cwd(), '..', 'solr-client'))
        const client = discovery.createClient({
          host: (host) ? host : 'http://127.0.0.1:8080',
          port: (port) ? port : 8983,
          path: (corePath) ? corePath : '/solr/rosie',
          solrVersion: solrVersion,
          get_max_request_entity_size: 1000,
          autoCommit: true
         })
         agartha._.each(documents, (document) => {
          const doc = readDocument(path.join(documentsPath, document))
          if (doc) {
            client.add({
              id : doc.id,
              url: doc.url,
              ts_image: doc.image,
              label : doc.label,
              hash: doc.hash,
              content : doc.content,
              ts_bio: doc.description,
              sort_name: doc.label
            }, (err) => {
                if (err) console.log(err)
            })
          }
        })
      }
    } catch (e) {
      console.log(e)
      agartha.exit(e)
    }
  }
}

module.exports = exports = SolrIndexdDocuments
