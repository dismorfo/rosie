'use strict'

module.exports = exports = {
  "id" : "search",
  "title" : "Search results",
  "route" : "/search/index.html", 
  "menu": [],
  "content" : {},
  "host" : "dev-discovery.dlib.nyu.edu",
  "port" : "8983",
  "protocol" : "http",
  "path" : "/solr/rosie",
  "rows" : "100",
  "start" : "0",
  "assets" : {
    "js" : [
      "https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js",
      "https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js",
      "axios-solr-client.js",
      "ui.js"
    ]
  }
}
