'use strict'

const { agartha } = require('hephaestus')

module.exports = exports = class Interview extends agartha.Page {
  init () {
    /**
     * Hephaestus it's already present
     */
    const hephaestus = this.hephaestus
    const datasource = hephaestus.path.join(hephaestus.appDir(), 'app/localsource/interviews.json')
    const videosMap = hephaestus.path.join(hephaestus.appDir(), 'app/localsource/video_links.json')
    const appUrl = hephaestus.get('appUrl')
    // copy transcripts files into public directory
    hephaestus.copy(
      hephaestus.path.join(hephaestus.appDir(), 'app/pages/interview/transcripts'), 
      hephaestus.path.join(hephaestus.appBuildDir(), 'transcripts'),
      (err) => {
        if (err) {
          return console.error(err)
        }
    })

    this.addJS([
      'jquery.1.4.4.js', 
      'jquery.once.1.2.js', 
      'drupal.js', 
      'jquery.formalize.js', 
      'omega-mediaqueries.js', 
      'omega-equalheights.js', 
      'settings.js'
    ])

    if (hephaestus.exists(datasource) && hephaestus.exists(videosMap)) {
      const source = hephaestus.read.json(datasource)
      const map = hephaestus.read.json(videosMap)
      const docs = source.response.docs
      hephaestus._.each(docs, (document) => {
        const video = hephaestus.get('provider') + map[document.identifier] + '/mode/embed'
        const search = 'http://sites.dlib.nyu.edu/rosie'
        const replace = ''
        const transcript = document.metadata.transcript.value[0]
        const transcriptBasename = hephaestus.path.basename(transcript)
        const stats = hephaestus.fs.statSync(hephaestus.path.join(hephaestus.appDir(), 'app/pages/interview/transcripts', transcriptBasename))
        const handle = document.metadata.handle.value[0]
        const description = document.metadata.description.value.safe_value
        const route = document.entity_path.replace(search, replace)  + '/index.html'
        const id = document.entity_path.replace(search, replace).replace('/interviews/', '')
        let content = {}
        let image = document.metadata.rosie_representative_image.value[0]
        let imageBasename = document.identifier + '-interview-thumbnail' + hephaestus.path.extname(hephaestus.path.basename(image))
        let ackknowledgements = ''
        if (!hephaestus._.isUndefined(document.metadata.rosie_ackknowledgements.value)) {
          if (hephaestus._.isString(document.metadata.rosie_ackknowledgements.value[0])) {
            ackknowledgements = document.metadata.rosie_ackknowledgements.value[0]
          }
        }      
        content.grid = 12
        content.appUrl = appUrl
        content.title = document.entity_title
        content.pdf_path = hephaestus.get('appUrl') + '/transcripts/' + transcriptBasename
        content.pdf_length = stats.size
        content.path_filename = transcriptBasename
        content.handle = handle
        content.acknowledgements = ackknowledgements
        content.description = description
        content.image = hephaestus.get('appUrl') + '/images/' + imageBasename
        content.video = video
        /**
         * Pages need 'id' and 'route' properties
         */
        this.render({
          id: id,
          route: document.entity_path.replace(search, replace)  + '/index.html' ,
          content: content
        })
      })
    }
  }
}
