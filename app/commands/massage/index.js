'use strict'

const Massage = class {
  get command () {
    return 'massage'
  }
  get alias () {
    return 'mg'
  }
  get description () {
    return 'Massage datasource'
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
    try {
      let localsource = agartha.read.json(agartha.path.join(agartha.appDir(), 'app/localsource/interviews.json'))
      const transcriptsDir = agartha.path.join(agartha.appDir(), 'app/transcripts')
      agartha.mkdir(transcriptsDir)
      let basename = null
      for (let i = 0; i < localsource.response.docs.length; i++) {
        basename = agartha.path.basename(localsource.response.docs[i].metadata.transcript.value[0])
        agartha.request(localsource.response.docs[i].metadata.transcript.value[0]).pipe(agartha.fs.createWriteStream(agartha.path.join(transcriptsDir, basename)))
      }
    } catch (e) {
      console.log(e)
      agartha.exit(e)
    }
  }
}

module.exports = exports = Massage
