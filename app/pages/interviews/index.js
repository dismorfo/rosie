'use strict'

function interviews (data) {
  const agartha = process.agartha
  const datasource = agartha.path.join(agartha.appDir(), 'app/localsource/interviews.json')
  const search = 'http://sites.dlib.nyu.edu/rosie'
  const replace = ''
  const defaultData = {
    "id" : "interviews",
    "title" : "Interviews",
    "route" : "/interviews/index.html",
    "menu": [
      {
        "context": "navbar",
        "label": "Interviews",
        "weight": 3
      }
    ],
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

  data.content = {}
  data.content.grid = 12
  data.content.title = 'Interviews'
  data.content.interviewee = []

  if (agartha.exists(datasource)) {
    const source = agartha.read.json(datasource)
    const docs = source.response.docs
    agartha._.each(docs, (document) => {
      let interviewee = {}
      let image = document.metadata.rosie_representative_image.value[0]
      let imageBasename = document.identifier + '-interview-thumbnail' + agartha.path.extname(agartha.path.basename(image))
      interviewee.url = agartha.get('appUrl') + document.entity_path.replace(search, replace)
      interviewee.description = document.metadata.description.value.safe_summary
      interviewee.image = agartha.path.join(agartha.get('appUrl'), 'images', imageBasename)
      interviewee.name = document.entity_title
      data.content.interviewee.push(interviewee)
    })

    agartha.emit('task.done', data)
    
  }
}

module.exports = exports = interviews
