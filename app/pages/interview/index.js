'use strict'

function interview (data) {
  const agartha = process.agartha
  const datasource = agartha.path.join(agartha.appDir(), 'app/localsource/interviews.json')
  const videosMap = agartha.path.join(agartha.appDir(), 'app/localsource/video_links.json')
  const appUrl = agartha.get('appUrl')
  const defaultData = {
    "id" : "interview",
    "title" : "Interviews",
    "route" : "/interviews/*",
    "menu": [],
    "content" : {},
    "assets" : {
      "js" : [
        "jquery.1.4.4.js", 
        "jquery.once.1.2.js",
        "drupal.js", 
        "jquery.formalize.js", 
        "omega-mediaqueries.js", 
        "omega-equalheights.js",
        "settings.js"
      ]
    }
  }
  agartha._.extend(data, defaultData)
  agartha.copy(
    agartha.path.join(agartha.appDir(), 'app/pages/interview/transcripts'), 
    agartha.path.join(agartha.appBuildDir(), 'transcripts'),
    (err) => {
      if (err) {
        return console.error(err)
      }
   })
  if (agartha.exists(datasource) && agartha.exists(videosMap)) {
    const source = agartha.read.json(datasource)
    const map = agartha.read.json(videosMap)
    const docs = source.response.docs
    data.content = {}
    agartha._.each(docs, (document) => {
      const video = agartha.get('provider') + map[document.identifier] + '/mode/embed'
      const search = 'http://sites.dlib.nyu.edu/rosie'
      const replace = ''
      const transcript = document.metadata.transcript.value[0]
      const transcriptBasename = agartha.path.basename(transcript)
      const stats = agartha.fs.statSync(agartha.path.join(agartha.appDir(), 'app/pages/interview/transcripts', transcriptBasename))
      const handle = document.metadata.handle.value[0]
      const description = document.metadata.description.value.safe_value
      let image = document.metadata.rosie_representative_image.value[0]
      let imageBasename = document.identifier + '-interview-thumbnail' + agartha.path.extname(agartha.path.basename(image))
      let ackknowledgements = ''
      if (!agartha._.isUndefined(document.metadata.rosie_ackknowledgements.value)) {
        if (agartha._.isString(document.metadata.rosie_ackknowledgements.value[0])) {
          ackknowledgements = document.metadata.rosie_ackknowledgements.value[0]
        }
      }
      data.route = document.entity_path.replace(search, replace)  + '/index.html'
      data.content.grid = 12
      data.content.appUrl = appUrl
      data.content.title = document.entity_title
      data.content.pdf_path = agartha.path.join('/transcripts', transcriptBasename)
      data.content.pdf_length = stats.size
      data.content.path_filename = transcriptBasename
      data.content.handle = handle
      data.content.acknowledgements = ackknowledgements
      data.content.description = description
      data.content.image = agartha.get('appUrl') + '/images/' + imageBasename
      data.content.video = video
      agartha.emit('task.done', data)
    })
  }
}

module.exports = exports = interview
