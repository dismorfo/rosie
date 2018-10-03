'use strict'

const SolrBuildDocuments = class {
  get command () {
    return 'solr-build-documents'
  }
  get alias () {
    return false
  }
  get description () {
    return 'Build Rosie Solr documents'
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
    try {
      const datasource = path.join(agartha.appDir(), 'app/localsource/interviews.json')
      if (agartha.exists(datasource)) {
        const source = agartha.read.json(datasource)
        const transcriptsDir = path.join(agartha.appDir(), 'app/pages/interview/transcripts')
        const documentsPath = path.join(agartha.appDir(), 'app/localsource/solr-index-documents')
        if (agartha.exists(documentsPath)) {
          agartha.mkdir(documentsPath)
        }
        agartha._.each(source.response.docs, (document, index) => {
          const remove = 'http://sites.dlib.nyu.edu/rosie/sites/default/files/transcripts/'
          const transcript = agartha.path.join(transcriptsDir, document.metadata.transcript.value[0].replace(remove, ''))
          const id = document.entity_path.replace('http://sites.dlib.nyu.edu/rosie/interviews/', '')
          let image = document.metadata.rosie_representative_image.value[0].replace('http://sites.dlib.nyu.edu/rosie/sites/default/files/representative_images/', '')
              image = image.replace('http://sites.dlib.nyu.edu/rosie/sites/default/files/ROSIE_INTERVIEW_012/', '')
          let imageBasename = agartha.path.basename(image)     
          let name = document.identifier + '-interview-thumbnail' + agartha.path.extname(image)
          const imageUrl = agartha.appUrl() + '/images/' + name
          const description = document.metadata.description.value.summary
          let doc = {
            id: id,
            identifier: document.metadata.identifier.value[0],
            hash: agartha.get('shortName'),
            url: agartha.get('appUrl') + '/interviews/' + id,
            label: document.entity_title,
            description: description,
            image: imageUrl,
            type: document.type,
            content: description
          }
          let pdf = agartha.read.pdf(transcript)
          pdf.on('pdfParser_dataReady', pdfData => {
            doc.content = doc.description + ' ' + pdf.getRawTextContent()
            agartha.write(path.join(documentsPath, id + '.json'), JSON.stringify(doc))
          })
        })        
      }
    } catch (e) {
      console.log(e)
      agartha.exit(e)
    }
  }
}

module.exports = exports = SolrBuildDocuments
