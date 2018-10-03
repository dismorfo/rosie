#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const solr = require('solr-client')
const _ = require('underscore')
const solrVersion = '5.1'
const corePath = getEnv('ROSIE_SOLR_CORE_PATH')
const host = getEnv('ROSIE_SOLR_HOST')
const port = getEnv('ROSIE_SOLR_PORT')
const documentsPathEnv = getEnv('ROSIE_SOLR_DOCUMENTS_PATH')

function readDocument (filePath) {
  if (exists(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    catch (error) {
      console.log(error)
    }
  }
}

function cwd () {
  return __dirname
}

function getEnv (option) {
  if (_.has(process.env, option)) {
    return process.env[option]
  }
  return false
}

function exists (filePath) {
  try {
    fs.accessSync(filePath, fs.F_OK)
    return true
  }
  catch (e) {
    return false
  }
}

try {
  const documentsPath = (documentsPathEnv) ? documentsPathEnv : path.join(cwd(), 'documents')
  if (exists(documentsPath)) {
    const documents = fs.readdirSync(documentsPath)
    const client = solr.createClient({
      host: (host) ? host : 'http://127.0.0.1:8080',
      port: (port) ? port : 8983,
      path: (corePath) ? corePath : '/solr/rosie',
      solrVersion: solrVersion,
      get_max_request_entity_size: 1000,
      autoCommit: true
     })
    _.each(documents, (document) => {
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
}
